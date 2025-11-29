import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient, Prisma } from "@prisma/client";
import axios from "axios";
import SunCalc from "suncalc";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const prisma = new PrismaClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateUniqueSlug(
  name: string,
  model: any,
  slugField: string = "slug"
): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let count = 1;

  while (
    await model.findFirst({
      where: { [slugField]: slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

export async function fetchMapboxPlaces(query: string) {
  if (!query) return [];

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          autocomplete: true,
          limit: 5,
          language: "it",
          proximity: "ip",
          types: [
            "country",
            "region",
            "place",
            "locality",
            "neighborhood",
            "poi",
          ].join(","),
        },
      }
    );

    return response.data.features || [];
  } catch (error) {
    console.error("Errore nella chiamata a Mapbox:", error);
    return [];
  }
}

export function getSunsetTime(date: Date, lat: number, lng: number) {
  const data = SunCalc.getTimes(date, lat, lng);
  return data.sunset;
}

export function getDirectionsLink(lat: number, lng: number) {
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    const iosUrl = `maps://maps.google.com/maps?q=${lat},${lng}`;
    const androidUrl = `geo:${lat},${lng}?q=${lat},${lng}`;

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = iosUrl;
    } else if (/Android/.test(navigator.userAgent)) {
      window.location.href = androidUrl;
    } else {
      window.open(`https://maps.google.com/maps?q=${lat},${lng}`, "_blank");
    }
  } else {
    window.open(`https://maps.google.com/maps?q=${lat},${lng}`, "_blank");
  }
}
