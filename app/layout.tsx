import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { LocationModal } from "@/components/location/LocationModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golden View",
  description: "Sunset and sunrise times for any location in the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <Providers>
          {children}
          <LocationModal />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
