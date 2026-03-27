import { create } from 'zustand';
import { dashboardApi } from '@/features/dashboard/api';
import {
  AppNotification,
  DashboardOverview,
  DashboardSettings,
  Exam,
  LeaderboardEntry,
  PlannerTask,
  StudySession,
  Subject,
  SubscriptionState,
  TimelineEvent,
  UserProfile,
} from '@/types/dashboard';
import {
  defaultAnalytics,
  defaultGamification,
  defaultLeaderboard,
  defaultOverview,
  defaultSettings,
  defaultStrength,
} from '@/features/dashboard/mock-data';

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  profile: UserProfile | null;
  overview: DashboardOverview;
  subjects: Subject[];
  exams: Exam[];
  tasks: PlannerTask[];
  sessions: StudySession[];
  timeline: TimelineEvent[];
  notifications: AppNotification[];
  subscription: SubscriptionState;
  settings: DashboardSettings;
  analytics: typeof defaultAnalytics;
  strength: typeof defaultStrength;
  gamification: typeof defaultGamification;
  leaderboard: LeaderboardEntry[];

  initialize: () => Promise<void>;
  addSubject: (payload: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (subjectId: string, payload: Partial<Subject>) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  addTask: (payload: Omit<PlannerTask, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  rescheduleSession: (sessionId: string, start: string, end: string) => void;
  generateCatchUpPlan: () => void;
  markNotificationRead: (id: string) => void;
  setTheme: (theme: DashboardSettings['theme']) => void;
  saveSettings: (payload: Partial<DashboardSettings>) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  isLoading: false,
  error: null,
  profile: null,
  overview: defaultOverview,
  subjects: [],
  exams: [],
  tasks: [],
  sessions: [],
  timeline: [],
  notifications: [],
  subscription: { plan: 'FREE' },
  settings: defaultSettings,
  analytics: defaultAnalytics,
  strength: defaultStrength,
  gamification: defaultGamification,
  leaderboard: defaultLeaderboard,

  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      const [
        profile,
        overview,
        subjects,
        exams,
        tasks,
        sessions,
        timeline,
        notifications,
        subscription,
        settings,
      ] = await Promise.all([
        dashboardApi.getProfile(),
        dashboardApi.getOverview(),
        dashboardApi.getSubjects(),
        dashboardApi.getExams(),
        dashboardApi.getPlannerTasks(),
        dashboardApi.getStudySessions(),
        dashboardApi.getTimelineEvents(),
        dashboardApi.getNotifications(),
        dashboardApi.getSubscription(),
        dashboardApi.getSettings(),
      ]);

      set({
        profile,
        overview,
        subjects,
        exams,
        tasks,
        sessions,
        timeline,
        notifications,
        subscription,
        settings,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize dashboard',
      });
    }
  },

  addSubject: async (payload) => {
    const newSubject = await dashboardApi.createSubject(payload);
    set((state) => ({ subjects: [newSubject, ...state.subjects] }));
  },

  updateSubject: async (subjectId, payload) => {
    const updated = await dashboardApi.updateSubject(subjectId, payload);
    set((state) => ({
      subjects: state.subjects.map((subject) => (subject.id === subjectId ? updated : subject)),
    }));
  },

  deleteSubject: async (subjectId) => {
    await dashboardApi.deleteSubject(subjectId);
    set((state) => ({ subjects: state.subjects.filter((subject) => subject.id !== subjectId) }));
  },

  addTask: (payload) => {
    set((state) => ({
      tasks: [{ ...payload, id: `task-${Date.now()}` }, ...state.tasks],
    }));
  },

  toggleTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    }));
  },

  rescheduleSession: (sessionId, start, end) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, start, end, isMissed: false } : session,
      ),
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          title: 'Session rescheduled',
          description: 'Timetable updated through drag-and-drop.',
          createdAt: new Date().toISOString(),
          type: 'PLANNER',
        },
        ...state.timeline,
      ],
    }));
  },

  generateCatchUpPlan: () => {
    const missedSessions = get().sessions.filter((session) => session.isMissed);
    if (!missedSessions.length) {
      return;
    }

    const catchUpSessions = missedSessions.map((session, index) => {
      const start = new Date();
      start.setDate(start.getDate() + 1 + index);
      start.setHours(18, 0, 0, 0);
      const end = new Date(start);
      end.setHours(19, 0, 0, 0);

      return {
        ...session,
        start: start.toISOString(),
        end: end.toISOString(),
        isMissed: false,
        aiSuggested: true,
      };
    });

    set((state) => ({
      sessions: state.sessions.map((session) => {
        const replacement = catchUpSessions.find((item) => item.id === session.id);
        return replacement ?? session;
      }),
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          title: 'Catch-up planner generated',
          description: 'Missed sessions were auto-rescheduled after college hours.',
          createdAt: new Date().toISOString(),
          type: 'ALERT',
        },
        ...state.timeline,
      ],
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    }));
  },

  setTheme: (theme) => {
    set((state) => ({ settings: { ...state.settings, theme } }));
  },

  saveSettings: async (payload) => {
    const next = await dashboardApi.updateSettings(payload);
    set((state) => ({ settings: { ...state.settings, ...next } }));
  },
}));
