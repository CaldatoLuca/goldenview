import { GetSpotsResponse, Spot } from "@/lib/services/spotService";
import { Skeleton } from "./ui/skeleton";
import SpotCard from "./SpotCard";
import { AlertCircle } from "lucide-react";

interface SpotSectionProps {
  spots: GetSpotsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  title: string;
  subtitle: string;
}

export default function SpotSection({
  spots,
  isLoading,
  isError,
  title,
  subtitle,
}: SpotSectionProps) {
  const spotList = spots?.spots;

  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-neutral-900 mb-1">{title}</h2>
        <p className="text-neutral-600">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-96 w-full bg-neutral-400 rounded-xl"
            />
          ))
        ) : isError ? (
          <div className="col-span-full flex flex-col items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-red-900 mb-2">
                Errore nel caricamento
              </h4>
              <p className="text-red-700 text-sm mb-4">
                Non è stato possibile caricare gli spot. Riprova più tardi.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Ricarica pagina
              </button>
            </div>
          </div>
        ) : (
          spotList?.map((spot: Spot) => (
            <SpotCard
              key={spot.id}
              name={spot.name}
              description={spot.description}
              image_url={spot.images[0]}
              place_name={spot.place}
              slug={spot.slug}
              lat={spot.latitude}
              lng={spot.longitude}
              spot_id={spot.id}
            />
          ))
        )}
      </div>
    </section>
  );
}
