import { apiClient } from "../api-client";

export interface Spot {
  id: string;
  name: string;
  userId?: string | null;
  images: string[];
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  place?: string | null;
  description?: string | null;
  public: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequest {
  name: string;
  description?: string | null | undefined;
}

export interface CreateResponse {
  spot: Spot;
}

export const spotService = {
  create: async (data: CreateRequest): Promise<CreateResponse> => {
    return apiClient.post<CreateResponse>("/spot", data);
  },
};
