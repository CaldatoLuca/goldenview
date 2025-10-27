import { apiClient } from "../api-client";

export interface DeleteRequest {
  fileKey: String;
}

export interface DeleteResponse {
  success: Boolean;
}

export const uploadThingService = {
  delete: async (data: DeleteRequest): Promise<DeleteResponse> => {
    return apiClient.post<DeleteResponse>("/uploadthing/delete", data);
  },
};
