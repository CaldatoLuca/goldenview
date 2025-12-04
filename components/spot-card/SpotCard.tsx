"use client";

import Image from "next/image";
import { getSunsetTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaClock as Clock, FaLocationDot as Location } from "react-icons/fa6";

type SpotCardProps = {
  name: string;
  description?: string | null;
  image_url: string;
  place_name?: string | null;
  lat?: number | null;
  lng?: number | null;
  slug: string;
  spot_id: string;
};

export default function SpotCard({
  name,
  description,
  image_url,
  place_name,
  lat,
  lng,
  slug,
}: SpotCardProps) {
  const date = new Date();
  const [sunset, setSunset] = useState<string | null>(null);

  useEffect(() => {
    const sunsetTime = getSunsetTime(date, lat!, lng!);
    if (sunsetTime) {
      const sunsetHour = sunsetTime.getHours();
      const sunsetMinute = sunsetTime.getMinutes();
      const sunsetTimeFormatted = `${sunsetHour
        .toString()
        .padStart(2, "0")}:${sunsetMinute.toString().padStart(2, "0")}`;

      const currentHour = date.getHours();
      const currentMinute = date.getMinutes();
      const currentTimeFormatted = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      if (sunsetTimeFormatted < currentTimeFormatted) {
        setSunset(`Domani ${sunsetTimeFormatted}`);
      } else {
        setSunset(`Oggi ${sunsetTimeFormatted}`);
      }
    }
  }, [lat, lng]);

  return (
    <div className="relative rounded-md overflow-hidden bg-orange-100 shadow-md hover:shadow-2xl transition-transform duration-300 hover:scale-[1.02] group">
      <div className="relative w-full h-60 md:h-56">
        <Link href={`/spot/${slug}`} className="block w-full h-full">
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {sunset && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-orange-50 px-3 py-1 rounded-full text-sm shadow-lg pointer-events-none">
            <Clock />
            {sunset}
          </div>
        )}
      </div>

      <Link href={`/spot/${slug}`} className="block">
        <div className="p-4 flex flex-col gap-2 cursor-pointer">
          <h5 className="font-semibold text-lg md:text-base text-orange-900 truncate">
            {name}
          </h5>
          {description && (
            <p className="text-sm text-orange-700 line-clamp-3 md:line-clamp-2">
              {description}
            </p>
          )}
          {place_name && (
            <div className="flex items-center gap-2 mt-4 text-orange-600 text-sm">
              <Location />
              <span className="line-clamp-1">{place_name}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
