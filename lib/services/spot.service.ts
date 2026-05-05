import { apiClient } from "../api-client";

export interface Spot {
  id: string;
  name: string;
  slug: string;
  userId?: string | null;
  images: string[];
  latitude: number;
  longitude: number;
  address?: string | null;
  place?: string | null;
  description?: string | null;
  public: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  distance?: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateRequest {
  name: string;
  description?: string | null;
  public?: boolean;
  active?: boolean;
  images?: string[];
  place?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface CreateResponse {
  spot: Spot;
}

export interface GetSpotsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  public?: boolean;
  place?: string;
  latitude?: number;
  longitude?: number;
}

export interface GetSpotsResponse {
  spots: Spot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DeleteResponse {
  message: string;
}

export const spotService = {
  create: async (data: CreateRequest): Promise<CreateResponse> => {
    return apiClient.post<CreateResponse>("/spot", data);
  },

  getAll: async (params?: GetSpotsParams): Promise<GetSpotsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.active !== undefined)
      searchParams.append("active", params.active.toString());
    if (params?.public !== undefined)
      searchParams.append("public", params.public.toString());
    if (params?.place) searchParams.append("place", params.place);
    if (params?.latitude)
      searchParams.append("latitude", params.latitude.toString());
    if (params?.longitude)
      searchParams.append("longitude", params.longitude.toString());

    const query = searchParams.toString();
    const url = query ? `/spot?${query}` : "/spot";

    return apiClient.get<GetSpotsResponse>(url);
  },

  getNearby: async (params: GetSpotsParams): Promise<GetSpotsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.active !== undefined)
      searchParams.append("active", params.active.toString());
    if (params?.public !== undefined)
      searchParams.append("public", params.public.toString());
    if (params?.place) searchParams.append("place", params.place);
    if (params?.latitude)
      searchParams.append("latitude", params.latitude.toString());
    if (params?.longitude)
      searchParams.append("longitude", params.longitude.toString());

    const query = searchParams.toString();
    const url = query ? `/spot/nearby?${query}` : "/spot/nearby";

    return apiClient.get<GetSpotsResponse>(url);
  },

  getBySlug: async (slug: string): Promise<Spot> => {
    return apiClient.get<Spot>(`/spot/${slug}`);
  },

  delete: async (id: string): Promise<DeleteResponse> => {
    return apiClient.delete<DeleteResponse>(`/spot?id=${id}`);
  },
};
