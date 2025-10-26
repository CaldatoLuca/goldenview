import { z } from "zod";

export const spotSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  userId: z.string().optional().nullable(),
  images: z.array(z.url("URL immagine non valido")),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  address: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  public: z.boolean().default(true),
  active: z.boolean().default(true),
});

export const updateSpotSchema = spotSchema.partial();
