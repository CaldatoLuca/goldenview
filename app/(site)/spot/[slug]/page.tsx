"use client";
import { useParams } from "next/navigation";
import { useSpotBySlug } from "@/hooks/useSpots";
import { Button } from "@/components/ui/button";
import { FaDirections as Directions } from "react-icons/fa";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SpotPositionMap from "@/components/SpotPositionMap";
import Footer from "@/components/Footer";
import { getDirectionsLink } from "@/lib/utils";
import RenderStars from "@/components/RenderStars";
import { Spinner } from "@/components/ui/spinner";

export default function SpotDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: spot,
    isLoading: spotLoading,
    isError: spotError,
  } = useSpotBySlug(slug);

  if (!spot) {
    return;
  }

  if (spotLoading) {
    return <Spinner />;
  }

  if (spotError) {
    return <div>errore</div>;
  }

  const mainImage = spot.images[0];
  const additionalImages = spot.images?.slice(1, 5) || [];

  return (
    <>
      <section className="container mx-auto px-4 py-12 text-neutral-800">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 flex justify-between items-center">
            <div>
              <h2>{spot?.name}</h2>
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

          <div className="col-span-5 grid grid-cols-5 gap-2 h-96">
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

          <div className="col-span-3 flex flex-col gap-4 ">
            <Card>
              <CardHeader>
                <h5>Informazioni</h5>
              </CardHeader>
              <CardContent>
                <p>{spot.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <h5>Posizione</h5>
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

      <Footer />
    </>
  );
}
