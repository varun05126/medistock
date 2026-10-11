import api from './api';

const safeStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
};

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      safeStorage.setItem('token', res.data.token);
      safeStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getCurrentUser: () => {
    const userStr = safeStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  fetchProfile: async () => {
    const res = await api.get('/auth/me');
    if (res.data) {
      const currentUser = authService.getCurrentUser() || {};
      const updated = { ...currentUser, ...res.data };
      safeStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  logout: () => {
    safeStorage.removeItem('token');
    safeStorage.removeItem('user');
  }
};
