"use client";

import { useEffect, useState } from "react";
import { useLocation } from "./LocationProvider";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { LocateIcon } from "lucide-react";
import { motion } from "framer-motion";

export function LocationModal() {
  const [showModal, setShowModal] = useState(false);
  const { location, requestLocation, loading } = useLocation();

  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem("locationRequested");
    if (!hasRequestedLocation && !location) {
      setTimeout(() => setShowModal(true), 800);
    }
  }, [location]);

  const handleAccept = () => {
    requestLocation();
    setShowModal(false);
  };

  const handleDecline = () => {
    localStorage.setItem("locationRequested", "true");
    setShowModal(false);
  };

  useEffect(() => {
    (window as any).openLocationModal = () => setShowModal(true);
    return () => {
      delete (window as any).openLocationModal;
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-to-br from-orange-50 to-orange-200 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-orange-300/50"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-4 text-orange-600"
          >
            <LocateIcon size={40} />
          </motion.div>

          <h2 className="text-2xl font-semibold text-orange-950 mb-3">
            Ti aiutiamo a trovare i migliori Spot vicino a te
          </h2>
          <p className="text-orange-900 mb-6 text-sm">
            Per offrirti suggerimenti precisi e nelle vicinanze, abbiamo bisogno
            della tua posizione. Non preoccuparti, non la condivideremo con
            nessuno!
          </p>

          <div className="flex gap-3 items-center justify-center w-full">
            <Button
              onClick={handleDecline}
              disabled={loading}
              variant="ghost"
              className="text-orange-700 hover:bg-orange-200"
            >
              Più tardi
            </Button>
            <Button
              onClick={handleAccept}
              disabled={loading}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6"
            >
              {loading ? <Spinner /> : "Consenti subito"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
