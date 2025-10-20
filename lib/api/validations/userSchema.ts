import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .optional(),
  email: z.email("Email non valida"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email non valida"),
});

export const resetTokenSchema = z.object({
  token: z.string("Token non valido"),
});
