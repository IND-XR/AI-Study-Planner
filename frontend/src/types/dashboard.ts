export type DegreeProgram = 'BTECH' | 'BCA' | 'BBA' | 'MCA' | 'MBA' | 'OTHER';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type ExamCategory = 'CA1' | 'CA2' | 'CA3' | 'MIDTERM' | 'ENDTERM';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  degree: DegreeProgram;
  semester: number;
  role: 'STUDENT' | 'ADMIN';
  enrollmentNumber?: string;
  course?: string;
  department?: string;
  profilePicture?: string;
  lastLogin?: string;
}

export interface SubjectResource {
  id: string;
  type: 'NOTE' | 'LINK' | 'PDF';
  title: string;
  url: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  degree: DegreeProgram;
  semester: number;
  credits: number;
  faculty: string;
  difficulty: DifficultyLevel;
  color: string;
  weakScore: number;
  resources: SubjectResource[];
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  category: ExamCategory;
  date: string;
  preparationProgress: number;
  priority: number;
}

export interface StudySession {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  start: string;
  end: string;
  isMissed?: boolean;
  aiSuggested?: boolean;
}

export interface PlannerTask {
  id: string;
  title: string;
  dueAt: string;
  completed: boolean;
  priority: NotificationPriority;
  category: 'REVISION' | 'ASSIGNMENT' | 'LECTURE' | 'PRACTICE';
}

export interface DashboardOverview {
  studyHoursToday: number;
  tasksCompletedToday: number;
  upcomingExamCountdownDays: number;
  weeklyProgress: number;
  status: 'BEHIND' | 'ON_TRACK';
}

export interface AnalyticsPoint {
  label: string;
  studyHours: number;
  completedTasks: number;
  productivityScore: number;
}

export interface SubjectStrength {
  subjectName: string;
  weakPercent: number;
  strongPercent: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: 'SUBJECT' | 'EXAM' | 'PLANNER' | 'TASK' | 'ALERT';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
}

export interface Gamification {
  xp: number;
  streakDays: number;
  level: number;
  badges: string[];
  consistencyScore?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  streakDays: number;
}

export interface SubscriptionState {
  plan: 'FREE' | 'PRO';
  stripeCustomerId?: string;
  renewalDate?: string;
}

export interface DashboardSettings {
  theme: ThemeMode;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  dailyStudyHourGoal: number;
  timezone: string;
}
