import { apiClient } from '../api/client';

export const paymentService = {
  initiatePayment: async (paymentData) => {
    const response = await apiClient.post('/payments/initiate', paymentData);
    return response.data;
  },
  verifyPayment: async (verificationData) => {
    const response = await apiClient.post('/payments/verify', verificationData);
    return response.data;
  }
};
