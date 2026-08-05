// data/notifications.ts
import { NotificationItem } from "../types/notification";

export const NOTIFICATIONS: NotificationItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: `notif-${i + 1}`,
  userId: `user-${(i % 50) + 1}`,
  type: "booking_update",
  title: "Booking Request Update",
  message: `Your booking request #book-${(i % 150) + 1} has been successfully updated.`,
  read: i % 3 === 0,
  link: `/bookings/book-${(i % 150) + 1}`,
  createdAt: "2026-08-03T12:00:00Z",
}));