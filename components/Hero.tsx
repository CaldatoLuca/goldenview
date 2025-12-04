"use client";
import SearchPlaceBar from "@/components/SearchPlaceBar";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[calc(80vh)] flex justify-center items-center flex-col">
      <div className="absolute inset-0">
        <img
          src="/images/home/hero-bg.jpg"
          alt="Tramonto"
          className="w-full h-full object-cover filter opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-orange-100 text-center text-2xl md:text-5xl font-bold drop-shadow-lg mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Trova il tramonto più bello in giro per il mondo
        </motion.h2>

        <motion.div
          className="w-11/12 md:w-1/3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <SearchPlaceBar />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </section>
  );
}
