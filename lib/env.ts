import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().default("/api"),

  NEXT_PUBLIC_MAPBOX_TOKEN: z
    .string()
    .min(1, "NEXT_PUBLIC_MAPBOX_TOKEN is required"),

  NEXTAUTH_URL: z.url("NEXTAUTH_URL must be a valid connection URL"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  UPLOADTHING_SECRET: z.string().min(1, "UPLOADTHING_SECRET is required"),
  UPLOADTHING_APP_ID: z.string().min(1, "UPLOADTHING_APP_ID is required"),

  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  DATABASE_URL: z.url("DATABASE_URL must be a valid connection URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${formatted}`);
}

const _env = parsed.data;

export const env = {
  isDevelopment: _env.NODE_ENV === "development",
  isProduction: _env.NODE_ENV === "production",

  appUrl: _env.NEXT_PUBLIC_APP_URL,
  apiUrl: _env.NEXT_PUBLIC_API_URL,

  mapboxToken: _env.NEXT_PUBLIC_MAPBOX_TOKEN,

  nextAuthUrl: _env.NEXTAUTH_URL,
  nextAuthSecret: _env.NEXTAUTH_SECRET,

  googleClientId: _env.GOOGLE_CLIENT_ID,
  googleClientSecret: _env.GOOGLE_CLIENT_SECRET,

  uploadthingSecret: _env.UPLOADTHING_SECRET,
  uploadthingAppId: _env.UPLOADTHING_APP_ID,

  resendApiKey: _env.RESEND_API_KEY,

  databaseUrl: _env.DATABASE_URL,
} as const;
