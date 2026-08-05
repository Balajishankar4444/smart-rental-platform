// services/dashboardService.ts
import { BOOKINGS } from "../data/bookings";
import { PRODUCTS } from "../data/products";
import { PAYMENTS } from "../data/payments";

export const dashboardService = {
  async getDashboardStats(userId: string) {
    await new Promise((res) => setTimeout(res, 300));
    const userProducts = PRODUCTS.filter((p) => p.ownerId === userId);
    const userBookings = BOOKINGS.filter((b) => b.renterId === userId || b.ownerId === userId);
    const userPayments = PAYMENTS.filter((p) => p.userId === userId);

    const totalEarnings = userPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const activeRentalsCount = userBookings.filter((b) => b.bookingStatus === "active").length;

    return {
      totalListings: userProducts.length,
      totalBookings: userBookings.length,
      activeRentals: activeRentalsCount,
      totalEarnings,
    };
  },
};