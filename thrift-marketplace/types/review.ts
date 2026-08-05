// types/review.ts
export interface Review {
  id: string;
  reviewerId: string;
  receiverId: string;
  bookingId: string;
  productId: string;
  rating: number;
  review: string;
  images: string[];
  createdAt: string;
}