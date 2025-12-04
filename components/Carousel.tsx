"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Carousel({ images = [] }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Nessuna immagine disponibile</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative overflow-hidden w-full h-64 rounded-xl">
        <img
          src={images[0]}
          alt="Immagine"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full bg-gray-900">
      <motion.div
        className="flex h-full"
        animate={{ x: `-${index * 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all rounded-full ${
              i === index
                ? "bg-white w-8 h-2"
                : "bg-white/50 hover:bg-white/75 w-2 h-2"
            }`}
            aria-label={`Vai all'immagine ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
