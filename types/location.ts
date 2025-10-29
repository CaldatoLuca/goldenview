export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}
