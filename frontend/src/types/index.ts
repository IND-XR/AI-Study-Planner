// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  enrollmentNumber: string; // Student's unique enrollment ID
  course: string; // e.g., 'MCA', 'BTech', 'MTech'
  department: string; // e.g., 'Computer Science', 'Electronics'
  semester: number; // Current semester
  profilePicture?: string;
  isVerified: boolean;
  isActive: boolean;
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
  lastLogin?: string;
  supabaseId?: string;
  createdAt: string;
  updatedAt: string;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  academicYear: number;
  semester: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Topic Types
export interface Topic {
  id: string;
  name: string;
  proficiencyLevel: 'WEAK' | 'MEDIUM' | 'STRONG';
  confidenceLevel: 'VERY_WEAK' | 'WEAK' | 'NEUTRAL' | 'CONFIDENT' | 'VERY_CONFIDENT';
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

// Exam Types
export type ExamType = 'CA1' | 'CA2' | 'CA3' | 'MIDTERM' | 'ENDTERM' | 'QUIZ' | 'PROJECT' | 'PRACTICAL';

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  date: string;
  weightage: number;
  totalMarks: number;
  targetMarks?: number;
  subjectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Study Plan Types
export interface StudyPlanItem {
  id: string;
  taskName: string;
  topicName: string;
  duration: number; // in minutes
  scheduledDate: string;
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  isActive: boolean;
  distributionStrategy: number;
  items: StudyPlanItem[];
  createdAt: string;
  updatedAt: string;
}

// Progress Types
export interface ProgressRecord {
  id: string;
  date: string;
  studyHours: number;
  topicsCovered: number;
  tasksCompleted: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Response
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// TIMETABLE TYPES
// ============================================

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type TimeSlotStatus = 'LECTURE' | 'STUDY' | 'BREAK' | 'FREE';

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;
  status: TimeSlotStatus;
  subject?: string;
  topic?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  lecture?: Lecture;
}

export interface WeeklySchedule {
  id: string;
  userId: string;
  week: number; // Week number (1-52)
  year: number;
  days: {
    [key in DayOfWeek]: TimeSlot[];
  };
  isPremium: boolean; // Generated with AI optimization
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyTimetable {
  id: string;
  userId: string;
  month: number; // 1-12
  year: number;
  studySessions: StudySession[]; // Planned study sessions for the month
  examDates: ExamDate[];
  milestones: Milestone[];
  aiGenerated: boolean; // Is this AI-optimized?
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  notes?: string;
}

export interface ExamDate {
  examId: string;
  examName: string;
  date: string;
  type: ExamType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
}

// ============================================
// LECTURE TYPES
// ============================================

export interface Lecture {
  id: string;
  subject: string;
  instructorName: string;
  startTime: string; // HH:mm
  endTime: string;
  classroom?: string;
  day: DayOfWeek;
  course: string; // e.g., MCA, BTech
  semester: number;
  isRecurring: boolean; // Is it a recurring lecture?
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomStudySubject {
  id: string;
  userId: string;
  name: string; // e.g., 'DSA Coding', 'FIR'
  category?: string; // e.g., 'Programming', 'Theory'
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  targetHours?: number; // Target hours per week
  createdAt: string;
  updatedAt: string;
}
