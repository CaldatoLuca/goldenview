import { useQuery } from "@tanstack/react-query";
import {
  spotService,
  GetSpotsParams,
  GetSpotsResponse,
  Spot,
} from "@/lib/services/spotService";

export function useSpots(params: GetSpotsParams) {
  return useQuery<GetSpotsResponse>({
    queryKey: ["spots", params],
    queryFn: () => spotService.getAll(params),
    staleTime: 1000 * 60 * 1,
  });
}

export const useSpotBySlug = (slug: string | undefined) => {
  return useQuery<Spot>({
    queryKey: ["spot", slug],
    queryFn: () => spotService.getBySlug(slug!),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
};

export function usePopularSpots() {
  return useQuery<GetSpotsResponse>({
    queryKey: ["spots", "popular"],
    queryFn: () =>
      spotService.getAll({ limit: 10, active: true, public: true }),
  });
}

export function useLatestSpots() {
  return useQuery<GetSpotsResponse>({
    queryKey: ["spots", "latest"],
    queryFn: () =>
      spotService.getAll({ limit: 10, public: true, active: true }),
  });
}

export function useNearbySpots(
  lat: number | undefined,
  lng: number | undefined,
  params?: Omit<GetSpotsParams, "latitude" | "longitude">
) {
  const queryParams: GetSpotsParams = {
    ...params,
    limit: params?.limit ?? 10,
    public: true,
    active: true,
    latitude: lat ?? undefined,
    longitude: lng ?? undefined,
  };

  return useQuery<GetSpotsResponse>({
    queryKey: ["spots", "nearby", lat, lng, params],

    queryFn: () => spotService.getNearby(queryParams),

    enabled: lat != null && lng != null,
  });
}
