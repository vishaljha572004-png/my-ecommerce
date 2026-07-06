import { apiClient } from '../api/client';

export const searchService = {
  searchProducts: async (query) => {
    if (!query) return { success: true, data: [] };
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};
