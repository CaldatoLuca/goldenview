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

const spotSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  userId: z.string().optional().nullable(),
  images: z.array(z.url("URL immagine non valido")).optional().default([]),
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      public: true,
      active: true,
    },
  });

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
                <Label htmlFor="public" className="text-orange-100">
                  Pubblico
                </Label>
                {errors.public && (
                  <p className="text-sm text-red-600">
                    {errors.public.message}
                  </p>
                )}
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
                <Label htmlFor="active" className="text-orange-100">
                  Attivo
                </Label>
                {errors.active && (
                  <p className="text-sm text-red-600">
                    {errors.active.message}
                  </p>
                )}
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
