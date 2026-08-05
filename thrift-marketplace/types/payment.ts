// types/payment.ts
export type PaymentMethod = "credit_card" | "upi" | "net_banking" | "wallet" | "paypal";
export type PaymentTxStatus = "success" | "pending" | "failed" | "refunded";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  tax: number;
  platformFee: number;
  refund: number;
  method: PaymentMethod;
  status: PaymentTxStatus;
  createdAt: string;
}