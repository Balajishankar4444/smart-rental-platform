// components/ProductGallery.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  thumbnail: string;
  galleryImages: string[];
  videos?: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  thumbnail,
  galleryImages,
  videos = [],
  title,
}) => {
  const allMedia = [thumbnail, ...galleryImages];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Preview Container */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-md sm:h-[480px]">
        <Image
          src={allMedia[selectedIndex] || thumbnail}
          alt={title}
          fill
          className="object-cover transition duration-500"
        />
        <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md font-heading">
          {selectedIndex + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 gap-3">
        {allMedia.map((mediaUrl, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative h-20 w-full overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
              selectedIndex === idx
                ? "border-[#2563EB] shadow-md shadow-blue-500/20"
                : "border-slate-200 opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={mediaUrl} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};