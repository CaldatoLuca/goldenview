"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SpotsPageSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-7 gap-12">
        {/* Lista di spot */}
        <div className="col-span-4 flex flex-col">
          {/* Search bar */}
          <Skeleton className="h-12 w-full rounded-full mb-8" />

          {/* Titolo */}
          <Skeleton className="h-6 w-1/2 mb-6" />

          {/* Lista di card */}
          <ul className="flex-1 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <div className="flex gap-4 bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <Skeleton className="w-36 h-24 flex-shrink-0" />
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3">
          <Skeleton className="h-[calc(100vh-10rem)] rounded-2xl w-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
