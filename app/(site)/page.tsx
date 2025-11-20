"use client";

import { useLocation } from "@/components/LocationProvider";
import Hero from "@/components/Hero";

export default function Home() {
  const { location, error } = useLocation();

  return (
    <>
      <Hero />
    </>
  );
}
