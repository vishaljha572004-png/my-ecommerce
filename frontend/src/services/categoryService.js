import { apiClient } from '../api/client';

export const categoryService = {
  getAllCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (formData) => {
    const response = await apiClient.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateCategory: async (id, formData) => {
    const response = await apiClient.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }
};
