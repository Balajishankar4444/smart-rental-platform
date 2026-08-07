// app/api/auth/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the structure for product listings based on RentIt marketplace architecture
interface ProductListing {
  id: string;
  userId: string;
  productName: string;
  category: string;
  subcategory?: string;
  brand: string;
  model?: string;
  condition: string;
  age?: string;
  dailyPrice: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  securityDeposit: number;
  lateReturnFee?: number;
  city: string;
  state?: string;
  address?: string;
  instantBooking: boolean;
  description: string;
  usageInstructions?: string;
  weight?: string;
  color?: string;
  dimensions?: string;
  warranty?: boolean;
  pickupTime?: string;
  deliveryAvailable?: boolean;
  accessoriesIncluded?: string;
  images: string[];
  status?: string;
  createdAt: string;
}

// Path to JSON file storage consistent with the RentIt marketplace architecture
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory and file exist
function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
  }
}

// Helper to read products from local JSON storage
function readProducts(): ProductListing[] {
  try {
    ensureDataStore();
    const fileData = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
}

// Helper to write products to local JSON storage
function writeProducts(products: ProductListing[]) {
  try {
    ensureDataStore();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing products file:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      productName,
      category,
      brand,
      condition,
      dailyPrice,
      securityDeposit,
      city,
      description,
      images,
    } = body;

    if (!userId || !productName || !category || !dailyPrice || !securityDeposit || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required product listing parameters' },
        { status: 400 }
      );
    }

    const currentProducts = readProducts();

    const newProduct: ProductListing = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      productName,
      category,
      subcategory: body.subcategory || '',
      brand: brand || '',
      model: body.model || '',
      condition: condition || 'Like New',
      age: body.age || '',
      dailyPrice: Number(dailyPrice),
      weeklyPrice: body.weeklyPrice ? Number(body.weeklyPrice) : undefined,
      monthlyPrice: body.monthlyPrice ? Number(body.monthlyPrice) : undefined,
      securityDeposit: Number(securityDeposit),
      lateReturnFee: body.lateReturnFee ? Number(body.lateReturnFee) : undefined,
      city,
      state: body.state || '',
      address: body.address || '',
      instantBooking: body.instantBooking ?? true,
      description,
      usageInstructions: body.usageInstructions || '',
      weight: body.weight || '',
      color: body.color || '',
      dimensions: body.dimensions || '',
      warranty: body.warranty ?? true,
      pickupTime: body.pickupTime || 'Flexible',
      deliveryAvailable: body.deliveryAvailable ?? true,
      accessoriesIncluded: body.accessoriesIncluded || '',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    currentProducts.unshift(newProduct);
    writeProducts(currentProducts);

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (err) {
    console.error('Error creating product listing:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const city = searchParams.get('city');

    let filtered = readProducts();

    if (userId) {
      filtered = filtered.filter((p) => p.userId === userId);
    }
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (city) {
      filtered = filtered.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (err) {
    console.error('Error fetching product listings:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}