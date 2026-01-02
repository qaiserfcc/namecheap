import api from './api';

const categoryService = {
  // Get all categories
  getAll: async (withProductCount = false) => {
    const response = await api.get('/categories', {
      params: { withProductCount }
    });
    return response.data;
  },

  // Get category by ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get products by category
  getProducts: async (id, params = {}) => {
    const response = await api.get(`/categories/${id}/products`, { params });
    return response.data;
  },

  // Create category (admin)
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (admin)
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;
