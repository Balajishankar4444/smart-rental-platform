// data/reviews.ts
import { Review } from "../types/review";

export const REVIEWS: Review[] = Array.from({ length: 500 }, (_, i) => ({
  id: `rev-${i + 1}`,
  reviewerId: `user-${(i % 50) + 1}`,
  receiverId: `user-${((i + 7) % 50) + 1}`,
  bookingId: `book-${(i % 150) + 1}`,
  productId: `prod-${(i % 500) + 1}`,
  rating: 4 + (i % 2),
  review: `Absolute seamless experience! Equipment was in top-notch condition and pickup was very smooth. Highly recommended lender.`,
  images: i % 4 === 0 ? ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"] : [],
  createdAt: "2026-07-20T14:00:00Z",
}));