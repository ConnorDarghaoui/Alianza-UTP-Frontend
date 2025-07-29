import { defineStore } from 'pinia';
import { userDAO } from '@/services/dao/user.dao';
import { useAuthStore } from './auth.store'; 

export const useUserStore = defineStore('user', {
  state: () => ({
    notifications: [] as any[],
    activities: [] as any[], // Activities user is enrolled in
    clubs: [] as any[], // Clubs user belongs to
    upcomingEvents: [] as any[],
    isLoading: false,
    error: null as string | null,
    modals: {
      viewProfile: false,
      editProfile: false,
      security: false,
      createActivity: false,
      joinClub: false,
      profilePictureUpload: false
    },
    showNotificationPanel: false,
    showProfileDropdown: false,
    toast: {
      show: false,
      message: "",
      type: "success" as 'success' | 'error' | 'warning'
    }
  }),

  getters: {
    unreadNotificationsCount: (state) => state.notifications.filter(n => !n.is_read).length,
    hasNotifications: (state) => state.notifications.length > 0,
    isAnyModalOpen: (state) => Object.values(state.modals).some(modal => modal)
  },

  actions: {
    async fetchMyData() {
      this.isLoading = true;
      this.error = null;
      try {
        const [notificationsData, notificationsError] = await userDAO.getNotifications();
        const [activitiesData, activitiesError] = await userDAO.getMyActivities();
        const [clubsData, clubsError] = await userDAO.getMyClubs();
        const [upcomingEventsData, upcomingEventsError] = await userDAO.getUpcomingEvents();

        if (notificationsData) {
          this.notifications = notificationsData;
        } else {
          this.error = notificationsError;
        }

        if (activitiesData) {
          this.activities = activitiesData;
        } else {
          this.error = activitiesError;
        }

        if (clubsData) {
          this.clubs = clubsData;
        } else {
          this.error = clubsError;
        }

        if (upcomingEventsData) {
          this.upcomingEvents = upcomingEventsData;
        } else {
          this.error = upcomingEventsError;
        }

        // Consolidate errors if any
        if (notificationsError || activitiesError || clubsError || upcomingEventsError) {
          this.error = this.error || 'Failed to fetch all user data';
        }

      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching user data';
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(profileData: any) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await userDAO.updateProfile(profileData);
        if (data) {
          // Update user in auth.store for consistency
          const authStore = useAuthStore();
          if (authStore.user) {
            authStore.user = { ...authStore.user, ...data }; 
          }
          return data; // Return updated data for component to use
        } else {
          this.error = error;
          throw new Error(error || 'Failed to update profile');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while updating profile';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async markNotificationsAsRead(ids: string[]) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await userDAO.markNotificationsAsRead(ids);
        if (data) {
          // Update local state to reflect changes immediately
          this.notifications = this.notifications.map(n => 
            ids.includes(n.id) ? { ...n, is_read: true } : n
          );
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Failed to mark notifications as read');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while marking notifications as read';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async joinActivity(activityId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await userDAO.joinActivity(activityId);
        if (data) {
          // Optionally, add the activity to the local activities list if needed
          // await this.fetchMyActivities(); // Re-fetch activities to ensure consistency
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Failed to join activity');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while joining activity';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    
    showToast(message: string, type: 'success' | 'error' | 'warning') {
      // This is a placeholder for toast functionality
      console.log(`Toast: ${type} - ${message}`);
      this.toast = { show: true, message, type };
    },
    
    closeAllModals() {
      // This is a placeholder for modal functionality
      console.log('Closing all modals');
      for (const modal in this.modals) {
        (this.modals as any)[modal] = false;
      }
    },
    
    openModal(modalName: keyof typeof this.modals) {
      this.closeAllModals();
      this.modals[modalName] = true;
    },
    
    toggleNotificationPanel() {
      this.showNotificationPanel = !this.showNotificationPanel;
    },
    
    closeNotificationPanel() {
      this.showNotificationPanel = false;
    },
    
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    
    closeProfileDropdown() {
      this.showProfileDropdown = false;
    }

  },
});
