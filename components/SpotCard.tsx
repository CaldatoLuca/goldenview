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
  is_liked?: boolean;
  is_saved?: boolean;
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
    <div className="spot-card relative transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg rounded-md overflow-hidden bg-white group">
      <div className="w-full h-56 relative">
        <Link href={`/spot/${slug}`} className="block w-full h-full">
          <Image
            src={image_url}
            alt={name}
            height={256}
            width={256}
            loading="lazy"
            className="object-cover w-full h-full cursor-pointer"
          />
        </Link>

        {sunset && (
          <div className="text-sm text-white absolute start-4 top-4 bg-orange-500 flex gap-2 items-center px-2 py-1 opacity-95 shadow-2xl rounded-lg pointer-events-none">
            <Clock />
            {sunset}
          </div>
        )}
      </div>

      <Link href={`/spot/${slug}`} className="block">
        <div className="p-4 text-neutral-800 flex flex-col gap-2 cursor-pointer">
          <h5 className="font-semibold text-base">{name}</h5>
          {description && (
            <p className="text-sm w-2/3 line-clamp-2 text-neutral-600">
              {description}
            </p>
          )}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2 text-neutral-700">
              <Location />
              <p className="text-sm line-clamp-1">{place_name}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
