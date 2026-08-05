// data/products.ts
import { Product, ProductCondition, ProductStatus } from "../types/product";
import { CATEGORIES } from "./categories";
import { CITIES } from "./cities";

const BRANDS = ["Sony", "Canon", "Apple", "Dell", "Trek", "Hyundai", "Bosch", "IKEA", "Sony", "DJI", "Yamaha", "BenQ", "JBL", "GoPro", "Fitbit"];
const CONDITIONS: ProductCondition[] = ["Brand New", "Like New", "Good", "Fair"];

const GENERATED_PRODUCTS: Product[] = Array.from({ length: 500 }, (_, i) => {
  const categoryObj = CATEGORIES[i % CATEGORIES.length];
  const cityObj = CITIES[i % CITIES.length];
  const brand = BRANDS[i % BRANDS.length];
  const pricePerDay = 300 + ((i * 75) % 3000);
  const ownerId = `user-${(i % 50) + 1}`;

  return {
    id: `prod-${i + 1}`,
    ownerId,
    title: `${brand} Pro ${categoryObj.name} Model ${i + 1}`,
    slug: `${brand.toLowerCase()}-pro-${categoryObj.slug}-${i + 1}`,
    description: `High performance ${categoryObj.name.toLowerCase()} in pristine condition. Thoroughly tested and sanitized before every rental. Perfect for professional projects, events, or personal use.`,
    category: categoryObj.name,
    subcategory: categoryObj.subcategories[0],
    brand,
    model: `Series-${2024 + (i % 3)}`,
    year: 2023 + (i % 3),
    condition: CONDITIONS[i % CONDITIONS.length],
    pricePerHour: Math.round(pricePerDay / 8),
    pricePerDay,
    pricePerWeek: pricePerDay * 6,
    pricePerMonth: pricePerDay * 22,
    securityDeposit: pricePerDay * 3,
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    availabilityCalendar: Array.from({ length: 30 }, (_, dIdx) => ({
      date: `2026-08-${String(dIdx + 1).padStart(2, '0')}`,
      available: dIdx % 7 !== 0,
    })),
    quantity: 1 + (i % 3),
    status: "active" as ProductStatus,
    city: cityObj.name,
    state: cityObj.state,
    country: cityObj.country,
    pickupLocation: `${cityObj.name} Central Hub, Near Metro Station`,
    deliveryAvailable: i % 2 === 0,
    deliveryFee: i % 2 === 0 ? 250 : 0,
    latitude: cityObj.latitude + (Math.random() - 0.5) * 0.04,
    longitude: cityObj.longitude + (Math.random() - 0.5) * 0.04,
    images: [
      categoryObj.image,
      `https://images.unsplash.com/photo-${1500000000000 + ((i + 50) * 1111)}?auto=format&fit=crop&w=800&q=80`,
      `https://images.unsplash.com/photo-${1500000000000 + ((i + 100) * 2222)}?auto=format&fit=crop&w=800&q=80`,
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    specifications: {
      "Weight": `${1.2 + (i % 5)} kg`,
      "Dimensions": "30 x 20 x 10 cm",
      "Power Source": "Rechargeable Battery / AC",
      "Warranty": "Manufacturer Active",
    },
    includedItems: ["Main Unit", "Carrying Case", "Charging Cable", "User Manual"],
    rules: ["No smoking near equipment", "Handle with care", "Return in original condition"],
    rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
    reviewCount: 2 + (i % 25),
    bookingCount: 5 + (i % 40),
    viewCount: 45 + (i * 13) % 500,
    favoriteCount: 3 + (i % 30),
    createdAt: "2024-02-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
  };
});

const DUPLICATE_PRODUCTS: Product[] = Array.from({ length: 5 }, () => ({
  ...GENERATED_PRODUCTS[0],
}));

export const PRODUCTS: Product[] = [...GENERATED_PRODUCTS, ...DUPLICATE_PRODUCTS];