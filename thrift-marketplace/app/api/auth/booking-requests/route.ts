// app/api/auth/booking-requests/route.ts
import { NextResponse } from 'next/server';
import { dbService } from '@/services/DbService';
import { deriveListingStatus, listingTitle, rentalDays, datesOverlap } from '@/utils/listings';
import {
  BookingRequest,
  deriveRequestStatus,
  paymentDeadlineFor,
  approvalDeadlineFor,
} from '@/utils/bookingRequests';

function withDerivedStatus(request: any): any {
  return { ...request, status: deriveRequestStatus(request) };
}

function coverImage(product: any) {
  return product.images?.[product.primaryImageIndex || 0] || '';
}

// GET: every request where the user is the owner or the renter, newest first
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');
    const renterId = searchParams.get('renterId');

    if (!userId && !listingId && !renterId) {
      return NextResponse.json({ success: false, error: 'userId, listingId or renterId is required' }, { status: 400 });
    }

    const db = dbService.readDb();
    const listings = db.listings || [];
    const validListingIds = new Set(listings.map((item: any) => item.id));

    let requests = (db.bookingRequests || []).filter((item: any) => validListingIds.has(item.listingId));

    if (userId) {
      requests = requests.filter((item: any) => item.ownerId === userId || item.renterId === userId);
    }
    if (listingId) {
      requests = requests.filter((item: any) => item.listingId === listingId);
    }
    if (renterId) {
      requests = requests.filter((item: any) => item.renterId === renterId);
    }

    const data = requests
      .map(withDerivedStatus)
      .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error reading booking requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking requests' },
      { status: 500 }
    );
  }
}

// POST: a renter asks the owner for a set of dates. No money moves yet.
export async function POST(request: Request) {
  try {
    const { listingId, renterId, renterName, startDate, endDate } = await request.json();

    if (!listingId || !renterId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'listingId, renterId, startDate and endDate are required' },
        { status: 400 }
      );
    }

    const db = dbService.readDb();  
const product = db.listings.find((item) => item.id === listingId);

    if (!product || product.deletedAt) {  
  return NextResponse.json(  
    { success: false, error: 'Listing is not available for booking' },  
    { status: 409 }  
  );  
}

    if (product.userId === renterId) {  
  return NextResponse.json(  
    { success: false, error: 'You cannot rent your own listing' },  
    { status: 400 }  
  );  
}  

    const requests = db.bookingRequests || [];

    const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>  
  new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);  
  
// block only if the requested dates overlap the confirmed rental  
if (product.rental && overlaps(startDate, endDate, product.rental.startDate, product.rental.endDate)) {  
  return NextResponse.json(  
    { success: false, error: 'Those dates are already booked' },  
    { status: 409 }  
  );  
}  
  
// block only if the requested dates overlap another live request for this listing  
// block only if the requested dates overlap another LIVE request for this listing  
const conflict = requests.some((item) => {  
  const status = deriveRequestStatus(item); // recompute so lapsed approvals count as expired  
  return (  
    item.listingId === listingId &&  
    (status === 'pending' || status === 'approved' || status === 'paid') &&  
    overlaps(startDate, endDate, item.startDate, item.endDate)  
  );  
});  
if (conflict) {  
  return NextResponse.json(  
    { success: false, error: 'Those dates are already requested' },  
    { status: 409 }  
  );  
}

    const days = rentalDays({ renterId, startDate, endDate, bookedAt: '' });
    const dailyPrice = Number(product.dailyPrice) || 0;
    const createdAt = new Date().toISOString();

    const bookingRequest: BookingRequest = {
      id: `req_${Date.now()}`,
      listingId,
      listingTitle: listingTitle({ productName: String(product.productName || '') }),
      listingImage: coverImage(product),
      ownerId: product.userId,
      renterId,
      renterName: renterName || 'A renter',
      startDate,
      endDate,
      days,
      totalAmount: dailyPrice * days,
      status: 'pending',
      createdAt,
      decidedAt: null,
      approvalDeadline: approvalDeadlineFor(createdAt, startDate),
      paymentDeadline: null,
      paidAt: null,
    };

    if (!Array.isArray(db.bookingRequests)) {
      db.bookingRequests = [];
    }
    db.bookingRequests.unshift(bookingRequest);
    dbService.writeDb(db);

    return NextResponse.json({ success: true, data: bookingRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}

// PATCH: owner approves/declines, renter pays or cancels
export async function PATCH(request: Request) {
  try {
    const { id, userId, action } = await request.json();

    if (!id || !userId || !['approve', 'decline', 'pay', 'cancel'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'id, userId and a valid action are required' },
        { status: 400 }
      );
    }

    const db = dbService.readDb();
    const requests = db.bookingRequests || [];
    const bookingRequest = requests.find((item: any) => item.id === id);

    if (!bookingRequest) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    const status = deriveRequestStatus(bookingRequest);
    const isOwner = bookingRequest.ownerId === userId;
    const isRenter = bookingRequest.renterId === userId;

    if (action === 'approve' || action === 'decline') {
      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: 'Only the owner can decide on this request' },
          { status: 403 }
        );
      }

      if (status !== 'pending') {
        return NextResponse.json(
          { success: false, error: 'This request has already been decided or expired' },
          { status: 409 }
        );
      }

      const decidedAt = new Date().toISOString();
      bookingRequest.decidedAt = decidedAt;

      if (action === 'approve') {
        bookingRequest.status = 'approved';
        bookingRequest.paymentDeadline = paymentDeadlineFor(decidedAt);
      } else {
        bookingRequest.status = 'declined';
      }
    } else if (action === 'cancel') {
      if (!isRenter) {
        return NextResponse.json(
          { success: false, error: 'Only the renter can cancel this request' },
          { status: 403 }
        );
      }

      if (status !== 'pending' && status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'This request can no longer be cancelled' },
          { status: 409 }
        );
      }

      bookingRequest.status = 'cancelled';
    } else {
      if (!isRenter) {
        return NextResponse.json(
          { success: false, error: 'Only the renter can pay for this request' },
          { status: 403 }
        );
      }

      if (status === 'expired') {
        return NextResponse.json(
          { success: false, error: 'The payment window has expired' },
          { status: 409 }
        );
      }

      if (status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'This request is not approved for payment' },
          { status: 409 }
        );
      }

      const product = db.listings.find((item) => item.id === bookingRequest.listingId);

      if (!product || product.deletedAt) {  
  return NextResponse.json(  
    { success: false, error: 'Listing is no longer available' },  
    { status: 409 }  
  );  
}  
  
// Someone else may have paid for overlapping dates while this sat approved  
const alreadyPaid = requests.some(  
  (item) =>  
    item.id !== bookingRequest.id &&  
    item.listingId === bookingRequest.listingId &&  
    item.status === 'paid' &&  
    datesOverlap(bookingRequest.startDate, bookingRequest.endDate, item.startDate, item.endDate)  
);  
  
if (alreadyPaid) {  
  return NextResponse.json(  
    { success: false, error: 'Those dates were just booked by someone else' },  
    { status: 409 }  
  );  
}

      product.rental = {
        renterId: bookingRequest.renterId,
        startDate: bookingRequest.startDate,
        endDate: bookingRequest.endDate,
        bookedAt: new Date().toISOString(),
      };

      bookingRequest.status = 'paid';
      bookingRequest.paidAt = new Date().toISOString();

      dbService.writeDb(db);

      return NextResponse.json(
        { success: true, data: bookingRequest },
        { status: 200 }
      );
    }

    dbService.writeDb(db);

    return NextResponse.json({ success: true, data: bookingRequest }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking request' },
      { status: 500 }
    );
  }
}