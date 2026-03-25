import { create } from 'zustand';
import { apiClient } from '@/api/client';

type AuthState = {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  college: string | null;

  login: (
    enrollmentNumber: string,
    password: string,
    college: string
  ) => Promise<any>;

  logout: () => void;

  loadUser: () => void; // ✅ IMPORTANT
};

// 🔹 Cookie helpers
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// 🔥 STORE
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  college: null,

  // ✅ LOGIN
  login: async (enrollmentNumber, password, college) => {
    set({ isLoading: true });

    try {
      const response = await apiClient.login(enrollmentNumber, password);

      const token = response.data.data.accessToken;
      const userData = response.data.data.user;

      // ✅ SAVE IN COOKIES (for middleware)
      setCookie('authToken', token);
      setCookie('userRole', userData.role);
      setCookie('selectedCollege', college);

      // ✅ SAVE IN LOCALSTORAGE (for reload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('selectedCollege', college);
      }

      // ✅ SET TOKEN IN API CLIENT
      apiClient.setToken(token);

      // ✅ UPDATE STATE
      set({
        user: userData,
        token,
        college,
        isLoading: false,
      });

      return userData;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // ✅ LOAD USER AFTER RELOAD (🔥 MOST IMPORTANT)
  loadUser: () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    const college = localStorage.getItem('selectedCollege');

    if (token && user) {
      apiClient.setToken(token);

      set({
        token,
        user: JSON.parse(user),
        college,
      });
    }
  },

  // ✅ LOGOUT
  logout: () => {
    // remove cookies
    removeCookie('authToken');
    removeCookie('userRole');
    removeCookie('selectedCollege');

    localStorage.clear();

    // clear API token
    apiClient.clearTokens();

    // remove localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedCollege');
    }


    // reset state
    set({
      user: null,
      token: null,
      college: null,
    });
  },
}));

