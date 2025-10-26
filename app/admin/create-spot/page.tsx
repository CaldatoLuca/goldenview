"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { spotService } from "@/lib/services/spotService";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { X } from "lucide-react";
import Image from "next/image";

const spotSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  userId: z.string().optional().nullable(),
  images: z
    .array(z.string().url("URL immagine non valido"))
    .optional()
    .default([]),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  address: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  public: z.boolean().default(true),
  active: z.boolean().default(true),
});

type AdminCreateFormData = z.infer<typeof spotSchema>;

export default function AdminCreateSpotPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      public: true,
      active: true,
      images: [],
    },
  });

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: AdminCreateFormData) => {
    console.log(data);
    setIsLoading(true);
    setError(null);

    // try {
    //   // await spotService.create(data);
    // } catch (err) {
    //   console.log("Errore durante la creazione:", err);
    //   setError(err instanceof Error ? err.message : "Errore sconosciuto");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-orange-400 p-8 rounded-md col-span-2 lg:col-span-1">
        <h1 className="text-orange-50 text-3xl font-semibold mb-4">
          Crea Spot
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 mb-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Input
                id="name"
                type="text"
                placeholder="Nome"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Textarea
                id="description"
                placeholder="Descrizione"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-2 bg-orange-600 rounded-md p-4">
              <Label className="text-orange-50">
                Immagini ({uploadedImages.length}/5)
              </Label>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={96}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res.map((file) => file.ufsUrl);
                  const newImages = [...uploadedImages, ...urls].slice(0, 5);
                  setUploadedImages(newImages);
                  setValue("images", newImages);
                }}
                onUploadError={(error: Error) => {
                  setError(`Errore upload: ${error.message}`);
                }}
                appearance={{
                  button:
                    "bg-orange-300/60 text-orange-50 px-4 py-2 rounded-md hover:bg-orange-300/80 transition-all ut-ready:bg-orange-300/60 ut-uploading:bg-orange-300/40",
                  allowedContent: "text-orange-100 text-sm",
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (isUploading) return "Caricamento...";
                    if (ready) return "Carica immagini";
                    return "Preparazione...";
                  },
                  allowedContent({ ready, isUploading }) {
                    if (!ready) return "Controllo...";
                    if (isUploading) return "";
                    return "Fino a 5 immagini (max 4MB)";
                  },
                }}
              />
              {errors.images && (
                <p className="text-sm text-red-600">{errors.images.message}</p>
              )}
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Controller
                  name="public"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="public"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="public" className="text-orange-50">
                  Pubblico
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="active" className="text-orange-50">
                  Attivo
                </Label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size={"lg"}
          >
            {isLoading && <Spinner />}
            Crea
          </Button>
        </form>
      </div>

      <div className="bg-orange-50 p-8 rounded-md col-span-2 lg:col-span-1">
        ciao
      </div>
    </div>
  );
}
