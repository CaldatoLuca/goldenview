"use client";
import { useState, useEffect } from "react";
import { IoSearchSharp as Search } from "react-icons/io5";
import { fetchMapboxPlaces } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [text, setText] = useState("");
  const [cityIndex, setCityIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = places[cityIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => current.slice(0, prev.length + 1));
      }, 100);
    }

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setCityIndex((prev) => (prev + 1) % places.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, cityIndex]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const getPlaces = async () => {
      const places = await fetchMapboxPlaces(debouncedQuery);
      setResults(places);
    };

    getPlaces();
  }, [debouncedQuery]);

  const goToPlace = (lat: number, lng: number, place: any) => {
    router.push(`/spots?lat=${lat}&lng=${lng}`);
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full py-4 px-6 shadow-2xl rounded-full bg-neutral-50 text-neutral-800 cursor-pointer focus:outline-none"
        placeholder={`${text}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 bg-orange-500 p-2 rounded-full cursor-pointer">
        <Search />
      </div>
      {results.length > 0 && (
        <ul className="absolute z-10 top-full left-0 right-0 bg-white text-neutral-800 border rounded shadow mt-1 max-h-64 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                goToPlace(
                  place.geometry.coordinates[1],
                  place.geometry.coordinates[0],
                  place
                )
              }
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
