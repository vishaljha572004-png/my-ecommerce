import { apiClient } from '../api/client';

export const productService = {
  getAllProducts: async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getFeaturedProducts: async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (formData) => {
    const response = await apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateProduct: async (id, formData) => {
    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }
};
