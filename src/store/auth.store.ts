import { defineStore } from 'pinia';
import { authDAO } from '@/services/dao/auth.dao';
import type { UserProfile } from '@/services/dao/models/auth.model';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let storedToken = localStorage.getItem('authToken');
    // Ensure the stored token is actually a string and not "[object Object]"
    if (storedToken === '[object Object]') {
      console.warn('Invalid token found in localStorage, clearing it.');
      localStorage.removeItem('authToken');
      storedToken = null;
    }

    return {
      user: null as UserProfile | null,
      token: storedToken,
      isAuthenticated: !!storedToken,
      isLoading: false,
      error: null as string | null,
    };
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials: any) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.login(credentials);
        if (data) {
          this.user = data.user;
          this.token = data.token;
          this.isAuthenticated = true;
          localStorage.setItem('authToken', data.token);
        } else {
          this.error = error;
          this.logout(); 
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during login';
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.error = null;
      localStorage.removeItem('authToken');
    },

    async fetchUserProfile() {
      if (!this.token) {
        this.logout();
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.getProfile();
        if (data) {
          this.user = data;
          this.isAuthenticated = true;
        } else {
          this.error = error;
          this.logout(); // Logout if token is invalid or expired
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred while fetching profile';
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },

    async register(userData: any) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.register(userData);
        if (data) {
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Registration failed');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during registration';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async requestPasswordReset(email: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.requestPasswordReset(email);
        if (data) {
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Password reset request failed');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during password reset request';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async verifyResetCode(code: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.verifyResetCode({ verificationCode: code });
        if (data) {
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Code verification failed');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during code verification';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async submitNewPassword(password: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.submitNewPassword({ newPassword: password });
        if (data) {
          return data;
        } else {
          this.error = error;
          throw new Error(error || 'Password submission failed');
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during password submission';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async refreshToken() {
      this.isLoading = true;
      this.error = null;
      try {
        const [data, error] = await authDAO.refreshToken();
        if (data && data.token) {
          this.token = data.token;
          localStorage.setItem('authToken', data.token);
          return [data, null];
        } else {
          this.error = error;
          this.logout(); // Logout if refresh token fails
          return [null, error || 'Token refresh failed'];
        }
      } catch (err: any) {
        this.error = err.message || 'An unexpected error occurred during token refresh';
        this.logout();
        return [null, err];
      } finally {
        this.isLoading = false;
      }
    },
  },
});