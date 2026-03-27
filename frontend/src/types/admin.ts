export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';

export interface AdminMetric {
  label: string;
  value: number;
  delta: string;
}

export interface Degree {
  id: string;
  name: string;
  durationYears: number;
  totalSemesters: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  degreeId: string;
  semester: number;
}

export type ExamType = 'CA1' | 'CA2' | 'CA3' | 'MID_TERM' | 'END_TERM';

export interface Exam {
  id: string;
  name: string;
  examType: ExamType;
  examDate: string;
  subjectId: string;
  semester: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  degreeId: string;
  semester: number;
  status: 'ACTIVE' | 'INACTIVE';
  subjectIds: string[];
}

export interface StudyPlanControl {
  id: string;
  studentId: string;
  generatedAt: string;
  weakSubjects: string[];
  status: 'GENERATED' | 'REGENERATED';
}

export interface Activity {
  id: string;
  text: string;
  createdAt: string;
}

export interface GrowthPoint {
  label: string;
  users: number;
  plans: number;
  engagement: number;
  studyHours: number;
}

export interface SubscriptionOverview {
  freeUsers: number;
  proUsers: number;
  monthlyRevenue: number;
}

export interface AdminSettings {
  defaultStudyHours: number;
  examPattern: '3_CA_SYSTEM';
  notificationsEnabled: boolean;
}
