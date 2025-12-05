"use client";

import Image from "next/image";
import { getSunsetInfo } from "@/lib/sun-calc";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaClock as Clock, FaLocationDot as Location } from "react-icons/fa6";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleQuestionMark } from "lucide-react";

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

        {sunAlert && (
          <div className="absolute top-3 right-3">
            <HoverCard>
              <HoverCardTrigger>
                <CircleQuestionMark className="text-orange-500" />
              </HoverCardTrigger>
              <HoverCardContent align="end" className="z-99 text-sm p-2">
                {sunAlert}
              </HoverCardContent>
            </HoverCard>
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
