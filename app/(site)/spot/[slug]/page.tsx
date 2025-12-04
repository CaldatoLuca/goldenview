"use client";
import { useParams } from "next/navigation";
import { useSpotBySlug } from "@/hooks/useSpots";
import { Button } from "@/components/ui/button";
import { FaDirections as Directions } from "react-icons/fa";
import Image from "next/image";
import SpotPositionMap from "@/components/SpotPositionMap";
import { getDirectionsLink } from "@/lib/utils";
import SpotDetailsSkeleton from "@/components/spot-details-page/Skeleton";
import Carousel from "@/components/ui/Carousel";
import ExpandableText from "@/components/ui/ExpandableText";

export default function SpotDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: spot,
    isLoading: spotLoading,
    isError: spotError,
  } = useSpotBySlug(slug);

  if (spotLoading) {
    return <SpotDetailsSkeleton />;
  }

  if (spotError) {
    return <div>errore</div>;
  }

  if (!spot) {
    return;
  }

  const mainImage = spot.images[0];
  const additionalImages = spot.images?.slice(1, 5) || [];

  return (
    <>
      <div className="col-span-5 h-96 lg:hidden">
        <Carousel images={spot.images} />
      </div>

      <section className="container mx-auto p-8">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 flex justify-between items-center">
            <div>
              <h2 className="font-medium text-3xl text-orange-800">
                {spot?.name}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={"secondary"}
                onClick={() =>
                  getDirectionsLink(spot?.latitude, spot?.longitude)
                }
              >
                <Directions /> Direzioni
              </Button>
            </div>
          </div>

          <div className="col-span-5 hidden lg:grid grid-cols-5 gap-2 h-96">
            <div className="col-span-3 h-full overflow-hidden rounded-lg relative">
              <Image
                src={mainImage}
                fill
                alt={spot?.slug}
                className="object-cover"
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
              {additionalImages.map((img: string, i: number) => (
                <div
                  key={i}
                  className="col-span-1 h-full overflow-hidden rounded-lg relative"
                >
                  <Image
                    src={img}
                    fill
                    alt={`${spot.slug}-${i}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-5 lg:col-span-3 text-orange-900 p-8 shadow-2xl rounded-md bg-orange-300/80">
            <ExpandableText text={spot.description} />
            <p className="hidden lg:block">{spot.description}</p>
          </div>

          <div className="col-span-5 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <h5 className="text-orange-800 font-medium">Posizione</h5>
              <div className="h-80 rounded-lg overflow-hidden">
                <SpotPositionMap
                  latitude={spot.latitude}
                  longitude={spot.longitude}
                />
              </div>
              <div className="w-full">
                <Button
                  variant={"secondary"}
                  className="w-full"
                  onClick={() =>
                    getDirectionsLink(spot.latitude, spot.longitude)
                  }
                >
                  <Directions /> Ottieni direzioni
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
