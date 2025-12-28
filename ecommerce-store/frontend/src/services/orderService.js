import api from './api';

const orderService = {
  // Create order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancel: async (id, reason) => {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Admin: Get all orders
  adminGetAll: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Admin: Get order details
  adminGetById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Admin: Update order status
  updateStatus: async (id, status, adminNote) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status, adminNote });
    return response.data;
  }
};

export default orderService;
