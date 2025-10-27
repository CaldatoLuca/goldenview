"use client";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error("NEXT_PUBLIC_MAPBOX_TOKEN non definita");
}

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_API_KEY;

type MapboxMapProps = {
  onLocationSelect?: (
    lat: number,
    lng: number,
    placeName: string,
    address: string
  ) => void;
};

export interface CreateSpotMapRef {
  flyTo: (lat: number, lng: number) => void;
}

const CreateSpotMap = forwardRef<CreateSpotMapRef, MapboxMapProps>(
  ({ onLocationSelect }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number) => {
        if (mapRef.current) {
          if (markerRef.current) {
            markerRef.current.remove();
          }

          const marker = new mapboxgl.Marker({
            color: "#ff0000",
          })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

          markerRef.current = marker;

          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            duration: 2000,
          });
        }
      },
    }));

    useEffect(() => {
      if (mapContainerRef.current && !mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [9.1859243, 45.4654219],
          zoom: 12,
        });

        mapRef.current = map;

        map.getCanvas().style.cursor = "pointer";

        const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
          const { lng, lat } = e.lngLat;

          if (markerRef.current) {
            markerRef.current.remove();
          }

          const marker = new mapboxgl.Marker({
            color: "#ff0000",
          })
            .setLngLat([lng, lat])
            .addTo(map);

          markerRef.current = marker;

          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
            );

            const data = await response.json();
            const features = data.features;

            const address = features.find((f: any) =>
              f.place_type.includes("address")
            );

            const place = features.find(
              (f: any) =>
                f.place_type.includes("place") ||
                f.place_type.includes("locality")
            );

            const region = features.find((f: any) =>
              f.place_type.includes("region")
            );

            const country = features.find((f: any) =>
              f.place_type.includes("country")
            );

            const placeName = [
              place?.text || region?.text || "Luogo sconosciuto",
              country?.text || "",
            ]
              .filter(Boolean)
              .join(", ");

            const addressName =
              address?.place_name || address?.text || "Indirizzo sconosciuto";

            if (onLocationSelect) {
              onLocationSelect(lat, lng, placeName, addressName);
            }
          } catch (error) {
            console.error("Error fetching place name:", error);
            if (onLocationSelect) {
              onLocationSelect(
                lat,
                lng,
                "Luogo sconosciuto",
                "Indirizzo sconosciuto"
              );
            }
          }
        };

        map.on("click", handleMapClick);

        return () => {
          if (markerRef.current) {
            markerRef.current.remove();
          }
          map.off("click", handleMapClick);
          map.remove();
        };
      }
    }, []);

    return <div className="w-full h-full rounded-md" ref={mapContainerRef} />;
  }
);

CreateSpotMap.displayName = "CreateSpotMap";

export default CreateSpotMap;
