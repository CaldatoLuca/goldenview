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
      <button
        onClick={() => {
          localStorage.removeItem("locationRequested");
          localStorage.removeItem("userLocation");
        }}
      >
        click
      </button>
      <div className="p-4">
        {!location && <LocationErrorBanner onRetry={handleRetryLocation} />}

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
