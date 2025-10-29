"use client";

import { useLocation } from "@/components/LocationProvider";

export default function Home() {
  const { location, error } = useLocation();

  console.log(location);

  const handleClearStorage = () => {
    localStorage.removeItem("locationRequested");
    localStorage.removeItem("userLocation");
    window.location.reload(); // Ricarica la pagina per resettare lo stato
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Benvenuto!</h1>

      {location && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">La tua posizione:</h2>
          <p>Latitudine: {location.latitude}</p>
          <p>Longitudine: {location.longitude}</p>
          <p className="text-sm text-gray-600 mt-2">
            Rilevata il: {new Date(location.timestamp).toLocaleString("it-IT")}
          </p>

          <button
            onClick={handleClearStorage}
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition"
            title="Cancella i dati salvati per testare di nuovo"
          >
            🧪 Reset Test
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          Errore: {error}
        </div>
      )}

      <button
        onClick={handleClearStorage}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition"
        title="Cancella i dati salvati per testare di nuovo"
      >
        🧪 Reset Test
      </button>
    </div>
  );
}
