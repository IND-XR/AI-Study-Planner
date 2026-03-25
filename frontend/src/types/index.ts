// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
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
