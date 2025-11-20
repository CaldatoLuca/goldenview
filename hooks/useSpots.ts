import { useQuery } from "@tanstack/react-query";
import {
  spotService,
  GetSpotsParams,
  GetSpotsResponse,
} from "@/lib/services/spotService";

export function useSpots(params: GetSpotsParams) {
  return useQuery<GetSpotsResponse>({
    queryKey: ["spots", params],
    queryFn: () => spotService.getAll(params),
    staleTime: 1000 * 60 * 1,
  });
}

export function usePopularSpots() {
  return useQuery({
    queryKey: ["spots", "popular"],
    queryFn: () => spotService.getAll({ limit: 10, public: true }),
  });
}

export function useLatestSpots() {
  return useQuery({
    queryKey: ["spots", "latest"],
    queryFn: () => spotService.getAll({ limit: 10 }),
  });
}

export function useNearbySpots(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["spots", "nearby", lat, lng],
    queryFn: () =>
      spotService.getAll({
        limit: 10,
        place: "nearby",
        latitude: lat ?? undefined,
        longitude: lng ?? undefined,
      }),
    enabled: lat != null && lng != null,
  });
}
