"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpotDetailsSkeleton() {
  return (
    <section className="container mx-auto p-8 animate-pulse">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 h-96 lg:hidden">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        <div className="col-span-5 flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="col-span-5 hidden lg:grid grid-cols-5 gap-2 h-96">
          <div className="col-span-3 h-full overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
            <Skeleton className="w-full h-full rounded-lg" />
            <Skeleton className="w-full h-full rounded-lg" />
            <Skeleton className="w-full h-full rounded-lg" />
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>

        <div className="col-span-5 lg:col-span-3 p-8 shadow-2xl rounded-md bg-orange-300/80">
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        <div className="col-span-5 lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </section>
  );
}
