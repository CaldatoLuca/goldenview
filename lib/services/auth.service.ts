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

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  userId: string;
}

export interface ResetPasswordRequest {
  password: string;
  userId: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
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
    data: ValidateTokenRequest
  ): Promise<ValidateTokenResponse> => {
    return apiClient.post<ValidateTokenResponse>("/auth/reset-password", data);
  },
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    return apiClient.put<ResetPasswordResponse>("/auth/reset-password", data);
  },
};
