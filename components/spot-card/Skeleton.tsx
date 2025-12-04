"use client";
import { motion } from "framer-motion";

export default function SpotCardSkeleton() {
  return (
    <div className="spot-card relative rounded-md overflow-hidden bg-gray-200">
      <div className="w-full h-56 relative overflow-hidden rounded-md">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transform: "translateX(0%)" }}
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="h-5 w-3/4 rounded-md overflow-hidden relative bg-gray-200">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <div className="h-4 w-2/3 rounded-md overflow-hidden relative bg-gray-200">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <div className="mt-6 h-4 w-20 rounded-md overflow-hidden relative bg-gray-200">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
