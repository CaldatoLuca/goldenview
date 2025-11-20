import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient, Prisma } from "@prisma/client";
import axios from "axios";

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
