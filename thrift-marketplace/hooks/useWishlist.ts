"use client";

import { useState, useEffect } from "react";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("rentit_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("rentit_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  return { wishlist, toggleWishlist };
};