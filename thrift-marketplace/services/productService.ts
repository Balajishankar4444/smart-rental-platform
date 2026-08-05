// services/productService.ts
import { Product } from "../types/product";
import { PRODUCTS } from "../data/products";

export const productService = {
  async getProducts(): Promise<Product[]> {
    await new Promise((res) => setTimeout(res, 300));
    return PRODUCTS;
  },

  async getProduct(id: string): Promise<Product | null> {
    await new Promise((res) => setTimeout(res, 200));
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    await new Promise((res) => setTimeout(res, 300));
    const newProduct: Product = {
      id: `prod-${PRODUCTS.length + 1}`,
      ownerId: productData.ownerId || "user-1",
      title: productData.title || "Untitled Product",
      slug: (productData.title || "untitled-product").toLowerCase().replace(/ /g, "-"),
      description: productData.description || "",
      category: productData.category || "Cameras",
      subcategory: productData.subcategory || "DSLR",
      brand: productData.brand || "Generic",
      model: productData.model || "V1",
      year: productData.year || 2024,
      condition: productData.condition || "Like New",
      pricePerHour: productData.pricePerHour || 100,
      pricePerDay: productData.pricePerDay || 800,
      pricePerWeek: productData.pricePerWeek || 4800,
      pricePerMonth: productData.pricePerMonth || 16000,
      securityDeposit: productData.securityDeposit || 2000,
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      availabilityCalendar: [],
      quantity: 1,
      status: "active",
      city: productData.city || "Bengaluru",
      state: productData.state || "Karnataka",
      country: productData.country || "India",
      pickupLocation: productData.pickupLocation || "Central Hub",
      deliveryAvailable: true,
      deliveryFee: 200,
      latitude: 12.9716,
      longitude: 77.5946,
      images: productData.images || ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
      specifications: productData.specifications || {},
      includedItems: productData.includedItems || [],
      rules: productData.rules || [],
      rating: 5.0,
      reviewCount: 0,
      bookingCount: 0,
      viewCount: 1,
      favoriteCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await new Promise((res) => setTimeout(res, 300));
    const index = PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    PRODUCTS[index] = { ...PRODUCTS[index], ...updates, updatedAt: new Date().toISOString() };
    return PRODUCTS[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    const index = PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) return false;
    PRODUCTS.splice(index, 1);
    return true;
  },
};