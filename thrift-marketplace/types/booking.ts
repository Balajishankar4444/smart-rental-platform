// types/booking.ts
export type BookingStatus = "pending" | "approved" | "rejected" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type ReturnStatus = "pending" | "returned" | "damaged" | "disputed";

export interface Booking {
  id: string;
  productId: string;
  ownerId: string;
  renterId: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  rentalAmount: number;
  securityDeposit: number;
  platformFee: number;
  taxes: number;
  insurance: number;
  discount: number;
  grandTotal: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  returnStatus: ReturnStatus;
  damageReport?: string;
  cancellationReason?: string;
  createdAt: string;
}