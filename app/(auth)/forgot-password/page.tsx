"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/lib/services/auth.service";

const forgotPasswordSchema = z.object({
  email: z.email("Email non valida"),
});

type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("Invia");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: forgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authService.forgotPassword(data);

      setSuccessMessage(res.message);
    } catch (err) {
      console.log("Errore durante reset password:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:px-8">
      <h1 className="text-orange-100 text-3xl font-semibold mb-4">
        Reimposta la password
      </h1>

      <div className="text-orange-50 flex gap-2 mb-8">
        Inserisci l'email del tua account qua sotto, riceverai via mail le
        istruzioni per reimpostare la password
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLoading || successMessage === "Email inviata con successo!"
          }
          size={"lg"}
        >
          {isLoading && <Spinner />}
          {successMessage}
        </Button>
      </form>
    </div>
  );
}
