import { defineStore } from 'pinia';
import { adminDAO } from '@/services/dao/admin.dao';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    memberStats: null as any | null,
    membersList: [] as any[],
    weeklyHeatmap: null as any | null,
    enrollmentStats: null as any | null,
    joinRequests: [] as any[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchMemberStats(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.getMemberStats(clubId);
        if (data) {
          this.memberStats = data;
        } else {
          this.error = error;
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching member stats';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMembersList(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.getMembersList(clubId);
        if (data) {
          this.membersList = data;
        } else {
          this.error = error;
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching members list';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchWeeklyHeatmap(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.getWeeklyHeatmap(clubId);
        if (data) {
          this.weeklyHeatmap = data;
        } else {
          this.error = error;
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching weekly heatmap';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEnrollmentStats(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.getEnrollmentStats(clubId);
        if (data) {
          this.enrollmentStats = data;
        } else {
          this.error = error;
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching enrollment stats';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchJoinRequests(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.getJoinRequests(clubId);
        if (data) {
          this.joinRequests = data;
        } else {
          this.error = error;
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching join requests';
      } finally {
        this.isLoading = false;
      }
    },

    async processJoinRequest(clubId: string, requestId: string, action: 'Aprobado' | 'Rechazado') {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.processJoinRequest(clubId, requestId, action);
        if (data) {
          // Update local state to reflect changes
          this.joinRequests = this.joinRequests.filter(req => req.id !== requestId);
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Failed to process join request');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while processing join request';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async exportMembers(clubId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await adminDAO.exportMembers(clubId);
        if (data) {
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Failed to export members');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while exporting members';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
