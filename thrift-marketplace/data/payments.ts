// data/payments.ts
import { Payment } from "../types/payment";

export const PAYMENTS: Payment[] = Array.from({ length: 150 }, (_, i) => ({
  id: `pay-${i + 1}`,
  bookingId: `book-${i + 1}`,
  userId: `user-${(i % 50) + 1}`,
  amount: 3500 + (i * 100),
  tax: 350,
  platformFee: 150,
  refund: 0,
  method: "credit_card",
  status: "success",
  createdAt: "2026-08-01T10:05:00Z",
}));