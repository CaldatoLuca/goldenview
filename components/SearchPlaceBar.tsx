"use client";
import { useState, useEffect, useRef } from "react";
import { IoSearchSharp as Search } from "react-icons/io5";
import { fetchMapboxPlaces } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const places = [
  "Trova il luogo perfetto...",
  "Milano",
  "Roma",
  "Firenze",
  "Venezia",
  "Napoli",
  "Torino",
  "Genova",
  "Bologna",
  "Palermo",
  "Verona",
  "Trieste",
  "Pisa",
  "Siena",
  "Matera",
  "Ravenna",
  "Orvieto",
  "Assisi",
  "Cinque Terre",
  "Capri",
  "Taormina",
];

export default function SearchPlaceBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("");
  const [cityIndex, setCityIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = places[cityIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => setText((prev) => prev.slice(0, -1)), 50);
    } else {
      timeout = setTimeout(
        () => setText((prev) => current.slice(0, prev.length + 1)),
        100
      );
    }

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setCityIndex((prev) => (prev + 1) % places.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, cityIndex]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const getPlaces = async () => {
      const places = await fetchMapboxPlaces(debouncedQuery);
      setResults(places);
      setIsOpen(true);
    };
    getPlaces();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToPlace = (lat: number, lng: number) => {
    router.push(`/spot?lat=${lat}&lng=${lng}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full py-4 pl-6 pr-12 rounded-full shadow-lg bg-orange-100 text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          placeholder={text}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-100 bg-orange-400 p-2 rounded-full shadow cursor-pointer hover:bg-orange-500 transition">
          <Search size={20} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-orange-100 text-orange-800 border rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto overflow-x-hidden z-99"
          >
            {results.length === 0 ? (
              <li className="p-3 text-neutral-600 cursor-default">
                Nessun posto trovato.
              </li>
            ) : (
              results.map((place) => (
                <motion.li
                  key={place.id}
                  whileHover={{ scale: 1.02, backgroundColor: "#fef3c7" }}
                  className="p-3 cursor-pointer transition-colors"
                  onClick={() =>
                    goToPlace(
                      place.geometry.coordinates[1],
                      place.geometry.coordinates[0]
                    )
                  }
                >
                  {place.place_name}
                </motion.li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
