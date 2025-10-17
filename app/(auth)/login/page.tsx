"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle as Google, FaApple as Apple } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.email("Email non valida"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Email o password non corretti");
        return;
      }

      if (signInResult?.ok) {
        router.push("/");
      }
    } catch (err) {
      console.log("Errore durante il login:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleAppleSignIn = () => {
    signIn("apple", { callbackUrl: "/" });
  };

  return (
    <div className="w-full lg:px-8">
      <h1 className="text-orange-100 text-3xl font-semibold mb-4">
        Accedi al tuo account
      </h1>
      <div className="text-orange-200 flex gap-2 mb-8">
        Non hai un account?
        <Link
          href={"/register"}
          className="underline text-orange-50 font-medium"
        >
          Registrati
        </Link>
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

          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          size={"lg"}
        >
          {isLoading && <Spinner />}
          Accedi
        </Button>
      </form>
      <Separator className="my-8 bg-orange-300" />
      <div className="grid gap-4 grid-cols-2">
        <div className="col-span-1">
          <Button
            className="w-full text-orange-100 bg-orange-700"
            variant="ghost"
            onClick={handleGoogleSignIn}
            size={"lg"}
          >
            <Google />
            Google
          </Button>
        </div>

        <div className="col-span-1">
          <Button
            className="w-full text-orange-100 bg-orange-700"
            variant="ghost"
            onClick={handleAppleSignIn}
            size={"lg"}
          >
            <Apple />
            Apple
          </Button>
        </div>
      </div>
    </div>
  );
}
