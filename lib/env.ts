/**
 * Helper centralizzato per le variabili d'ambiente.
 * Usato per avere type-safety e capire in quale environment si sta girando.
 */

export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",

  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "",

  nextAuthUrl: process.env.NEXTAUTH_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  uploadthingSecret: process.env.UPLOADTHING_SECRET,
  uploadthingAppId: process.env.UPLOADTHING_APP_ID,

  resendApiKey: process.env.RESEND_API_KEY,

  databaseUrl: process.env.DATABASE_URL,
} as const;
