"use client";

import { SessionProvider } from "next-auth/react";
import { LocationProvider } from "./components/LocationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <LocationProvider>{children}</LocationProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
