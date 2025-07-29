import { BaseApiService } from '@/services/api/BaseApiService';
import api from '@/services/api/client';
import type { Club } from '@/services/dao/models/club.model';
import { API_ENDPOINTS } from '@/constants/api';
import type { AxiosError } from 'axios';

export class ClubDAO extends BaseApiService<Club> {
  constructor() {
    super('groups');
  }

  async updateSettings(clubId: string, settings: any): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.UPDATE_SETTINGS(clubId), settings);
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async requestToJoin(clubId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.post(API_ENDPOINTS.CLUBS.REQUEST_TO_JOIN(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async updatePhoto(clubId: string, formData: FormData): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.CLUBS.UPDATE_PHOTO(clubId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async deactivate(clubId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.DELETE(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async reactivate(clubId: string): Promise<[any, AxiosError | null]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.CLUBS.REACTIVATE(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }
}

export const clubDAO = new ClubDAO();