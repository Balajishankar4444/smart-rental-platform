// services/reviewService.ts
import { Review } from "../types/review";
import { REVIEWS } from "../data/reviews";

export const reviewService = {
  async getReviewsForProduct(productId: string): Promise<Review[]> {
    await new Promise((res) => setTimeout(res, 200));
    return REVIEWS.filter((r) => r.productId === productId);
  },

  async leaveReview(reviewData: Partial<Review>): Promise<Review> {
    await new Promise((res) => setTimeout(res, 300));
    const newReview: Review = {
      id: `rev-${REVIEWS.length + 1}`,
      reviewerId: reviewData.reviewerId || "user-1",
      receiverId: reviewData.receiverId || "user-2",
      bookingId: reviewData.bookingId || "book-1",
      productId: reviewData.productId || "prod-1",
      rating: reviewData.rating || 5,
      review: reviewData.review || "Great experience!",
      images: reviewData.images || [],
      createdAt: new Date().toISOString(),
    };
    REVIEWS.unshift(newReview);
    return newReview;
  },
};