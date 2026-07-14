import { apiClient as client } from "../api/client";

export const shoppingListService = {
  getLists: async () => {
    return await client.get('/shopping-list');
  },
  
  createList: async (name) => {
    return await client.post('/shopping-list', { name });
  },

  deleteList: async (id) => {
    return await client.delete(`/shopping-list/${id}`);
  },

  renameList: async (id, name) => {
    return await client.put(`/shopping-list/${id}`, { name });
  },

  addItem: async (listId, productId, quantity = 1) => {
    return await client.post(`/shopping-list/${listId}/items`, { productId, quantity });
  },

  removeItem: async (listId, productId) => {
    return await client.delete(`/shopping-list/${listId}/items/${productId}`);
  },

  updateItemQuantity: async (listId, productId, quantity) => {
    return await client.put(`/shopping-list/${listId}/items/${productId}`, { quantity });
  },

  getSmartSuggestions: async () => {
    return await client.get('/shopping-list/suggestions');
  }
};
