// services/bookingService.ts
import { Booking } from "../types/booking";
import { BOOKINGS } from "../data/bookings";

export const bookingService = {
  async getBookingsForUser(userId: string): Promise<Booking[]> {
    await new Promise((res) => setTimeout(res, 300));
    return BOOKINGS.filter((b) => b.renterId === userId || b.ownerId === userId);
  },

  async bookProduct(bookingData: Partial<Booking>): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const newBooking: Booking = {
      id: `book-${BOOKINGS.length + 1}`,
      productId: bookingData.productId || "prod-1",
      ownerId: bookingData.ownerId || "user-1",
      renterId: bookingData.renterId || "user-2",
      bookingDate: new Date().toISOString(),
      startDate: bookingData.startDate || "2026-08-10",
      endDate: bookingData.endDate || "2026-08-15",
      pickupTime: "10:00 AM",
      returnTime: "06:00 PM",
      rentalAmount: bookingData.rentalAmount || 3000,
      securityDeposit: bookingData.securityDeposit || 1500,
      platformFee: 150,
      taxes: 540,
      insurance: 150,
      discount: 0,
      grandTotal: bookingData.grandTotal || 5340,
      bookingStatus: "pending",
      paymentStatus: "paid",
      returnStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    BOOKINGS.unshift(newBooking);
    return newBooking;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const b = BOOKINGS.find((item) => item.id === bookingId);
    if (!b) throw new Error("Booking not found");
    b.bookingStatus = "cancelled";
    b.cancellationReason = reason;
    return b;
  },

  async acceptBooking(bookingId: string): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const b = BOOKINGS.find((item) => item.id === bookingId);
    if (!b) throw new Error("Booking not found");
    b.bookingStatus = "approved";
    return b;
  },

  async rejectBooking(bookingId: string): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const b = BOOKINGS.find((item) => item.id === bookingId);
    if (!b) throw new Error("Booking not found");
    b.bookingStatus = "rejected";
    return b;
  },

  async completeBooking(bookingId: string): Promise<Booking> {
    await new Promise((res) => setTimeout(res, 300));
    const b = BOOKINGS.find((item) => item.id === bookingId);
    if (!b) throw new Error("Booking not found");
    b.bookingStatus = "completed";
    b.returnStatus = "returned";
    return b;
  },
};