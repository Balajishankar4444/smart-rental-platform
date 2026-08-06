// app/api/auth/products/route.ts
import { NextResponse } from 'next/server';
import { deriveListingStatus } from '@/utils/listings';
import { getUsers } from '@/services/DbService';
import {
  readProducts,
  writeProducts,
  toSummary,
  withStatus,
  StoredProduct,
} from '@/lib/productStore';

export async function GET(request: Request) {
  try {
    const products = readProducts();
    const users = getUsers();

    const attachOwner = (item: any) => {
      const owner = users.find((u) => u.id === item.userId);
      return {
        ...item,
        ownerName: owner?.fullName || "Verified lender",
        ownerAvatar: owner?.avatar || "",
      };
    };

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const renterId = searchParams.get('renterId');
    const excludeUserId = searchParams.get('excludeUserId');
    const status = searchParams.get('status');

    if (id) {
      const product = products.find((item) => item.id === id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
      }

      const detailedProduct = withStatus(product);
      const owner = users.find((u) => u.id === detailedProduct.userId);
      
      const payload = {
        ...detailedProduct,
        ownerName: owner?.fullName || "Verified lender",
        ownerAvatar: owner?.avatar || "",
      };

      return NextResponse.json({ success: true, data: payload }, { status: 200 });
    }

    const data = products
      .filter((product) => Boolean(product.userId))
      .filter((product) => (userId ? product.userId === userId : true))
      .filter((product) => (excludeUserId ? product.userId !== excludeUserId : true))
      .filter((product) => (renterId ? product.rental?.renterId === renterId : true))
      .map(toSummary)
      .map(attachOwner)
      .filter((product) => {
        if (status === 'all') return true;
        if (status) return product.status === status;
        return product.status !== 'deleted';
      });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error reading products file:', error);
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

    const products = readProducts();
    const users = getUsers();

    const productWithMeta: StoredProduct = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      rental: null,
      deletedAt: null,
      createdAt: newProduct.createdAt || new Date().toISOString(),
    };

    products.push(productWithMeta);
    writeProducts(products);

    const summary = toSummary(productWithMeta);
    const owner = users.find((u) => u.id === summary.userId);
    const data = {
      ...summary,
      ownerName: owner?.fullName || "Verified lender",
      ownerAvatar: owner?.avatar || "",
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Product successfully added to JSON file',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error writing product to JSON file:', error);
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

    const products = readProducts();
    const users = getUsers();
    const product = products.find((item) => item.id === id);

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
    writeProducts(products);

    const summary = toSummary(product);
    const owner = users.find((u) => u.id === summary.userId);
    const data = {
      ...summary,
      ownerName: owner?.fullName || "Verified lender",
      ownerAvatar: owner?.avatar || "",
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

    const products = readProducts();
    const users = getUsers();
    const product = products.find((item) => item.id === id && item.userId === userId);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    product.deletedAt = new Date().toISOString();
    writeProducts(products);

    const summary = toSummary(product);
    const owner = users.find((u) => u.id === summary.userId);
    const data = {
      ...summary,
      ownerName: owner?.fullName || "Verified lender",
      ownerAvatar: owner?.avatar || "",
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