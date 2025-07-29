import apiClient from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';

type ApiResponse<T> = [T | null, string | null];

export const adminDAO = {
  async getMemberStats(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.CLUBS.GET_MEMBERS_STATS(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch member stats'];
    }
  },

  async getMembersList(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.CLUBS.GET_MEMBERS_LIST(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch members list'];
    }
  },

  async getWeeklyHeatmap(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.ACTIVITIES.GET_HEATMAP(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch weekly heatmap'];
    }
  },

  async getEnrollmentStats(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.ACTIVITIES.GET_ENROLLMENTS(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch enrollment stats'];
    }
  },

  async getJoinRequests(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.CLUBS.GET_JOIN_REQUESTS(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch join requests'];
    }
  },

  async processJoinRequest(clubId: string, requestId: string, action: 'Aprobado' | 'Rechazado'): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ADMIN.CLUBS.PROCESS_JOIN_REQUEST(clubId, requestId), { action });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to process join request'];
    }
  },

  async exportMembers(clubId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.CLUBS.EXPORT_MEMBERS(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to export members'];
    }
  },
};
