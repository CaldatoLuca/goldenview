import { useState, useEffect, useCallback } from "react";
import type { LocationData, UseLocationReturn } from "@/types/location";

const LOCATION_MAX_AGE = 60 * 60 * 1000;

export function useUserLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation non supportata dal browser");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };
        setLocation(locationData);
        setError(null);
        localStorage.setItem("locationRequested", "true");
        localStorage.setItem("userLocation", JSON.stringify(locationData));
        setLoading(false);
      },
      (err: GeolocationPositionError) => {
        setError(err.message);
        localStorage.setItem("locationRequested", "true");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  const checkAndUpdateLocation = useCallback(() => {
    const saved = localStorage.getItem("userLocation");

    if (saved) {
      try {
        const savedLocation = JSON.parse(saved) as LocationData;
        const locationAge =
          Date.now() - new Date(savedLocation.timestamp).getTime();

        if (locationAge > LOCATION_MAX_AGE) {
          console.log("Posizione obsoleta, aggiornamento in corso...");
          requestLocation();
        } else {
          setLocation(savedLocation);
          setLoading(false);
        }
      } catch (e) {
        console.error("Errore nel parsing della location salvata:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [requestLocation]);

  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem("locationRequested");

    if (!hasRequestedLocation) {
      setLoading(false);
    } else {
      checkAndUpdateLocation();
    }
  }, [checkAndUpdateLocation]);

  return { location, error, loading, requestLocation };
}
