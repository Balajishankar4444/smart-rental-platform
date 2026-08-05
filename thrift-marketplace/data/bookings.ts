// data/bookings.ts
import { Booking, BookingStatus, PaymentStatus, ReturnStatus } from "../types/booking";

export const BOOKINGS: Booking[] = Array.from({ length: 150 }, (_, i) => {
  const rentalAmount = 2500 + (i * 150) % 15000;
  const securityDeposit = rentalAmount * 0.5;
  const platformFee = rentalAmount * 0.05;
  const taxes = rentalAmount * 0.18;
  const insurance = 150;
  const grandTotal = rentalAmount + securityDeposit + platformFee + taxes + insurance;

  const statuses: BookingStatus[] = ["pending", "approved", "active", "completed", "cancelled"];
  const paymentStatuses: PaymentStatus[] = ["paid", "pending", "refunded"];
  const returnStatuses: ReturnStatus[] = ["returned", "pending", "damaged"];

  return {
    id: `book-${i + 1}`,
    productId: `prod-${(i % 500) + 1}`,
    ownerId: `user-${(i % 50) + 1}`,
    renterId: `user-${((i + 5) % 50) + 1}`,
    bookingDate: "2026-08-01T10:00:00Z",
    startDate: "2026-08-10T10:00:00Z",
    endDate: "2026-08-15T18:00:00Z",
    pickupTime: "10:00 AM",
    returnTime: "06:00 PM",
    rentalAmount,
    securityDeposit,
    platformFee,
    taxes,
    insurance,
    discount: 0,
    grandTotal,
    bookingStatus: statuses[i % statuses.length],
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    returnStatus: returnStatuses[i % returnStatuses.length],
    damageReport: i % 15 === 0 ? "Minor scratch on outer casing." : undefined,
    cancellationReason: i % 10 === 0 ? "Change of travel plans." : undefined,
    createdAt: "2026-08-01T10:00:00Z",
  };
});