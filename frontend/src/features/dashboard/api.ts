import { apiClient } from '@/api/client';
import {
  AppNotification,
  DashboardOverview,
  DashboardSettings,
  Exam,
  PlannerTask,
  StudySession,
  Subject,
  SubscriptionState,
  TimelineEvent,
  UserProfile,
} from '@/types/dashboard';
import {
  defaultExams,
  defaultNotifications,
  defaultOverview,
  defaultSessions,
  defaultSettings,
  defaultSubjects,
  defaultSubscription,
  defaultTasks,
  defaultTimeline,
  defaultUserProfile,
} from './mock-data';

const fallback = <T>(value: T): Promise<T> => Promise.resolve(value);

export const dashboardApi = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.getProfile();
      const profile = response?.data?.data ?? response?.data;
      if (!profile) return defaultUserProfile;

      return {
        id: profile.id ?? defaultUserProfile.id,
        name: profile.name ?? defaultUserProfile.name,
        email: profile.email ?? defaultUserProfile.email,
        degree: profile.degree ?? defaultUserProfile.degree,
        semester: Number(profile.semester ?? defaultUserProfile.semester),
        role: profile.role ?? 'STUDENT',
      };
    } catch {
      return fallback(defaultUserProfile);
    }
  },

  async getOverview(): Promise<DashboardOverview> {
    try {
      const [daily, exams, plans] = await Promise.all([
        apiClient.getDailyStats(),
        apiClient.getUpcomingExams(),
        apiClient.getActiveStudyPlan(),
      ]);

      const stats = daily?.data?.data ?? daily?.data ?? {};
      const upcoming = exams?.data?.data ?? exams?.data ?? [];
      const active = plans?.data?.data ?? plans?.data ?? null;

      const upcomingDate = upcoming[0]?.date ? new Date(upcoming[0].date) : null;
      const countdownDays = upcomingDate
        ? Math.max(0, Math.ceil((upcomingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : defaultOverview.upcomingExamCountdownDays;

      const weeklyProgress = Number(stats.weeklyProgress ?? defaultOverview.weeklyProgress);

      return {
        studyHoursToday: Number(stats.studyHoursToday ?? defaultOverview.studyHoursToday),
        tasksCompletedToday: Number(stats.tasksCompletedToday ?? defaultOverview.tasksCompletedToday),
        upcomingExamCountdownDays: countdownDays,
        weeklyProgress,
        status: weeklyProgress < 60 ? 'BEHIND' : 'ON_TRACK',
      };
    } catch {
      return fallback(defaultOverview);
    }
  },

  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await apiClient.getSubjects();
      const subjects = response?.data?.data ?? response?.data;
      if (!Array.isArray(subjects)) return defaultSubjects;
      return subjects;
    } catch {
      return fallback(defaultSubjects);
    }
  },

  async createSubject(payload: Omit<Subject, 'id'>): Promise<Subject> {
    try {
      const response = await apiClient.createSubject(payload);
      return (response?.data?.data ?? response?.data) as Subject;
    } catch {
      return { ...payload, id: `local-${Date.now()}` };
    }
  },

  async updateSubject(subjectId: string, payload: Partial<Subject>): Promise<Subject> {
    try {
      const response = await apiClient.updateSubject(subjectId, payload);
      return (response?.data?.data ?? response?.data) as Subject;
    } catch {
      const original = defaultSubjects.find((item) => item.id === subjectId);
      return { ...(original ?? defaultSubjects[0]), ...payload, id: subjectId };
    }
  },

  async deleteSubject(subjectId: string): Promise<void> {
    try {
      await apiClient.deleteSubject(subjectId);
    } catch {
      return;
    }
  },

  async getExams(): Promise<Exam[]> {
    try {
      const response = await apiClient.getExams();
      const exams = response?.data?.data ?? response?.data;
      return Array.isArray(exams) ? exams : defaultExams;
    } catch {
      return fallback(defaultExams);
    }
  },

  async getPlannerTasks(): Promise<PlannerTask[]> {
    return fallback(defaultTasks);
  },

  async getStudySessions(): Promise<StudySession[]> {
    return fallback(defaultSessions);
  },

  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return fallback(defaultTimeline);
  },

  async getNotifications(): Promise<AppNotification[]> {
    return fallback(defaultNotifications);
  },

  async getSubscription(): Promise<SubscriptionState> {
    return fallback(defaultSubscription);
  },

  async getSettings(): Promise<DashboardSettings> {
    return fallback(defaultSettings);
  },

  async updateSettings(payload: Partial<DashboardSettings>): Promise<DashboardSettings> {
    return fallback({ ...defaultSettings, ...payload });
  },
};
