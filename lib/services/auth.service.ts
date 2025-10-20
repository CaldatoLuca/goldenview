import { apiClient } from "../api-client";

export interface RegisterRequest {
  name?: string | undefined;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
}

export interface ResetPasswordResponse {
  userId: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>("/auth/register", data);
  },
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    return apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
  },
  validateResetToken: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    return apiClient.post<ResetPasswordResponse>("/auth/reset-password", data);
  },
};
