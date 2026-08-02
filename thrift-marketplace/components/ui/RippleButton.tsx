"use client";

import React, { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  isLoading = false,
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRipples((prev) => [...prev, { x, y, size, id: Date.now() }]);
    if (onClick) onClick(e);
  };

  useLayoutEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`relative overflow-hidden inline-flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none bg-white/30 animate-ping"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {children}
    </motion.button>
  );
};