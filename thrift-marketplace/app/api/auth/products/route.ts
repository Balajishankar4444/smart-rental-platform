// app/api/auth/products/route.ts
import { NextResponse } from 'next/server';
import { dbService } from '@/services/DbService';
import { deriveListingStatus } from '@/utils/listings';

// Helper to calculate or derive listing status
function withStatus(product: any) {
  return {
    ...product,
    status: deriveListingStatus(product),
  };
}

function toSummary(product: any) {
  const detailed = withStatus(product);

  return {
    id: detailed.id,
    userId: detailed.userId,
    productName: detailed.productName,
    category: detailed.category,
    propertyType: detailed.propertyType,
    brand: detailed.brand,
    dailyPrice: detailed.dailyPrice,
    images: detailed.images,
    primaryImageIndex: detailed.primaryImageIndex || 0,
    city: detailed.city,
    status: detailed.status,
    rental: detailed.rental,
    createdAt: detailed.createdAt,

    // Keep fields required by Browse filters
    bedType: detailed.bedType || "",
  };
}

export async function GET(request: Request) {
  try {
    const db = dbService.readDb();
    const products = db.listings || [];
    const users = db.users || [];

    const attachOwner = (item: any) => {
  const owner = users.find(
    (u: any) => u.id === item.userId || u.email === item.userId
  );

  const ownerLanguage = Array.isArray(owner?.language)
    ? owner.language
    : owner?.language
      ? [owner.language]
      : [];

  return {
    ...item,

    ownerName: owner
      ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() ||
        owner.email
      : "Unknown Host",

    ownerAvatar: owner?.avatar || "",
    ownerGender: owner?.gender || "",
    ownerLanguage,

    // Keep product bed type
    bedType: item.bedType || "",
  };
};

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const renterId = searchParams.get('renterId');
    const excludeUserId = searchParams.get('excludeUserId');
    const status = searchParams.get('status');

    if (id) {
      const product = products.find((item: any) => item.id === id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
      }

      const detailedProduct = withStatus(product);
      const owner = users.find((u: any) => u.id === detailedProduct.userId || u.email === detailedProduct.userId);
      
      const payload = {
  ...detailedProduct,
  ownerName: owner?.fullName || "",
  ownerAvatar: owner?.avatar || "",
  ownerLanguage: Array.isArray(owner?.language)
  ? owner.language
  : owner?.language
  ? [owner.language]
  : [],
  ownerCoverPhoto: owner?.coverPhoto || "",
  ownerBio: owner?.bio || "",
  ownerGender: owner?.gender || "",
  ownerProfession: owner?.profession || "",
  ownerAge: owner?.dob  
    ? Math.floor(  
        (Date.now() - new Date(owner.dob).getTime()) /  
          (365.25 * 24 * 60 * 60 * 1000)  
      )  
    : "",
  ownerActiveItemsCount: products.filter(
    (item: any) => item.userId === detailedProduct.userId
  ).length,
};

      return NextResponse.json({ success: true, data: payload }, { status: 200 });
    }

    const data = products
      .filter((product: any) => Boolean(product.userId))
      .filter((product: any) => (userId ? product.userId === userId : true))
      .filter((product: any) => (excludeUserId ? product.userId !== excludeUserId : true))
      .filter((product: any) => (renterId ? product.rental?.renterId === renterId : true))
      .map(toSummary)
      .map(attachOwner)
      .filter((product: any) => {
        if (status === 'all') return true;
        if (status) return product.status === status;
        return product.status !== 'deleted';
      });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error reading products from database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();

    if (!newProduct.userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required to create a listing' },
        { status: 400 }
      );
    }

    const db = dbService.readDb();
    const users = db.users || [];

    const productWithMeta = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      rental: null,
      deletedAt: null,
      createdAt: newProduct.createdAt || new Date().toISOString(),
    };

    dbService.saveListing(productWithMeta);

    const summary = toSummary(productWithMeta);
    const owner = users.find((u: any) => u.id === summary.userId || u.email === summary.userId);
    const data = {
  ...summary,
  ownerName: owner?.fullName || "Verified lender",
  ownerAvatar: owner?.avatar || "",
  ownerGender: owner?.gender || "",
  ownerLanguage: Array.isArray(owner?.language)
    ? owner.language
    : owner?.language
      ? [owner.language]
      : [],
};

    return NextResponse.json(
      {
        success: true,
        message: 'Product successfully added to database',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error writing product to database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save product listing' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action, renterId, startDate, endDate, userId } = await request.json();

    if (!id || (action !== 'rent' && action !== 'return')) {
      return NextResponse.json(
        { success: false, error: 'id and a valid action ("rent" or "return") are required' },
        { status: 400 }
      );
    }

    const db = dbService.readDb();
    const product = db.listings.find((item: any) => item.id === id);

    if (!product || product.deletedAt) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    if (action === 'rent') {
      if (!renterId || !startDate || !endDate) {
        return NextResponse.json(
          { success: false, error: 'renterId, startDate and endDate are required to rent' },
          { status: 400 }
        );
      }

      if (deriveListingStatus(product) !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Listing is already rented out' },
          { status: 409 }
        );
      }

      product.rental = { renterId, startDate, endDate, bookedAt: new Date().toISOString() };
    } else {
      const rental = product.rental;
      if (!rental) {
        return NextResponse.json(
          { success: false, error: 'Listing is not currently rented' },
          { status: 409 }
        );
      }

      if (userId !== product.userId && userId !== rental.renterId) {
        return NextResponse.json(
          { success: false, error: 'Only the owner or the renter can return a listing' },
          { status: 403 }
        );
      }

      product.rental = null;
    }

    product.updatedAt = new Date().toISOString();
    dbService.saveListing(product);

    const users = db.users || [];
    const summary = toSummary(product);
    const owner = users.find((u: any) => u.id === summary.userId || u.email === summary.userId);
    const data = {
  ...summary,
  ownerName: owner?.fullName || "Verified lender",
  ownerAvatar: owner?.avatar || "",
  ownerGender: owner?.gender || "",
  ownerLanguage: Array.isArray(owner?.language)
    ? owner.language
    : owner?.language
      ? [owner.language]
      : [],
};

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error updating listing rental:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'id and userId are required' },
        { status: 400 }
      );
    }

    const db = dbService.readDb();
    const product = db.listings.find((item: any) => item.id === id && item.userId === userId);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    product.deletedAt = new Date().toISOString();
    dbService.saveListing(product);

    const users = db.users || [];
    const summary = toSummary(product);
    const owner = users.find((u: any) => u.id === summary.userId || u.email === summary.userId);
    const data = {
  ...summary,
  ownerName: owner?.fullName || "Verified lender",
  ownerAvatar: owner?.avatar || "",
  ownerGender: owner?.gender || "",
  ownerLanguage: Array.isArray(owner?.language)
    ? owner.language
    : owner?.language
      ? [owner.language]
      : [],
};

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}