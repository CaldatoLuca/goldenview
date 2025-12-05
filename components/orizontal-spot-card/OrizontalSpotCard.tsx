"use client";

import Image from "next/image";
import { FaLocationDot as Location, FaClock as Clock } from "react-icons/fa6";
import { getSunsetInfo } from "@/lib/sun-calc";
import { useEffect, useState } from "react";
import Link from "next/link";

type SpotCardProps = {
  title: string;
  description?: string;
  image_url: string;
  place_name: string;
  slug: string;
  lat: number;
  lng: number;
};

export default function OrizontalSpotCard({
  title,
  description,
  image_url,
  place_name,
  lat,
  lng,
  slug,
}: SpotCardProps) {
  const date = new Date();
  const [sunset, setSunset] = useState<string>("");
  const [sunAlert, setSunAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const result = getSunsetInfo(date, lat, lng);

    setSunAlert(null);

    if (!result.value) {
      setSunset("—");
      setSunAlert(result.info);
      return;
    }

    const h = result.value.getHours().toString().padStart(2, "0");
    const m = result.value.getMinutes().toString().padStart(2, "0");
    const formatted = `${h}:${m}`;

    const now = date;
    const nowStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const prefix = formatted < nowStr ? "Domani" : "Oggi";

    setSunset(`${prefix} ${formatted}`);

    if (result.type !== "sunset") {
      setSunAlert(result.info);
    }
  }, [lat, lng, date]);

  return (
    <Link
      href={`spot/${slug}`}
      className="relative col-span-1 md:col-span-3 grid grid-cols-3 gap-4 p-4 rounded-md bg-orange-100 shadow-md hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] group"
      target="_blank"
    >
      <div className="relative col-span-1 h-52 rounded-md overflow-hidden">
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />

        {sunset && (
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-orange-50 px-3 py-1 rounded-full text-sm shadow-lg pointer-events-none">
            <Clock />
            {sunset}
          </div>
        )}
      </div>

      <div className="col-span-2 flex flex-col gap-2 text-orange-900">
        <h5 className="font-semibold text-lg line-clamp-2">{title}</h5>
        {description && (
          <p className="text-sm text-orange-700 line-clamp-6">{description}</p>
        )}
        <div className="flex items-center gap-2 mt-auto text-orange-600 text-sm">
          <Location />
          <span className="line-clamp-1">{place_name}</span>
        </div>
      </div>
    </Link>
  );
}
