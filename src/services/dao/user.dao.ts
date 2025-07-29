import apiClient from '@/services/api/client';
import { API_ENDPOINTS } from '@/constants/api';

type ApiResponse<T> = [T | null, string | null];

export const userDAO = {
  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to update profile'];
    }
  },

  async changePassword(passwords: { current_password: any; new_password: any; }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwords);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to change password'];
    }
  },

  async updateProfilePhoto(formData: FormData): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to update profile photo'];
    }
  },

  async getNotifications(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_NOTIFICATIONS);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch notifications'];
    }
  },

  async markNotificationsAsRead(ids: string[]): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_NOTIFICATIONS, { notification_ids: ids });
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to mark notifications as read'];
    }
  },

  async getMyActivities(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_MY_ACTIVITIES);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch my activities'];
    }
  },

  async getMyClubs(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_MY_CLUBS);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch my clubs'];
    }
  },

  async getUpcomingEvents(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_UPCOMING_EVENTS);
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to fetch upcoming events'];
    }
  },

  async joinActivity(activityId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.JOIN_ACTIVITY(activityId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to join activity'];
    }
  },

  async leaveActivity(activityId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.LEAVE_ACTIVITY(activityId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err.response?.data?.message || 'Failed to leave activity'];
    }
  },
};