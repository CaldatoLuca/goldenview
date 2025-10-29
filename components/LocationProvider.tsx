import { createContext, useContext, ReactNode } from "react";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { UseLocationReturn } from "@/types/location";

const LocationContext = createContext<UseLocationReturn | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const locationData = useUserLocation();

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation deve essere usato dentro LocationProvider");
  }
  return context;
}
