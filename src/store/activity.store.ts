import { defineStore } from 'pinia';
import { activityDAO } from '@/services/dao/activity.dao';
import type { Activity } from '@/services/dao/models/activity.model';
import type { AxiosError } from 'axios';


export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Activity[],
    selectedActivity: null as Activity | null,
    isLoading: false,
    error: null as AxiosError | null,
  }),

  actions: {
    async fetchAllActivities(): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.getAll();
        if (data) {
          this.activities = data;
        } else {
          this.error = errorObj;
        }
      } catch (err: any) {
        this.error = err as AxiosError;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchActivityById(id: string | number): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.getById(id);
        if (data) {
          this.selectedActivity = data;
        } else {
          this.error = errorObj;
        }
      } catch (err: any) {
        this.error = err as AxiosError;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchActivitiesByClub(clubId: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.getByClub(clubId);
        if (data) {
          this.activities = data;
        } else {
          this.error = errorObj;
        }
      } catch (err: any) {
        this.error = err as AxiosError;
      } finally {
        this.isLoading = false;
      }
    },

    async adminFetchActivitiesByClub(clubId: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.adminGetByClub(clubId);
        if (data) {
          this.activities = data;
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to fetch activities by club (admin)');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async createActivity(activityData: Omit<Activity, 'activityId'>): Promise<Activity | undefined> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.create(activityData);
        if (data) {
          this.activities.push(data); // Add new activity to the list
          return data;
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to create activity');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async adminCreateActivity(clubId: string, activityData: Omit<Activity, 'activityId'>): Promise<Activity | undefined> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.adminCreate(clubId, activityData);
        if (data) {
          this.activities.push(data); // Add new activity to the list
          return data;
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to create activity (admin)');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateActivity(id: string | number, activityData: Partial<Omit<Activity, 'activityId'>>): Promise<Activity | undefined> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.update(id, activityData);
        if (data) {
          // Update the activity in the list
          const index = this.activities.findIndex(a => a.activityId === id);
          if (index !== -1) {
            this.activities[index] = data;
          }
          if (this.selectedActivity && this.selectedActivity.activityId === id) {
            this.selectedActivity = data;
          }
          return data;
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to update activity');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async adminUpdateActivity(id: string | number, activityData: Partial<Omit<Activity, 'activityId'>>): Promise<Activity | undefined> {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, errorObj] = await activityDAO.adminUpdate(id, activityData);
        if (data) {
          // Update the activity in the list
          const index = this.activities.findIndex(a => a.activityId === id);
          if (index !== -1) {
            this.activities[index] = data;
          }
          if (this.selectedActivity && this.selectedActivity.activityId === id) {
            this.selectedActivity = data;
          }
          return data;
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to update activity (admin)');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteActivity(id: string | number): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [, errorObj] = await activityDAO.delete(id);
        if (!errorObj) {
          this.activities = this.activities.filter(a => a.activityId !== id);
          if (this.selectedActivity && this.selectedActivity.activityId === id) {
            this.selectedActivity = null;
          }
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to delete activity');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async adminCancelActivity(id: string | number): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const [, errorObj] = await activityDAO.adminCancel(id);
        if (!errorObj) {
          this.activities = this.activities.filter(a => a.activityId !== id);
          if (this.selectedActivity && this.selectedActivity.activityId === id) {
            this.selectedActivity = null;
          }
        } else {
          this.error = errorObj;
          throw new Error(errorObj?.message || 'Failed to cancel activity (admin)');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});