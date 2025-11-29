"use client";
import { useLocation } from "@/components/LocationProvider";
import { LocationErrorBanner } from "@/components/LocationErrorBanner";
import Hero from "@/components/Hero";
import SpotSection from "@/components/SpotSection";
import { useNearbySpots, useLatestSpots } from "@/hooks/useSpots";

export default function Home() {
  const { location, error, requestLocation } = useLocation();

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

  const handleRetryLocation = () => {
    if ((window as any).openLocationModal) {
      (window as any).openLocationModal();
    }
  };

  return (
    <>
      <Hero />

      <div className="container mx-auto p-8">
        {!location && <LocationErrorBanner onRetry={handleRetryLocation} />}

        <SpotSection
          title="Ultimi Spot"
          subtitle="Scopri gli ultimi spot"
          spots={latestSpots}
          isLoading={latestLoading}
          isError={latestError}
        />

        {location && (
          <SpotSection
            title="Spot Vicini"
            subtitle="Scopri gli spot più vicini a te"
            spots={nearbySpots}
            isLoading={nearbyLoading}
            isError={nearbyError}
          />
        )}
      </div>
    </>
  );
}
