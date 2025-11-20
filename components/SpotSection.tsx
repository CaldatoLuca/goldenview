// components/SpotSection.tsx

import { GetSpotsResponse, Spot } from "@/lib/services/spotService";

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

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p>Caricamento {title.toLowerCase()}...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Errore nel caricamento degli spot. Riprova più tardi.</p>
      </div>
    );
  }

  if (!spotList || spotList.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>Nessuno spot trovato. Sii il primo ad aggiungerne uno!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {spotList.map((spot: Spot) => (
          <div key={spot.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="font-semibold">{spot.name}</h3>
            <p className="text-sm text-gray-500">
              Lat:{" "}
              {typeof spot.latitude === "number"
                ? spot.latitude.toFixed(4)
                : "N/A"}
              , Lon:{" "}
              {typeof spot.latitude === "number"
                ? spot.latitude.toFixed(4)
                : "N/A"}
            </p>
            {spot.distance && (
              <p className="text-sm text-blue-600">
                Distanza: {(spot.distance / 1000).toFixed(2)} km
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
