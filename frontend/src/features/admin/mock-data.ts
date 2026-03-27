import {
  Activity,
  AdminMetric,
  AdminSettings,
  Degree,
  Exam,
  GrowthPoint,
  Student,
  StudyPlanControl,
  Subject,
  SubscriptionOverview,
} from '@/types/admin';

export const adminMetrics: AdminMetric[] = [
  { label: 'Total Students', value: 1284, delta: '+8.6%' },
  { label: 'Active Users', value: 1032, delta: '+4.2%' },
  { label: 'Upcoming Exams', value: 18, delta: 'Next 14 days' },
  { label: 'Plans Generated', value: 4876, delta: '+12.1%' },
];

export const growthData: GrowthPoint[] = [
  { label: 'Mon', users: 140, plans: 250, engagement: 74, studyHours: 380 },
  { label: 'Tue', users: 152, plans: 264, engagement: 76, studyHours: 402 },
  { label: 'Wed', users: 160, plans: 281, engagement: 78, studyHours: 425 },
  { label: 'Thu', users: 171, plans: 298, engagement: 79, studyHours: 451 },
  { label: 'Fri', users: 182, plans: 316, engagement: 82, studyHours: 498 },
  { label: 'Sat', users: 176, plans: 304, engagement: 80, studyHours: 472 },
  { label: 'Sun', users: 168, plans: 292, engagement: 77, studyHours: 444 },
];

export const degrees: Degree[] = [
  { id: 'd-1', name: 'MCA', durationYears: 2, totalSemesters: 4 },
  { id: 'd-2', name: 'BTECH', durationYears: 4, totalSemesters: 8 },
  { id: 'd-3', name: 'BCA', durationYears: 3, totalSemesters: 6 },
];

export const subjects: Subject[] = [
  { id: 's-1', name: 'DBMS', code: 'MCA201', degreeId: 'd-1', semester: 2 },
  { id: 's-2', name: 'Operating Systems', code: 'MCA202', degreeId: 'd-1', semester: 2 },
  { id: 's-3', name: 'Data Structures', code: 'BTECH104', degreeId: 'd-2', semester: 1 },
];

export const exams: Exam[] = [
  {
    id: 'e-1',
    name: 'DBMS CA2',
    examType: 'CA2',
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    subjectId: 's-1',
    semester: 2,
  },
  {
    id: 'e-2',
    name: 'OS Mid Term',
    examType: 'MID_TERM',
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16).toISOString(),
    subjectId: 's-2',
    semester: 2,
  },
];

export const students: Student[] = [
  {
    id: 'st-1',
    name: 'Anmol Gupta',
    email: 'anmol@example.com',
    degreeId: 'd-1',
    semester: 2,
    status: 'ACTIVE',
    subjectIds: ['s-1', 's-2'],
  },
  {
    id: 'st-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    degreeId: 'd-1',
    semester: 2,
    status: 'ACTIVE',
    subjectIds: ['s-1'],
  },
];

export const plans: StudyPlanControl[] = [
  {
    id: 'p-1',
    studentId: 'st-1',
    generatedAt: new Date().toISOString(),
    weakSubjects: ['Operating Systems'],
    status: 'GENERATED',
  },
  {
    id: 'p-2',
    studentId: 'st-2',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    weakSubjects: ['DBMS'],
    status: 'REGENERATED',
  },
];

export const activities: Activity[] = [
  { id: 'a-1', text: 'CA2 exam schedule updated for MCA Semester 2', createdAt: new Date().toISOString() },
  { id: 'a-2', text: '45 new students imported via CSV', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'a-3', text: 'Study plans regenerated for weak-subject cohort', createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
];

export const subscriptions: SubscriptionOverview = {
  freeUsers: 980,
  proUsers: 304,
  monthlyRevenue: 182400,
};

export const settings: AdminSettings = {
  defaultStudyHours: 4,
  examPattern: '3_CA_SYSTEM',
  notificationsEnabled: true,
};
