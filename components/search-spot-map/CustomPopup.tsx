"use client";
import { FaLocationDot as Location } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { getSunsetInfo } from "@/lib/sun-calc";
import { useEffect, useState } from "react";
import { FaSun as Sun } from "react-icons/fa6";

type Props = {
  title: string;
  img: string;
  place_name: string | null | undefined;
  lat: number;
  lng: number;
  slug: string;
};

export default function CustomPopup({
  title,
  img,
  place_name,
  lat,
  lng,
  slug,
}: Props) {
  const date = new Date();
  const [sunset, setSunset] = useState<string | null>(null);

  useEffect(() => {
    const sunsetTime = getSunsetInfo(date, lat, lng).value;
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
    <Link
      className="text-neutral-800 grid grid-cols-3 gap-2 "
      href={`/spot/${slug}`}
      target="_blanck"
    >
      <div className="w-full relative col-span-1 h-16">
        <Image
          src={img}
          alt={title}
          height={48}
          width={48}
          loading="lazy"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-2">
        <div className=" font-semibold line-clamp-1">{title}</div>
        {place_name && (
          <div className="flex items-center gap-2 text-neutral-700">
            <Location />
            <p className="text-sm">{place_name}</p>
          </div>
        )}
        <div className="flex items-center gap-2 text-neutral-700">
          <Sun />
          <p className="text-sm">{sunset}</p>
        </div>
      </div>
    </Link>
  );
}
