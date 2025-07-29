import api from '@/services/api/client';
import type { Club, ClubContact } from '@/services/dao/models/club.model';
import { API_ENDPOINTS } from '@/constants/api';
import type { AxiosError } from 'axios';

export const clubDAO = {
  async getAll(params?: { page?: number; size?: number; category?: string }): Promise<[Club[], null] | [null, AxiosError]> {
    try {
      const response = await api.get<Club[]>(API_ENDPOINTS.CLUBS.GET_ALL, { params });
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async getById(groupId: number | string): Promise<[Club, null] | [null, AxiosError]> {
    try {
      const response = await api.get<Club>(API_ENDPOINTS.CLUBS.GET_BY_ID(groupId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async create(data: {
    group_name: string;
    group_category: string;
    group_description: string;
    contact_info: ClubContact[];
  }): Promise<[{ groupId: number; message: string }, null] | [null, AxiosError]> {
    try {
      const response = await api.post(API_ENDPOINTS.CLUBS.CREATE, data);
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async updateSettings(clubId: string, settings: any): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.UPDATE_SETTINGS(clubId), settings);
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async requestToJoin(groupId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.post(API_ENDPOINTS.CLUBS.REQUEST_TO_JOIN(groupId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async updatePhoto(groupId: string, formData: FormData): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.CLUBS.UPDATE_PHOTO(groupId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async delete(clubId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.DELETE(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },

  async reactivate(clubId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.REACTIVATE(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  },
};