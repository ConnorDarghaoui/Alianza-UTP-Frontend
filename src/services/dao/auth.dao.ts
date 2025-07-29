import apiClient from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';

type ApiResponse<T> = [T | null, string | null];

export const authDAO = {
  async login(credentials: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Login failed'];
    }
  },

  async register(userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Registration failed'];
    }
  },

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.GET_PROFILE);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch profile'];
    }
  },

  async logout(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Logout failed'];
    }
  },

  async refreshToken(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Token refresh failed'];
    }
  },

  async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Password reset request failed'];
    }
  },

  async verifyResetCode(code: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, { code });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Code verification failed'];
    }
  },

  async submitNewPassword(password: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SUBMIT_RESET, { password });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Password submission failed'];
    }
  },
};
