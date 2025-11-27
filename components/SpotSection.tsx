import { GetSpotsResponse, Spot } from "@/lib/services/spotService";
import { Skeleton } from "./ui/skeleton";
import SpotCard from "./SpotCard";

interface SpotSectionProps {
  spots: GetSpotsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  title: string;
}

export default function SpotSection({
  spots,
  isLoading,
  isError,
  title,
}: SpotSectionProps) {
  const spotList = spots?.spots;

  return (
    <>
      <h3 className="text-2xl font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-4 gap-8">
        {isLoading ? (
          <div className="col-span-4 grid grid-cols-4 gap-8">
            <Skeleton className="h-96 w-full col-span-1 bg-neutral-400" />
            <Skeleton className="h-96 w-full col-span-1 bg-neutral-400" />
            <Skeleton className="h-96 w-full col-span-1 bg-neutral-400" />
            <Skeleton className="h-96 w-full col-span-1 bg-neutral-400" />
          </div>
        ) : isError ? (
          <div className="col-span-1">errore</div>
        ) : (
          <>
            {spotList?.map((spot: Spot) => (
              <div className="col-span-1" key={spot.id}>
                <SpotCard
                  name={spot.name}
                  description={spot.description}
                  image_url={spot.images[0]}
                  place_name={spot.place}
                  slug={spot.slug}
                  lat={spot.latitude}
                  lng={spot.longitude}
                  spot_id={spot.id}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
