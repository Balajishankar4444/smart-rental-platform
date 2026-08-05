import { NextResponse } from 'next/server';

// In-memory store fallback (or hook this up to your database / Prisma client)
let fencingProducts = [
  {
    id: "FENCE-001",
    title: "Modern Aluminum Slat Fence",
    description: "Durable, rust-resistant vertical privacy fencing.",
    price: 129,
    category: "Aluminum",
    location: "Stuttgart Central",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop",
  },
  {
    id: "FENCE-002",
    title: "Classic Cedar Wood Panel",
    description: "High-grade natural wood panels for secure boundaries.",
    price: 89,
    category: "Wood",
    location: "North Suburbs",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&h=200&fit=crop",
  },
];

// GET: Fetch all fencing products
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: fencingProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fencing products" },
      { status: 500 }
    );
  }
}

// POST: Add a new fencing product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = {
      id: `FENCE-${Date.now().toString().slice(-4)}`,
      title: body.title || "Untitled Fence",
      description: body.description || "",
      price: Number(body.price) || 0,
      category: body.category || "General",
      location: body.location || "Stuttgart",
      image: body.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop",
    };

    fencingProducts.unshift(newProduct);

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create fencing product" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a fencing product by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    fencingProducts = fencingProducts.filter((item) => item.id !== id);

    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete fencing product" },
      { status: 500 }
    );
  }
}