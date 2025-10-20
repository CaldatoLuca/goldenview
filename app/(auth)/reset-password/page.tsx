"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { Spinner } from "@/components/ui/spinner";
import { PasswordField } from "@/components/ui/password-input";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setTokenError("Token mancante nell'URL");
        setIsValidating(false);
        return;
      }

      try {
        await authService.validateResetToken({ token: token });
        setIsValidating(false);
      } catch (err) {
        setTokenError(err instanceof Error ? err.message : "Token non valido");
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(data);

      //    await authService.resetPassword({ ...data, token });

      router.push("/login");
    } catch (err) {
      console.log("Errore durante il reset della password:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="w-full lg:px-8 flex items-center justify-center text-orange-50">
        <Spinner />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="w-full lg:px-8">
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {tokenError}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-8">
      <h1 className="text-orange-100 text-3xl font-semibold mb-4">
        Inserisci la nuova password
      </h1>

      <div className="text-orange-200 flex gap-2 mb-8">
        Una volta resettata, potrai usare la nuova password per accedere al tuo
        account.
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mb-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <PasswordField register={register} errors={errors} />

          <PasswordField
            register={register}
            errors={errors}
            fieldName="confirmPassword"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          size={"lg"}
        >
          {isLoading && <Spinner />}
          Reset Password
        </Button>
      </form>
    </div>
  );
}
