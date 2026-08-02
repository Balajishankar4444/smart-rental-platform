// components/ui/CustomCursor.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor fixed top-0 left-0 z-50 pointer-events-none rounded-full bg-[#2563EB] hidden lg:block"
      animate={{
        x: mousePosition.x - (isHovered ? 12 : 6),
        y: mousePosition.y - (isHovered ? 12 : 6),
        width: isHovered ? 24 : 12,
        height: isHovered ? 24 : 12,
        opacity: isHovered ? 0.8 : 0.5,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.05 }}
    />
  );
};