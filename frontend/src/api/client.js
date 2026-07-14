import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, updateAccessToken, clearAuth } = useAuthStore.getState();

        if (!refreshToken) {
          clearAuth();
          return Promise.reject(error);
        }

        
        const res = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        
        
        updateAccessToken(newAccessToken);

        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        
        useAuthStore.getState().clearAuth();
        
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
