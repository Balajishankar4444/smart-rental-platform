"use client";

import { NotificationSettings } from "@/components/NotificationSettings";

export default function TestNotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6 font-heading">
          Component Test Page: Notification Settings
        </h1>
      </div>
      <NotificationSettings />
    </main>
  );
}