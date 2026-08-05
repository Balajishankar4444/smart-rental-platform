// services/notificationService.ts
import { NotificationItem } from "../types/notification";
import { NOTIFICATIONS } from "../data/notifications";

export const notificationService = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    await new Promise((res) => setTimeout(res, 200));
    return NOTIFICATIONS.filter((n) => n.userId === userId);
  },

  async markNotificationRead(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 150));
    const n = NOTIFICATIONS.find((item) => item.id === id);
    if (n) n.read = true;
  },
};