"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Mail, MessageSquare, Smartphone, Star, Tag, CheckCircle2, Loader2 } from "lucide-react";

export interface NotificationPreferences {
  bookingUpdates: boolean;
  rentalRequests: boolean;
  directMessages: boolean;
  reviewsRatings: boolean;
  promotionsTips: boolean;
  securityAlerts: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  emailDigests: boolean;
}

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    bookingUpdates: true,
    rentalRequests: true,
    directMessages: true,
    reviewsRatings: true,
    promotionsTips: false,
    securityAlerts: true,
    pushNotifications: true,
    smsNotifications: false,
    emailDigests: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSavedSuccess(false);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsLoading(false);
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const notificationItems = [
    { key: "bookingUpdates" as keyof NotificationPreferences, title: "Booking Updates", desc: "Status changes, pickups & returns", icon: Bell },
    { key: "rentalRequests" as keyof NotificationPreferences, title: "Rental Requests", desc: "New bookings from potential renters", icon: Smartphone },
    { key: "directMessages" as keyof NotificationPreferences, title: "Direct Messages", desc: "Instant chat notifications from users", icon: MessageSquare },
    { key: "reviewsRatings" as keyof NotificationPreferences, title: "Reviews & Ratings", desc: "When someone reviews your gear or rental", icon: Star },
    { key: "promotionsTips" as keyof NotificationPreferences, title: "Promotions & Tips", desc: "Rental discounts and platform updates", icon: Tag },
    { key: "securityAlerts" as keyof NotificationPreferences, title: "Security Alerts", desc: "Login attempts and password changes", icon: Shield },
    { key: "pushNotifications" as keyof NotificationPreferences, title: "Push Notifications", desc: "Browser and app push delivery", icon: Bell },
    { key: "smsNotifications" as keyof NotificationPreferences, title: "SMS Notifications", desc: "Text alerts for urgent rental updates", icon: Smartphone },
    { key: "emailDigests" as keyof NotificationPreferences, title: "Email Digests", desc: "Summary emails of activity and invoices", icon: Mail },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-[36px] p-8 lg:p-12 shadow-xl shadow-blue-900/5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[#2563EB] mb-2 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full w-fit">
              <Bell className="h-3.5 w-3.5" /> Notification Channels
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-heading">Notification Preferences</h2>
            <p className="text-xs text-gray-500 mt-1">Choose how and when you want to receive booking updates and alerts.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2563EB] text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {savedSuccess && <CheckCircle2 className="h-4 w-4 text-white" />}
            {isLoading ? "Saving..." : savedSuccess ? "Saved Successfully!" : "Save Preferences"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notificationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = preferences[item.key];

            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key)}
                className={`group p-5 rounded-[24px] border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isActive
                    ? "bg-white border-blue-200/80 shadow-md shadow-blue-500/5"
                    : "bg-gray-50/60 border-gray-200/60 hover:bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-blue-50 text-[#2563EB]" : "bg-gray-200/70 text-gray-500"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 font-heading group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                    isActive ? "bg-[#2563EB]" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="bg-white w-5 h-5 rounded-full shadow-md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};