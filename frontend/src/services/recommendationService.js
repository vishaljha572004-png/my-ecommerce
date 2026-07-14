import { apiClient as client } from "../api/client";

export const recommendationService = {
  getPersonalized: async () => {
    return await client.get('/recommendations/personalized');
  },
  
  getFrequentlyBoughtTogether: async (productId) => {
    return await client.get(`/recommendations/${productId}/frequently-bought`);
  },
  
  getSimilar: async (productId) => {
    return await client.get(`/recommendations/${productId}/similar`);
  },
  
  logInteraction: async (productId, type) => {
    
    return client.post('/recommendations/interaction', { productId, type }).catch(e => {
      
    });
  }
};
