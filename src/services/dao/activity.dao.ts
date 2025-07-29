import { BaseApiService } from '@/services/api/BaseApiService';
import api from '@/services/api/client';
import type { Activity } from '@/services/dao/models/activity.model';
import { API_ENDPOINTS } from '@/constants/api';
import type { AxiosError } from 'axios';

export class ActivityDAO extends BaseApiService<Activity> {
  constructor() {
    super('activities');
  }

  async getByClub(clubId: string): Promise<[Activity[], null] | [null, AxiosError]> {
    try {
      const response = await api.get(API_ENDPOINTS.CLUBS.GET_ACTIVITIES(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async adminGetByClub(clubId: string): Promise<[Activity[], null] | [null, AxiosError]> {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.CLUBS.GET_ACTIVITIES(clubId));
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async adminCreate(clubId: string, data: Omit<Activity, 'activityId'>): Promise<[Activity, null] | [null, AxiosError]> {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN.ACTIVITIES.CREATE(clubId), data);
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async adminCancel(activityId: string | number): Promise<[null, null] | [null, AxiosError]> {
    try {
      await api.delete(API_ENDPOINTS.ADMIN.ACTIVITIES.DELETE(activityId));
      return [null, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }

  async adminUpdate(activityId: string | number, data: Partial<Omit<Activity, 'activityId'>>): Promise<[Activity, null] | [null, AxiosError]> {
    try {
      const response = await api.put(API_ENDPOINTS.ADMIN.ACTIVITIES.UPDATE(activityId), data);
      return [response.data, null];
    } catch (err: any) {
      return [null, err as AxiosError];
    }
  }
}

export const activityDAO = new ActivityDAO();