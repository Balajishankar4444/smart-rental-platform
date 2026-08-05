// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { deriveListingStatus, ListingRental } from '@/utils/listings';

// Define the file path where product listings will be stored
const dataFilePath = path.join(process.cwd(), 'data', 'product.json');

interface StoredProduct {
  id: string;
  userId: string;
  deletedAt?: string | null;
  rental?: ListingRental | null;
  images?: string[];
  primaryImageIndex?: number;
  [key: string]: unknown;
}

// Ensure the data directory and file exist
function ensureDataFileExists() {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readProducts(): StoredProduct[] {
  ensureDataFileExists();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  const parsed = JSON.parse(fileContents || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

function writeProducts(products: StoredProduct[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
}

// Status is always computed from the listing's own state, never taken from the client
function withStatus(product: StoredProduct) {
  return { ...product, status: deriveListingStatus(product) };
}

// Listing responses carry a single cover image instead of the full (base64) gallery
function toSummary(product: StoredProduct) {
  const { images, primaryImageIndex, ...rest } = withStatus(product);
  return {
    ...rest,
    primaryImage: images?.[primaryImageIndex || 0] || '',
  };
}

// GET: Retrieve listings, optionally scoped to an owner and/or a status.
// `id` returns a single listing with its full image gallery.
// Without a status filter, removed listings are hidden; `status=all` returns everything.
export async function GET(request: Request) {
  try {
    const products = readProducts();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (id) {
      const product = products.find((item) => item.id === id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: withStatus(product) }, { status: 200 });
    }

    const data = products
      .filter((product) => (userId ? product.userId === userId : true))
      .map(toSummary)
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

// POST: Append a new product listing to the JSON file
export async function POST(request: Request) {
  try {
    // Parse incoming request body from the frontend
    const newProduct = await request.json();

    if (!newProduct.userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required to create a listing' },
        { status: 400 }
      );
    }

    const products = readProducts();

    // A freshly created listing is available: no rental, not removed
    const productWithMeta: StoredProduct = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      rental: null,
      deletedAt: null,
      createdAt: newProduct.createdAt || new Date().toISOString(),
    };

    products.push(productWithMeta);
    writeProducts(products);

    return NextResponse.json(
      {
        success: true,
        message: 'Product successfully added to JSON file',
        data: toSummary(productWithMeta),
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

// PATCH: Record a booking or a return. The resulting status (in_rent / in_lease / active)
// follows from the rental itself, so no caller can set a status directly.
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

    return NextResponse.json({ success: true, data: toSummary(product) }, { status: 200 });
  } catch (error) {
    console.error('Error updating listing rental:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE: Soft-delete a listing so the backend keeps its history
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
    const product = products.find((item) => item.id === id && item.userId === userId);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    product.deletedAt = new Date().toISOString();
    writeProducts(products);

    return NextResponse.json({ success: true, data: toSummary(product) }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
