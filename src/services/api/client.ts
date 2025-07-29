import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'vue-router';

// Create a separate instance for refresh requests to avoid interceptors
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue for failed requests
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];
let isRefreshing = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      isRefreshing = true;
      
      try {
        const authStore = useAuthStore();
        const [data, refreshError] = await authStore.refreshToken();
        
        if (data && data.token) {
          // Successfully refreshed token
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          processQueue(null, data.token);
          return apiClient(originalRequest);
        } else {
          // Failed to refresh token
          processQueue(refreshError, null);
          authStore.logout();
          // Optionally redirect to login
          // const router = useRouter();
          // router.push('/auth/login');
          return Promise.reject(refreshError || new Error('Token refresh failed'));
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        const authStore = useAuthStore();
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;