import { create } from 'zustand';
import { AuthUser, LoginCredentials } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

// Test credentials
const TEST_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Test user data
const TEST_USER: AuthUser = {
  id: '1',
  email: TEST_CREDENTIALS.email,
  name: 'Admin User',
  role: 'admin',
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (
      credentials.email === TEST_CREDENTIALS.email &&
      credentials.password === TEST_CREDENTIALS.password
    ) {
      // Store auth data in localStorage
      localStorage.setItem('auth_user', JSON.stringify(TEST_USER));
      localStorage.setItem('auth_token', 'test_token');

      set({ user: TEST_USER, isAuthenticated: true });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password',
    };
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
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
}));