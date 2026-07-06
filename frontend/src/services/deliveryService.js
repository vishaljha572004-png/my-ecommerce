import { apiClient } from '../api/client';

export const deliveryService = {
  getAvailableSlots: async () => {
    const response = await apiClient.get('/delivery/slots');
    return response.data;
  }
};
