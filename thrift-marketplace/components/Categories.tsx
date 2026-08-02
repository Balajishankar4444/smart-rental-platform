"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Gamepad2,
  Bike,
  Wrench,
  Music,
  Tent,
  Sofa,
  Smartphone,
  BookOpen,
  Dog,
  PartyPopper,
  Plane,
} from "lucide-react";

const CATEGORIES = [
  { name: "Photography", icon: Camera, count: "12,400+ items" },
  { name: "Gaming", icon: Gamepad2, count: "8,900+ items" },
  { name: "Vehicles", icon: Bike, count: "15,100+ items" },
  { name: "Tools", icon: Wrench, count: "6,200+ items" },
  { name: "Music", icon: Music, count: "4,800+ items" },
  { name: "Camping", icon: Tent, count: "5,300+ items" },
  { name: "Furniture", icon: Sofa, count: "9,700+ items" },
  { name: "Electronics", icon: Smartphone, count: "18,500+ items" },
  { name: "Books", icon: BookOpen, count: "3,100+ items" },
  { name: "Pets Gear", icon: Dog, count: "1,900+ items" },
  { name: "Party", icon: PartyPopper, count: "7,400+ items" },
  { name: "Drones", icon: Plane, count: "4,200+ items" },
];

export const Categories = () => {
  return (
    <section className="py-20 mx-auto max-w-[1440px] px-6 lg:px-12" id="categories">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">Explore Categories</h2>
          <p className="text-gray-500 text-sm mt-2">Find high-quality gear available near you for immediate rent.</p>
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