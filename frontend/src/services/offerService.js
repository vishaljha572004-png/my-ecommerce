import client from '../api/client';

export const offerService = {
  getMyOffers: async () => {
    return await client.get('/offers/my-offers');
  },
  
  validateOffer: async (offerId, cartSubtotal, cartItems) => {
    return await client.post('/offers/validate', { offerId, cartSubtotal, cartItems });
  }
};
