import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.fetchProfile();
          if (profile) {
            setUser(profile);
          }
        } catch (err) {
          console.warn('Session restoration failed or token expired', err);
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    const normalizedTarget = role.toUpperCase().replace('ROLE_', '');
    const userRole = (user.role || '').toUpperCase().replace('ROLE_', '');
    if (userRole === normalizedTarget) return true;
    if (Array.isArray(user.roles)) {
      return user.roles.some((r) => r.toUpperCase().replace('ROLE_', '') === normalizedTarget);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
