"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import CustomPopup from "./CustomPopup";
import CustomMarker from "./CustomMarker";
import { Spot } from "@/lib/services/spotService";

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_API_KEY!;

type Props = {
  longitude: number;
  latitude: number;
  spots: Spot[];
};

export default function SearchSpotMap({ longitude, latitude, spots }: Props) {
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

    map.addControl(new mapboxgl.NavigationControl());

    setMapInstance(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapInstance || !spots.length) return;

    spots.forEach((spot) => {
      const markerEl = document.createElement("div");
      const popupEl = document.createElement("div");
      let hideTimeout: NodeJS.Timeout | null = null;

      const popupRoot = createRoot(popupEl);
      popupRoot.render(
        <CustomPopup
          title={spot.name}
          img={spot.images[0]}
          place_name={spot.place}
          lat={spot.latitude}
          lng={spot.longitude}
          slug={spot.slug}
        />
      );

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        className: "my-custom-popup",
      }).setDOMContent(popupEl);

      const markerRoot = createRoot(markerEl);
      markerRoot.render(
        <CustomMarker
          title={spot.name}
          onClick={() =>
            mapInstance.flyTo({
              center: [spot.longitude, spot.latitude],
              zoom: 14,
            })
          }
        />
      );

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(mapInstance);

      const setupPopupEvents = () => {
        const popupContainer = document.querySelector(".mapboxgl-popup");
        if (popupContainer) {
          popupContainer.addEventListener("mouseenter", () => {
            if (hideTimeout) {
              clearTimeout(hideTimeout);
              hideTimeout = null;
            }
          });

          popupContainer.addEventListener("mouseleave", () => {
            hideTimeout = setTimeout(() => {
              popup.remove();
            }, 100);
          });
        }
      };

      markerEl.addEventListener("mouseenter", () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        popup.setLngLat([spot.longitude, spot.latitude]).addTo(mapInstance);

        setTimeout(setupPopupEvents, 10);
      });

      markerEl.addEventListener("mouseleave", () => {
        hideTimeout = setTimeout(() => {
          popup.remove();
        }, 200);
      });

      markerEl.addEventListener("click", () => {
        mapInstance.flyTo({
          center: [spot.longitude, spot.latitude],
          zoom: 14,
        });
      });
    });
  }, [mapInstance, spots]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
