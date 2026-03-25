import { create } from 'zustand';
import { apiClient } from '@/api/client';

type AuthState = {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  college: string | null;
  login: (enrollmentNumber: string, password: string, college: string) => Promise<any>;
  logout: () => void;
};

// Helper to set cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  college: null,

  login: async (enrollmentNumber, password, college) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login(enrollmentNumber, password);
      const token = response.data.data.accessToken;
      const userData = response.data.data.user;
      
      // Save to cookies for middleware access
      setCookie('authToken', token);
      setCookie('userRole', userData.role);
      setCookie('selectedCollege', college);
      
      // Also save to localStorage for client-side access
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCollege', college);
      }
      
      apiClient.setToken(token);
      set({ user: userData, token, college, isLoading: false });
      return userData;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeCookie('authToken');
    removeCookie('userRole');
    removeCookie('selectedCollege');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedCollege');
    }
    apiClient.clearToken();
    set({ user: null, token: null, college: null });
  },
}));
