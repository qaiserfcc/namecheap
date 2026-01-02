import api from './api';

const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Get cart count
  getCount: async () => {
    const response = await api.get('/cart/count');
    return response.data;
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/update/${cartItemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeItem: async (cartItemId) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

export default cartService;
