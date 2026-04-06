
import axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ✅ FIX: match with your login code
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Create axios instance
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR
client.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (SMART REFRESH)
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          // ✅ SAFE EXTRACTION (IMPORTANT)
          const newToken =
            response.data?.accessToken ||
            response.data?.access_token ||
            response.data?.data?.accessToken;

          if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken);

            // originalRequest.headers.Authorization = `Bearer ${newToken}`;
            originalRequest.headers = { 
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            }
            return client(originalRequest);
          }
        }
       catch (refreshError) {
        console.error('Refresh failed:', refreshError);
      }

      // ❌ logout fallback
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// ✅ API METHODS
export const apiClient = {
  // Auth
  login: async (enrollmentNumber: string, password: string) => {
  const res = await client.post('/auth/login', {
    enrollmentNumber,
    password,
  });

  const token =
    res.data?.data?.accessToken ||
    res.data?.accessToken;

  const refreshToken =
    res.data?.data?.refreshToken;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  return res;
},



  getProfile: () => client.get('/auth/profile'),

  refresh: (refreshToken: string) =>
    client.post('/auth/refresh', { refreshToken }),

  isAuthenticated: () => {
  return !!
  localStorage.getItem(TOKEN_KEY);
},

  // Users
  updateProfile: (data: any) =>
    client.patch('/users/me', data),

  // Subjects
  getSubjects: () => client.get('/subjects'),
  createSubject: (data: any) => client.post('/subjects', data),
  updateSubject: (id: string, data: any) =>
    client.patch(`/subjects/${id}`, data),
  deleteSubject: (id: string) =>
    client.delete(`/subjects/${id}`),

  // Exams
  getExams: () => client.get('/exams'),
  getExamById: (id: string) => client.get(`/exams/${id}`),
  createExam: (data: any) => client.post('/exams', data),
  updateExam: (id: string, data: any) =>
    client.patch(`/exams/${id}`, data),
  deleteExam: (id: string) =>
    client.delete(`/exams/${id}`),
  getUpcomingExams: () =>
    client.get('/exams/upcoming'),

  // Topics
  getTopics: (subjectId?: string) =>
    client.get('/topics', { params: { subjectId } }),
  createTopic: (data: any) =>
    client.post('/topics', data),
  updateTopic: (id: string, data: any) =>
    client.patch(`/topics/${id}`, data),
  deleteTopic: (id: string) =>
    client.delete(`/topics/${id}`),

  // Study Plans
  generateStudyPlan: (data: any) =>
    client.post('/study-plans/generate', data),
  getStudyPlans: () =>
    client.get('/study-plans'),
  getActiveStudyPlan: () =>
    client.get('/study-plans/active'),
  getStudyPlanById: (id: string) =>
    client.get(`/study-plans/${id}`),

  // Progress
  getDailyStats: () =>
    client.get('/progress/daily-stats'),
  getStreaks: () =>
    client.get('/progress/streaks'),
  logProgress: (data: any) =>
    client.post('/progress', data),
  getProgressHistory: (topicId?: string) =>
    client.get('/progress', { params: { topicId } }),

  // Calendar Headings
  getCalendarHeadings: (month: number, year: number) =>
    client.get('/api/timetable/headings', { params: { month, year } }),
  createCalendarHeading: (data: { date: string; title: string; tag: 'STUDY' | 'CODING' | 'EXAM' | 'OTHER' }) =>
    client.post('/api/timetable/headings', data),
  reorderCalendarHeadings: (data: { date: string; headingIds: string[] }) =>
    client.patch('/api/timetable/headings/reorder', data),
  deleteCalendarHeading: (id: string) =>
    client.delete(`/api/timetable/headings/${id}`),

  // ✅ TOKEN HELPERS
  setToken: (token: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  getToken: () =>
    typeof window !== 'undefined'
      ? localStorage.getItem(TOKEN_KEY)
      : null,

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // ✅ SINGLE CLEAN LOGOUT
  logout: () => {
    localStorage.removeItem('user');  
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },
};

export default client;

