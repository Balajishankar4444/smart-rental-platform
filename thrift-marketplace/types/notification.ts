// types/notification.ts
export type NotificationType = 
  | "booking_update" 
  | "payment_update" 
  | "listing_approved" 
  | "new_review" 
  | "new_message" 
  | "wishlist_alert" 
  | "price_drop" 
  | "promotion";

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}