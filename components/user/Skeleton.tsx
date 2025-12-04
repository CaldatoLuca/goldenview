"use client";
import { motion } from "framer-motion";

interface UserIconSkeletonProps {
  size?: number;
}

export default function UserIconSkeleton({ size = 40 }: UserIconSkeletonProps) {
  return (
    <div
      className="relative rounded-full overflow-hidden bg-gray-300"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transform: "translateX(0%)" }}
      />
    </div>
  );
}
