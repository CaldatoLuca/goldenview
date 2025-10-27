import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient, Prisma } from "@prisma/client";

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
