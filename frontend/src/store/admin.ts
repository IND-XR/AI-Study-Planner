import { create } from 'zustand';
import {
  Activity,
  AdminSettings,
  Degree,
  Exam,
  Student,
  StudyPlanControl,
  Subject,
  SubscriptionOverview,
} from '@/types/admin';
import {
  activities,
  adminMetrics,
  degrees,
  exams,
  growthData,
  plans,
  settings,
  students,
  subjects,
  subscriptions,
} from '@/features/admin/mock-data';

interface AdminState {
  metrics: typeof adminMetrics;
  growthData: typeof growthData;
  activities: Activity[];
  degrees: Degree[];
  subjects: Subject[];
  exams: Exam[];
  students: Student[];
  plans: StudyPlanControl[];
  settings: AdminSettings;
  subscriptions: SubscriptionOverview;
  searchQuery: string;

  addDegree: (payload: Omit<Degree, 'id'>) => void;
  updateDegree: (id: string, payload: Partial<Degree>) => void;
  deleteDegree: (id: string) => void;

  addSubject: (payload: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;

  addExam: (payload: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, payload: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  addStudent: (payload: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, payload: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  bulkImportStudents: (csvText: string) => number;
  assignSubjects: (studentId: string, subjectIds: string[]) => void;

  forceRegeneratePlan: (planId: string) => void;
  updateSettings: (payload: Partial<AdminSettings>) => void;
  setSearchQuery: (query: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  metrics: adminMetrics,
  growthData,
  activities,
  degrees,
  subjects,
  exams,
  students,
  plans,
  settings,
  subscriptions,
  searchQuery: '',

  addDegree: (payload) => {
    set((state) => ({
      degrees: [{ id: `deg-${Date.now()}`, ...payload }, ...state.degrees],
    }));
  },

  updateDegree: (id, payload) => {
    set((state) => ({
      degrees: state.degrees.map((degree) => (degree.id === id ? { ...degree, ...payload } : degree)),
    }));
  },

  deleteDegree: (id) => {
    set((state) => ({
      degrees: state.degrees.filter((degree) => degree.id !== id),
      subjects: state.subjects.filter((subject) => subject.degreeId !== id),
      students: state.students.filter((student) => student.degreeId !== id),
    }));
  },

  addSubject: (payload) => {
    set((state) => ({
      subjects: [{ id: `sub-${Date.now()}`, ...payload }, ...state.subjects],
    }));
  },

  deleteSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter((subject) => subject.id !== id),
      students: state.students.map((student) => ({
        ...student,
        subjectIds: student.subjectIds.filter((subjectId) => subjectId !== id),
      })),
    }));
  },

  addExam: (payload) => {
    set((state) => ({ exams: [{ id: `exam-${Date.now()}`, ...payload }, ...state.exams] }));
  },

  updateExam: (id, payload) => {
    set((state) => ({
      exams: state.exams.map((exam) => (exam.id === id ? { ...exam, ...payload } : exam)),
    }));
  },

  deleteExam: (id) => {
    set((state) => ({ exams: state.exams.filter((exam) => exam.id !== id) }));
  },

  addStudent: (payload) => {
    set((state) => ({
      students: [{ id: `student-${Date.now()}`, ...payload }, ...state.students],
    }));
  },

  updateStudent: (id, payload) => {
    set((state) => ({
      students: state.students.map((student) => (student.id === id ? { ...student, ...payload } : student)),
    }));
  },

  deleteStudent: (id) => {
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
      plans: state.plans.filter((plan) => plan.studentId !== id),
    }));
  },

  bulkImportStudents: (csvText) => {
    const rows = csvText
      .trim()
      .split('\n')
      .map((row) => row.split(',').map((cell) => cell.trim()));

    const dataRows = rows.slice(1);
    const parsed = dataRows
      .filter((row) => row.length >= 5)
      .map((row, index) => ({
        id: `bulk-${Date.now()}-${index}`,
        name: row[0],
        email: row[1],
        degreeId: row[2],
        semester: Number(row[3] || 1),
        status: (row[4]?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
        subjectIds: [],
      }));

    set((state) => ({ students: [...parsed, ...state.students] }));
    return parsed.length;
  },

  assignSubjects: (studentId, subjectIds) => {
    set((state) => ({
      students: state.students.map((student) =>
        student.id === studentId ? { ...student, subjectIds } : student,
      ),
    }));
  },

  forceRegeneratePlan: (planId) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, status: 'REGENERATED', generatedAt: new Date().toISOString() }
          : plan,
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          text: 'Admin force-regenerated a study plan',
          createdAt: new Date().toISOString(),
        },
        ...state.activities,
      ],
    }));
  },

  updateSettings: (payload) => {
    set((state) => ({ settings: { ...state.settings, ...payload } }));
  },

  setSearchQuery: (query) => {
    set(() => ({ searchQuery: query }));
  },
}));
