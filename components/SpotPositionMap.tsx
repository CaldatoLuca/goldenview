"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { FaSun as Sun } from "react-icons/fa6";
import { createRoot } from "react-dom/client";

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_API_KEY!;

type Props = {
  longitude: number;
  latitude: number;
};

export default function SpotPositionMap({ longitude, latitude }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12,
    });

    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";

    const root = createRoot(markerElement);
    root.render(<Sun size={24} className="text-orange-500" />);

    new mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .addTo(map);

    setMapInstance(map);

    return () => map.remove();
  }, [longitude, latitude]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
