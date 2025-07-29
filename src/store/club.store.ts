import { defineStore } from 'pinia';
import { clubDAO } from '@/services/dao/club.dao';
import { adminDAO } from '@/services/dao/admin.dao';
import { activityDAO } from '@/services/dao/activity.dao';
import { useAuthStore } from './auth.store'; 
import type { AxiosError } from 'axios';

export const useClubStore = defineStore('club', {
  state: () => ({
    clubs: [] as any[],
    selectedClub: null as {
      details: any;
      members: any[];
      activities: any[];
      joinRequests: any[];
      stats: any;
    } | null,
    isLoadingList: false,
    isLoadingDetails: false,
    error: null as AxiosError | null,
  }),

  getters: {
    clubCount: (state) => state.clubs.length,
    isSelectedClubAdmin: (state) => {
      const authStore = useAuthStore();
      // Assuming selectedClub.details has an adminId property
      return state.selectedClub && authStore.user && state.selectedClub.details.adminId === authStore.user.userId;
    },
  },

  actions: {
    async fetchAllClubs() {
      this.isLoadingList = true;
      this.error = null;
      try {
        const [data, errorObj] = await clubDAO.getAll();
        if (data) {
          this.clubs = data;
        } else {
          this.error = errorObj as AxiosError;
        }
      } catch (err: any) {
        this.error = err as AxiosError;
      } finally {
        this.isLoadingList = false;
      }
    },

    async fetchClubDetails(clubId: string | number) {
      this.isLoadingDetails = true;
      this.error = null;
      this.selectedClub = null; // Clear previous selection

      try {
        const clubIdStr = String(clubId);
        const [clubDetails, clubDetailsError] = await clubDAO.getById(clubIdStr);
        const [membersList, membersListError] = await adminDAO.getMembersList(clubIdStr);
        const [activities, activitiesError] = await activityDAO.getByClub(clubIdStr);
        const [joinRequests, joinRequestsError] = await adminDAO.getJoinRequests(clubIdStr);
        const [memberStats, memberStatsError] = await adminDAO.getMemberStats(clubIdStr);

        if (clubDetails && membersList && activities && joinRequests && memberStats) {
          this.selectedClub = {
            details: clubDetails,
            members: membersList,
            activities: activities,
            joinRequests: joinRequests,
            stats: memberStats,
          };
        } else {
          const firstError = clubDetailsError || membersListError || activitiesError || joinRequestsError || memberStatsError;
          if (firstError) {
            this.error = firstError as AxiosError;
          } else {
            this.error = new Error('Failed to fetch complete club details') as AxiosError;
          }
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    async requestToJoinClub(clubId: string | number) {
      this.isLoadingDetails = true; // Or a more specific loading state
      this.error = null;
      try {
        const [data, errorObj] = await clubDAO.requestToJoin(String(clubId));
        if (data) {
          // Handle success, e.g., show a notification
          return data;
        } else {
          const normalizedError = errorObj as AxiosError;
          this.error = normalizedError;
          throw new Error(normalizedError?.message || 'Failed to request to join club');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoadingDetails = false;
      }
    },

    async create(clubData: any) {
      this.isLoadingList = true;
      this.error = null;
      try {
        const [data, errorObj] = await clubDAO.create(clubData);
        if (data) {
          this.clubs.push(data);
          return data;
        } else {
          this.error = errorObj as AxiosError;
          throw new Error(this.error?.message || 'Failed to create club');
        }
      } catch (err: any) {
        this.error = err as AxiosError;
        throw err;
      } finally {
        this.isLoadingList = false;
      }
    },
  },
});
