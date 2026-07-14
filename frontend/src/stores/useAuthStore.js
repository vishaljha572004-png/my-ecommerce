import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
      logout: async () => {
        try {
          
          await authService.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);
