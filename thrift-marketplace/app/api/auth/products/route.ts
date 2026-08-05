// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isListingStatus, ListingStatus } from '@/utils/listings';

// Define the file path where product listings will be stored
const dataFilePath = path.join(process.cwd(), 'data', 'product.json');

interface StoredProduct {
  id: string;
  userId: string;
  status: ListingStatus;
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

// Listing responses carry a single cover image instead of the full (base64) gallery
function toSummary(product: StoredProduct) {
  const { images, primaryImageIndex, ...rest } = product;
  return {
    ...rest,
    primaryImage: images?.[primaryImageIndex || 0] || '',
  };
}

// GET: Retrieve listings, optionally scoped to an owner and/or a status.
// `id` returns a single listing with its full image gallery.
// Without a status filter, soft-deleted listings are hidden; `status=all` returns everything.
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
      return NextResponse.json({ success: true, data: product }, { status: 200 });
    }

    const data = products
      .filter((product) => (userId ? product.userId === userId : true))
      .filter((product) => {
        if (status === 'all') return true;
        if (status) return product.status === status;
        return product.status !== 'deleted';
      })
      .map(toSummary);

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

    // Assign a unique ID, status and timestamp if not present
    const productWithMeta: StoredProduct = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      status: isListingStatus(newProduct.status) ? newProduct.status : 'active',
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

// PATCH: Update the status of a listing (active / deleted / in_rent / in_lease)
export async function PATCH(request: Request) {
  try {
    const { id, userId, status } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'id and userId are required' },
        { status: 400 }
      );
    }

    if (!isListingStatus(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid listing status' },
        { status: 400 }
      );
    }

    const products = readProducts();
    const product = products.find((item) => item.id === id && item.userId === userId);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    product.status = status;
    product.updatedAt = new Date().toISOString();
    writeProducts(products);

    return NextResponse.json({ success: true, data: toSummary(product) }, { status: 200 });
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing status' },
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

    product.status = 'deleted';
    product.updatedAt = new Date().toISOString();
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
