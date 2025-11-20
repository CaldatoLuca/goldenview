"use client";
import { useLocation } from "@/components/LocationProvider";
import Hero from "@/components/Hero";
import SpotSection from "@/components/SpotSection";
import { useNearbySpots, useLatestSpots } from "@/hooks/useSpots";

export default function Home() {
  const { location, error } = useLocation();

  const {
    data: latestSpots,
    isLoading: latestLoading,
    isError: latestError,
  } = useLatestSpots();

  const {
    data: nearbySpots,
    isLoading: nearbyLoading,
    isError: nearbyError,
  } = useNearbySpots(location?.latitude, location?.longitude);

  return (
    <>
      <Hero />
      <div className="p-4">
        <p>
          lat {location?.latitude} lon {location?.longitude}
        </p>
        {error && (
          <div className="text-red-500">Errore geolocalizzazione: {error}</div>
        )}

        <SpotSection
          title="Ultimi Spot"
          spots={latestSpots}
          isLoading={latestLoading}
          isError={latestError}
        />

        {location && (
          <SpotSection
            title="Spot Vicini"
            spots={nearbySpots}
            isLoading={nearbyLoading}
            isError={nearbyError}
          />
        )}
      </div>
    </>
  );
}
