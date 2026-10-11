import api from './api';

export const medicineService = {
  getAll: (params) => api.get('/medicines', { params }),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

export const stockService = {
  getLowStock: () => api.get('/stock/low'),
  getOutOfStock: () => api.get('/stock/out-of-stock'),
  getLogs: () => api.get('/stock/logs'),
};

export const expiryService = {
  getNearExpiry: (days = 30) => api.get(`/expiry/near-expiry?days=${days}`),
  getExpired: () => api.get('/expiry/expired'),
};

export const analyticsService = {
  getDashboardData: () => api.get('/analytics/dashboard'),
};
