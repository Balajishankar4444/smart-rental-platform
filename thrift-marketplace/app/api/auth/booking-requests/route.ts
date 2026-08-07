// app/api/auth/booking-requests/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { deriveListingStatus, listingTitle, rentalDays } from '@/utils/listings';
import { readProducts, writeProducts, toSummary, StoredProduct } from '@/lib/productStore';
import {
  BookingRequest,
  deriveRequestStatus,
  paymentDeadlineFor,
} from '@/utils/bookingRequests';

const dataFilePath = path.join(process.cwd(), 'data', 'booking-requests.json');

function readRequests(): BookingRequest[] {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, '[]', 'utf8');

  const parsed = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

function writeRequests(requests: BookingRequest[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(requests, null, 2), 'utf8');
}

// Expiry is time-based, so it is applied on every read rather than stored
function withDerivedStatus(request: BookingRequest): BookingRequest {
  return { ...request, status: deriveRequestStatus(request) };
}

function coverImage(product: StoredProduct) {
  return product.images?.[product.primaryImageIndex || 0] || '';
}

// GET: every request where the user is the owner or the renter, newest first
export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const data = readRequests()
      .filter((item) => item.ownerId === userId || item.renterId === userId)
      .map(withDerivedStatus)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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

    const product = readProducts().find((item) => item.id === listingId);

    if (!product || deriveListingStatus(product) !== 'active') {
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

    const requests = readRequests();
    const alreadyOpen = requests
      .map(withDerivedStatus)
      .some(
        (item) =>
          item.listingId === listingId &&
          item.renterId === renterId &&
          (item.status === 'pending' || item.status === 'approved')
      );

    if (alreadyOpen) {
      return NextResponse.json(
        { success: false, error: 'You already have an open request for this listing' },
        { status: 409 }
      );
    }

    const days = rentalDays({ renterId, startDate, endDate, bookedAt: '' });
    const dailyPrice = Number(product.dailyPrice) || 0;

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
      createdAt: new Date().toISOString(),
      decidedAt: null,
      paymentDeadline: null,
      paidAt: null,
    };

    requests.push(bookingRequest);
    writeRequests(requests);

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

    const requests = readRequests();
    const bookingRequest = requests.find((item) => item.id === id);

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
          { success: false, error: 'This request has already been decided' },
          { status: 409 }
        );
      }

      const decidedAt = new Date().toISOString();
      bookingRequest.decidedAt = decidedAt;

      if (action === 'approve') {
        bookingRequest.status = 'approved';
        bookingRequest.paymentDeadline = paymentDeadlineFor(decidedAt, bookingRequest.startDate);
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

      // Payment is what actually starts the rental, so the listing flips here
      const products = readProducts();
      const product = products.find((item) => item.id === bookingRequest.listingId);

      if (!product || deriveListingStatus(product) !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Listing is no longer available' },
          { status: 409 }
        );
      }

      product.rental = {
        renterId: bookingRequest.renterId,
        startDate: bookingRequest.startDate,
        endDate: bookingRequest.endDate,
        bookedAt: new Date().toISOString(),
      };
      writeProducts(products);

      bookingRequest.status = 'paid';
      bookingRequest.paidAt = new Date().toISOString();

      writeRequests(requests);

      return NextResponse.json(
        { success: true, data: bookingRequest, listing: toSummary(product) },
        { status: 200 }
      );
    }

    writeRequests(requests);

    return NextResponse.json({ success: true, data: bookingRequest }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking request' },
      { status: 500 }
    );
  }
}
