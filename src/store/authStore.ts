import { create } from 'zustand';
import { AuthUser, LoginCredentials } from '../types/auth';
import api from '../config/api';

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid email or password',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      set({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = response.data;

      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error: any) {
      throw error;
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      await api.put('/users/password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      throw error;
    }
  },
}));