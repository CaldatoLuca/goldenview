"use client";

import { useLocation } from "@/components/location/LocationProvider";
import { useNearbySpots } from "@/hooks/useSpots";
import { useSearchParams } from "next/navigation";
import OrizontalSpotCard from "@/components/orizontal-spot-card/OrizontalSpotCard";
import SearchSpotMap from "@/components/search-spot-map/SearchSpotMap";
import SearchPlaceBar from "@/components/SearchPlaceBar";
import SpotsPageSkeleton from "@/components/spot-page/Skeleton";

export default function SpotsPage() {
  const searchParams = useSearchParams();
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const { location, error, requestLocation } = useLocation();

  const lat = latParam ? parseFloat(latParam) : location?.latitude;
  const lng = lngParam ? parseFloat(lngParam) : location?.longitude;

  const {
    data: nearbySpots,
    isLoading: nearbyLoading,
    isError: nearbyError,
  } = useNearbySpots(location?.latitude, location?.longitude);

  if (nearbyLoading || !nearbySpots) {
    return <SpotsPageSkeleton />;
  }

  if (nearbyError) {
    return <div>errore</div>;
  }

  return (
    <section className="container mx-auto p-8">
      <div className="grid grid-cols-7 h-full gap-12">
        <div className="col-span-7 lg:col-span-4 h-full flex flex-col text-neutral-800">
          <SearchPlaceBar />

          <ul className="flex-1 rounded-md mt-8">
            {nearbySpots.spots.map((spot: any) => (
              <li key={spot.id} className="mb-4">
                <OrizontalSpotCard
                  title={spot.name}
                  description={spot.description}
                  image_url={spot.images[0]}
                  place_name={spot.place}
                  lat={spot.latitude}
                  lng={spot.longitude}
                  slug={spot.slug}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 hidden lg:block">
          <div className="sticky top-28 bg-neutral-400 rounded-2xl h-[calc(100vh-10rem)] overflow-hidden shadow-xl">
            <SearchSpotMap
              longitude={lng || nearbySpots.spots[0].longitude}
              latitude={lat || nearbySpots.spots[0].latitude}
              spots={nearbySpots.spots}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
