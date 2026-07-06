import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
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

// Response Interceptor: Handle 401 and Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, updateAccessToken, clearAuth } = useAuthStore.getState();

        if (!refreshToken) {
          clearAuth();
          return Promise.reject(error);
        }

        // Use base axios to avoid interceptor loop
        const res = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        
        // Update store with new access token
        updateAccessToken(newAccessToken);

        // Update header and retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails (e.g. token expired), logout the user
        useAuthStore.getState().clearAuth();
        // We could also trigger a redirect to login here using a global event or router navigation
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
