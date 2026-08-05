// services/paymentService.ts
import { Payment } from "../types/payment";
import { PAYMENTS } from "../data/payments";

export const paymentService = {
  async getPaymentsForUser(userId: string): Promise<Payment[]> {
    await new Promise((res) => setTimeout(res, 200));
    return PAYMENTS.filter((p) => p.userId === userId);
  },

  async processPayment(paymentData: Partial<Payment>): Promise<Payment> {
    await new Promise((res) => setTimeout(res, 400));
    const newPayment: Payment = {
      id: `pay-${PAYMENTS.length + 1}`,
      bookingId: paymentData.bookingId || "book-1",
      userId: paymentData.userId || "user-1",
      amount: paymentData.amount || 1000,
      tax: 180,
      platformFee: 50,
      refund: 0,
      method: paymentData.method || "credit_card",
      status: "success",
      createdAt: new Date().toISOString(),
    };
    PAYMENTS.unshift(newPayment);
    return newPayment;
  },
};