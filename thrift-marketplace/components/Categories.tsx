// components/Categories.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BedDouble,
  DoorClosed,
  Building2,
  Users,
  Dog,
} from "lucide-react";

const CATEGORIES = [
  { name: "Shared Rooms", icon: BedDouble, count: "" },
  { name: "Private Rooms", icon: DoorClosed, count: "" },
  { name: "Apartments", icon: Building2, count: "" },
  { name: "Family Stays", icon: Users, count: "" },
  { name: "Pet Friendly", icon: Dog, count: "" },
];

export const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/browse?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-12 w-full px-6 lg:px-12" id="categories">
      {/* Centered Heading Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">
          Explore Categories
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Find the ideal room, apartment, or stay available for rent near you.
        </p>
      </div>

      {/* Full-Width Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const isSelected = currentCategory === cat.name;

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group flex flex-col items-center justify-center p-6 rounded-[24px] bg-white border transition-all cursor-pointer text-center shadow-xs hover:shadow-xl ${
                isSelected
                  ? "border-[#2563EB] ring-2 ring-blue-500/20 bg-blue-50/10"
                  : "border-gray-200/80 hover:border-blue-200"
              }`}
            >
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                  isSelected
                    ? "bg-[#2563EB] text-white"
                    : "bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white"
                }`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3
                className={`text-base font-bold transition-colors ${
                  isSelected ? "text-[#2563EB]" : "text-gray-900 group-hover:text-[#2563EB]"
                }`}
              >
                {cat.name}
              </h3>
              <span className="text-xs text-gray-400 font-medium mt-1">{cat.count}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
