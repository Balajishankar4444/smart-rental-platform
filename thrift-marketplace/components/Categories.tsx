// components/Categories.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BedDouble,
  DoorClosed,
  Building2,
  GraduationCap,
  Briefcase,
  Backpack,
  Users,
  Dog,
} from "lucide-react";

const CATEGORIES = [
  { name: "Shared Rooms", icon: BedDouble, count: "" },
  { name: "Private Rooms", icon: DoorClosed, count: "" },
  { name: "Apartments", icon: Building2, count: "" },
  { name: "Student Housing", icon: GraduationCap, count: "" },
  { name: "Business Stays", icon: Briefcase, count: "" },
  { name: "Backpacker Rooms", icon: Backpack, count: "" },
  { name: "Family Stays", icon: Users, count: "" },
  { name: "Pet Friendly", icon: Dog, count: "" },
];

export const Categories = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    // Navigates to browse page, optionally passing the category as a query param if needed
    router.push(`/browse?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="categories">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Explore Categories</h2>
          <p className="text-gray-500 text-sm mt-2">Find verified rooms and spaces available for short-term stays near you.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="group flex flex-col items-center justify-center p-6 rounded-[24px] bg-white border border-gray-200/80 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{cat.name}</h3>
              <span className="text-xs text-gray-400 font-medium mt-1">{cat.count}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};