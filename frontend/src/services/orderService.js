import { apiClient } from '../api/client';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },
  getUserOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
  cancelOrder: async (id) => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  }
};
