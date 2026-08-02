import { Product, Category } from "./types";

export const CATEGORIES: Category[] = [
  { name: "Photography", slug: "cameras", iconName: "Camera", count: "12,400+ items" },
  { name: "Gaming", slug: "gaming", iconName: "Gamepad2", count: "8,900+ items" },
  { name: "Vehicles", slug: "bikes", iconName: "Bike", count: "15,100+ items" },
  { name: "Electronics", slug: "electronics", iconName: "Smartphone", count: "18,500+ items" },
  { name: "Tools", slug: "tools", iconName: "Wrench", count: "6,200+ items" },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Sony Alpha a7 IV + 24-70mm f/2.8 GM Lens",
    category: "cameras",
    pricePerDay: 1850,
    marketValue: "₹2,40,000",
    rating: 4.96,
    reviews: 42,
    location: "Indiranagar, Bengaluru",
    distance: "2.4 km away",
    owner: {
      name: "Rohan V.",
      badge: "Super Lender",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
  {
    id: "2",
    title: "Sony PlayStation 5 Disc Edition + 2 Controllers",
    category: "gaming",
    pricePerDay: 690,
    marketValue: "₹54,990",
    rating: 4.98,
    reviews: 89,
    location: "Koramangala, Bengaluru",
    distance: "1.1 km away",
    owner: {
      name: "Priya S.",
      badge: "Top Rated",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    },
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800",
    verified: true,
  },
];