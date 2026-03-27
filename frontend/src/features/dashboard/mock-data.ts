import {
  AnalyticsPoint,
  AppNotification,
  DashboardOverview,
  DashboardSettings,
  Exam,
  Gamification,
  LeaderboardEntry,
  PlannerTask,
  StudySession,
  Subject,
  SubjectStrength,
  SubscriptionState,
  TimelineEvent,
  UserProfile,
} from '@/types/dashboard';

export const defaultUserProfile: UserProfile = {
  id: 'u-1',
  name: 'Student',
  email: 'student@example.com',
  degree: 'BTECH',
  semester: 4,
  role: 'STUDENT',
  enrollmentNumber: '99999999',
  course: 'BTech',
  department: 'Computer Science',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student-1',
  lastLogin: new Date().toISOString(),
};

export const defaultOverview: DashboardOverview = {
  studyHoursToday: 2.5,
  tasksCompletedToday: 3,
  upcomingExamCountdownDays: 9,
  weeklyProgress: 68,
  status: 'ON_TRACK',
};

export const defaultSubjects: Subject[] = [
  {
    id: 's-1',
    name: 'Database Management Systems',
    code: 'CSE-302',
    degree: 'BTECH',
    semester: 4,
    credits: 4,
    faculty: 'Dr. Sharma',
    difficulty: 'MEDIUM',
    color: '#FF8800',
    weakScore: 38,
    resources: [
      { id: 'r-1', type: 'NOTE', title: 'Normalization Notes', url: '#' },
      { id: 'r-2', type: 'PDF', title: 'Query Optimization PDF', url: '#' },
    ],
  },
  {
    id: 's-2',
    name: 'Operating Systems',
    code: 'CSE-304',
    degree: 'BTECH',
    semester: 4,
    credits: 3,
    faculty: 'Prof. Iyer',
    difficulty: 'HARD',
    color: '#F97316',
    weakScore: 62,
    resources: [{ id: 'r-3', type: 'LINK', title: 'Process Scheduling Guide', url: '#' }],
  },
];

export const defaultExams: Exam[] = [
  {
    id: 'e-1',
    subjectId: 's-1',
    subjectName: 'Database Management Systems',
    category: 'CA2',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    preparationProgress: 54,
    priority: 1,
  },
  {
    id: 'e-2',
    subjectId: 's-2',
    subjectName: 'Operating Systems',
    category: 'MIDTERM',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 17).toISOString(),
    preparationProgress: 37,
    priority: 2,
  },
];

export const defaultTasks: PlannerTask[] = [
  {
    id: 't-1',
    title: 'Revise DBMS Unit 3',
    dueAt: new Date().toISOString(),
    completed: false,
    priority: 'HIGH',
    category: 'REVISION',
  },
  {
    id: 't-2',
    title: 'Submit OS assignment',
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    completed: true,
    priority: 'MEDIUM',
    category: 'ASSIGNMENT',
  },
];

export const defaultSessions: StudySession[] = [
  {
    id: 'ss-1',
    title: 'Study DBMS - Transactions',
    subjectId: 's-1',
    subjectName: 'Database Management Systems',
    start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    aiSuggested: true,
  },
  {
    id: 'ss-2',
    title: 'OS Practice Questions',
    subjectId: 's-2',
    subjectName: 'Operating Systems',
    start: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
  },
];

export const defaultAnalytics: AnalyticsPoint[] = [
  { label: 'Mon', studyHours: 2, completedTasks: 3, productivityScore: 64 },
  { label: 'Tue', studyHours: 3, completedTasks: 4, productivityScore: 69 },
  { label: 'Wed', studyHours: 4, completedTasks: 5, productivityScore: 74 },
  { label: 'Thu', studyHours: 3, completedTasks: 3, productivityScore: 66 },
  { label: 'Fri', studyHours: 5, completedTasks: 6, productivityScore: 81 },
  { label: 'Sat', studyHours: 4, completedTasks: 5, productivityScore: 78 },
  { label: 'Sun', studyHours: 3, completedTasks: 4, productivityScore: 72 },
];

export const defaultStrength: SubjectStrength[] = [
  { subjectName: 'DBMS', weakPercent: 38, strongPercent: 62 },
  { subjectName: 'OS', weakPercent: 62, strongPercent: 38 },
  { subjectName: 'CN', weakPercent: 44, strongPercent: 56 },
];

export const defaultTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    title: 'AI suggested revision update',
    description: 'Revise DBMS today (low retention detected).',
    createdAt: new Date().toISOString(),
    type: 'ALERT',
  },
  {
    id: 'tl-2',
    title: 'Missed session recovered',
    description: 'OS session moved to 6:00 PM catch-up block.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'PLANNER',
  },
  {
    id: 'tl-3',
    title: 'Task completed',
    description: 'Submitted weekly DBMS assignment.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'TASK',
  },
];

export const defaultNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Urgent: CA2 in 9 days',
    message: 'Focus on DBMS Unit 3 and Unit 4 today.',
    priority: 'URGENT',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: 'University Announcement',
    message: 'Exam hall ticket portal opens tomorrow.',
    priority: 'MEDIUM',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export const defaultGamification: Gamification = {
  xp: 1250,
  streakDays: 12,
  level: 5,
  badges: ['Consistency Champion', 'Weekend Warrior'],
  consistencyScore: 84,
};

export const defaultLeaderboard: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Anmol', xp: 1250, level: 5, streakDays: 12 },
  { id: 'lb-2', name: 'Priya', xp: 1180, level: 5, streakDays: 10 },
  { id: 'lb-3', name: 'Rahul', xp: 1090, level: 4, streakDays: 9 },
  { id: 'lb-4', name: 'Neha', xp: 970, level: 4, streakDays: 8 },
];

export const defaultSubscription: SubscriptionState = {
  plan: 'FREE',
};

export const defaultSettings: DashboardSettings = {
  theme: 'dark',
  notificationsEnabled: true,
  emailNotificationsEnabled: true,
  dailyStudyHourGoal: 4,
  timezone: 'Asia/Kolkata',
};
