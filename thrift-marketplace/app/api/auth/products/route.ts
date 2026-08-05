// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the file path where product listings will be stored
const dataFilePath = path.join(process.cwd(), 'data', 'product.json');

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

// GET: Retrieve all product listings
export async function GET() {
  try {
    ensureDataFileExists();
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents || '[]');
    return NextResponse.json({ success: true, data: products }, { status: 200 });
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
  console.log("POST API HIT");
  try {
    ensureDataFileExists();
    
    // Parse incoming request body from the frontend
    const newProduct = await request.json();

    // Read existing products from the JSON file
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents || '[]');

    // Assign a unique ID and timestamp if not present
    const productWithMeta = {
      id: `prod_${Date.now()}`,
      ...newProduct,
      createdAt: newProduct.createdAt || new Date().toISOString()
    };

    // Append the new product to the array
    products.push(productWithMeta);

    // Write the updated array back to the JSON file with pretty formatting
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Product successfully added to JSON file', 
        data: productWithMeta 
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