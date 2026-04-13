import { create } from 'zustand';
import type {
  WeeklySchedule,
  MonthlyTimetable,
  TimeSlot,
  DayOfWeek,
  Lecture,
  CustomStudySubject,
  StudySession,
  ExamDate,
  Milestone,
  BreakCategory,
} from '@/types';

interface AdminTimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  room?: string | null;
  type: string;
  section?: string;
}

interface SyncOptions {
  week: number;
  year: number;
}

interface TimetableState {
  // Weekly Schedules
  weeklySchedules: WeeklySchedule[];
  currentWeekSchedule: WeeklySchedule | null;

  // Monthly Timetables
  monthlyTimetables: MonthlyTimetable[];
  currentMonthTimetable: MonthlyTimetable | null;

  // Lectures
  lectures: Lecture[];

  // Custom Subjects
  customSubjects: CustomStudySubject[];

  // Subscription/Premium Status
  isPremiumUser: boolean;

  // Actions
  createWeeklySchedule: (week: number, year: number) => WeeklySchedule;
  generateAIWeeklySchedule: (week: number, year: number, exams: any[], subjects: string[]) => WeeklySchedule;
  updateTimeSlot: (scheduleId: string, day: DayOfWeek, slotIndex: number, slot: TimeSlot) => void;
  deleteWeeklySchedule: (scheduleId: string) => void;

  createMonthlyTimetable: (month: number, year: number) => MonthlyTimetable;
  generateAIMonthlyTimetable: (month: number, year: number, exams: any[]) => MonthlyTimetable;
  addStudySession: (timetableId: string, session: StudySession) => void;
  updateStudySession: (timetableId: string, sessionId: string, session: StudySession) => void;
  deleteStudySession: (timetableId: string, sessionId: string) => void;
  markSessionCompleted: (timetableId: string, sessionId: string) => void;

  // Lecture Management
  addLecture: (lecture: Lecture) => void;
  updateLecture: (lectureId: string, lecture: Lecture) => void;
  deleteLecture: (lectureId: string) => void;
  getLecturesForDay: (day: DayOfWeek, course: string, semester: number) => Lecture[];

  // Custom Subjects
  addCustomSubject: (subject: CustomStudySubject) => void;
  deleteCustomSubject: (subjectId: string) => void;
  updateCustomSubject: (subjectId: string, subject: Partial<CustomStudySubject>) => void;

  // Premium Features
  setPremiumStatus: (isPremium: boolean) => void;

  // Backend Timetable Sync
  syncWeeklyScheduleFromAdmin: (entries: AdminTimetableEntry[], options: SyncOptions) => WeeklySchedule;
}

const DAY_MAP: Record<string, DayOfWeek> = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  const aS = toMinutes(aStart);
  const aE = toMinutes(aEnd);
  const bS = toMinutes(bStart);
  const bE = toMinutes(bEnd);
  return aS < bE && bS < aE;
};

const parseTimeRange = (timeRange: string): { startTime: string; endTime: string } => {
  const [startTime, endTime] = timeRange.split('-');
  return {
    startTime: startTime?.trim() || '09:00',
    endTime: endTime?.trim() || '10:00',
  };
};

const normalizeDay = (day: string): DayOfWeek | null => {
  const normalized = day.trim().toUpperCase();
  return DAY_MAP[normalized] || null;
};

const getBreakCategory = (type: string, subject: string): BreakCategory => {
  const value = `${type} ${subject}`.toLowerCase();
  if (value.includes('college break') || value.includes('college_break') || value.includes('lunch') || value.includes('short break')) {
    return 'COLLEGE_BREAK';
  }
  if (value.includes('commute') || value.includes('commute_break') || value.includes('travel') || value.includes('home break')) {
    return 'COMMUTE_BREAK';
  }
  if (value.includes('dinner') || value.includes('dinner_break')) {
    return 'DINNER_BREAK';
  }
  return 'GENERAL_BREAK';
};

const isBreakEntry = (type: string, subject: string): boolean => {
  const value = `${type} ${subject}`.toLowerCase();
  return (
    value.includes('break') ||
    value.includes('lunch') ||
    value.includes('commute') ||
    value.includes('dinner') ||
    value.includes('college_break') ||
    value.includes('commute_break') ||
    value.includes('dinner_break')
  );
};

const isStudyEntry = (type: string): boolean => {
  const value = type.toLowerCase();
  return value.includes('study') || value.includes('self') || value.includes('home');
};

// Mock AI Timetable Generator
const generateAISchedule = (
  exams: any[],
  subjects: string[],
  lectures: Lecture[],
  customSubjects: CustomStudySubject[],
  day: DayOfWeek
): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  // 9 AM - 5 PM: Show lectures
  for (let hour = 9; hour < 17; hour++) {
    const startTime = `${String(hour).padStart(2, '0')}:00`;
    const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

    const lecture = lectures.find(
      (l) => l.day === day && parseInt(l.startTime) === hour
    );

    if (lecture) {
      slots.push({
        id: `${day}-${hour}`,
        startTime,
        endTime,
        status: 'LECTURE',
        subject: lecture.subject,
        lecture,
      });
    } else {
      slots.push({
        id: `${day}-${hour}`,
        startTime,
        endTime,
        status: 'FREE',
      });
    }
  }

  // 5 PM - 12 AM: Suggest study slots
  for (let hour = 17; hour < 23; hour++) {
    const startTime = `${String(hour).padStart(2, '0')}:00`;
    const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

    // Alternate between study and break
    if ((hour - 17) % 3 === 2) {
      slots.push({
        id: `${day}-${hour}`,
        startTime,
        endTime,
        status: 'BREAK',
      });
    } else {
      // Suggest subject with high priority if exam is coming
      const urgentSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const priority = exams.some((e) => e.subjectId === urgentSubject) ? 'HIGH' : 'MEDIUM';

      slots.push({
        id: `${day}-${hour}`,
        startTime,
        endTime,
        status: 'STUDY',
        subject: urgentSubject,
        topic: 'Study Session',
        priority,
      });
    }
  }

  return slots;
};

export const useTimetableStore = create<TimetableState>((set, get) => ({
  weeklySchedules: [],
  currentWeekSchedule: null,
  monthlyTimetables: [],
  currentMonthTimetable: null,
  lectures: [
    // Mock lectures for demonstration
    {
      id: '1',
      subject: 'Data Structures',
      instructorName: 'Dr. Smith',
      startTime: '09:00',
      endTime: '10:30',
      classroom: 'A101',
      day: 'MONDAY',
      course: 'MCA',
      semester: 1,
      isRecurring: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      subject: 'Database Management',
      instructorName: 'Dr. Johnson',
      startTime: '11:00',
      endTime: '12:30',
      classroom: 'B205',
      day: 'WEDNESDAY',
      course: 'MCA',
      semester: 1,
      isRecurring: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      subject: 'Web Development',
      instructorName: 'Prof. Williams',
      startTime: '14:00',
      endTime: '15:30',
      classroom: 'C310',
      day: 'FRIDAY',
      course: 'BTech',
      semester: 4,
      isRecurring: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  customSubjects: [
    {
      id: '1',
      userId: 'user-1',
      name: 'DSA Coding',
      category: 'Programming',
      priority: 'HIGH',
      targetHours: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Design Patterns',
      category: 'Theory',
      priority: 'MEDIUM',
      targetHours: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  isPremiumUser: false,

  // Weekly Schedule Actions
  createWeeklySchedule: (week: number, year: number) => {
    const newSchedule: WeeklySchedule = {
      id: `week-${week}-${year}`,
      userId: 'user-1',
      week,
      year,
      days: {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
      },
      isPremium: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      weeklySchedules: [...state.weeklySchedules, newSchedule],
      currentWeekSchedule: newSchedule,
    }));

    return newSchedule;
  },

  generateAIWeeklySchedule: (week: number, year: number, exams: any[], subjects: string[]) => {
    const { lectures, isPremiumUser } = get();

    if (!isPremiumUser) {
      console.warn('AI timetable generation requires premium subscription');
      return get().createWeeklySchedule(week, year);
    }

    const days: (keyof typeof DayOfWeek)[] = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ];
    const newSchedule: WeeklySchedule = {
      id: `week-${week}-${year}-ai`,
      userId: 'user-1',
      week,
      year,
      days: {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
      },
      isPremium: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Generate AI schedule for each day
    days.forEach((day) => {
      newSchedule.days[day as DayOfWeek] = generateAISchedule(exams, subjects, lectures, [], day as DayOfWeek);
    });

    set((state) => ({
      weeklySchedules: [...state.weeklySchedules, newSchedule],
      currentWeekSchedule: newSchedule,
    }));

    return newSchedule;
  },

  updateTimeSlot: (scheduleId: string, day: DayOfWeek, slotIndex: number, slot: TimeSlot) => {
    set((state) => ({
      weeklySchedules: state.weeklySchedules.map((schedule) => {
        if (schedule.id === scheduleId) {
          const updatedSchedule = { ...schedule };
          updatedSchedule.days[day][slotIndex] = slot;
          return updatedSchedule;
        }
        return schedule;
      }),
    }));
  },

  deleteWeeklySchedule: (scheduleId: string) => {
    set((state) => ({
      weeklySchedules: state.weeklySchedules.filter((s) => s.id !== scheduleId),
      currentWeekSchedule:
        state.currentWeekSchedule?.id === scheduleId ? null : state.currentWeekSchedule,
    }));
  },

  // Monthly Timetable Actions
  createMonthlyTimetable: (month: number, year: number) => {
    const newTimetable: MonthlyTimetable = {
      id: `month-${month}-${year}`,
      userId: 'user-1',
      month,
      year,
      studySessions: [],
      examDates: [],
      milestones: [],
      aiGenerated: false,
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      monthlyTimetables: [...state.monthlyTimetables, newTimetable],
      currentMonthTimetable: newTimetable,
    }));

    return newTimetable;
  },

  generateAIMonthlyTimetable: (month: number, year: number, exams: any[]) => {
    const { isPremiumUser } = get();

    if (!isPremiumUser) {
      console.warn('AI monthly timetable generation requires premium subscription');
      return get().createMonthlyTimetable(month, year);
    }

    // Create AI-optimized study sessions based on exams
    const studySessions: StudySession[] = exams.map((exam, idx) => ({
      id: `session-${idx}`,
      date: new Date(exam.date).toISOString(),
      startTime: idx % 2 === 0 ? '17:00' : '19:00',
      endTime: idx % 2 === 0 ? '18:30' : '20:30',
      subject: exam.subjectId,
      topic: `Prepare for ${exam.type}`,
      priority: exam.weightage > 20 ? 'HIGH' : 'MEDIUM',
      completed: false,
    }));

    const newTimetable: MonthlyTimetable = {
      id: `month-${month}-${year}-ai`,
      userId: 'user-1',
      month,
      year,
      studySessions,
      examDates: exams.map((e) => ({
        examId: e.id,
        examName: e.name,
        date: e.date,
        type: e.type,
        priority: e.weightage > 20 ? 'HIGH' : 'MEDIUM',
      })),
      milestones: [
        {
          id: '1',
          title: 'Month Start Review',
          date: new Date(year, month - 1, 1).toISOString(),
          description: 'Review all exams and set priorities',
        },
        {
          id: '2',
          title: 'Mid-Month Check',
          date: new Date(year, month - 1, 15).toISOString(),
          description: 'Assess progress and adjust schedule',
        },
      ],
      aiGenerated: true,
      isPremium: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      monthlyTimetables: [...state.monthlyTimetables, newTimetable],
      currentMonthTimetable: newTimetable,
    }));

    return newTimetable;
  },

  addStudySession: (timetableId: string, session: StudySession) => {
    set((state) => ({
      monthlyTimetables: state.monthlyTimetables.map((t) => {
        if (t.id === timetableId) {
          return { ...t, studySessions: [...t.studySessions, session] };
        }
        return t;
      }),
    }));
  },

  updateStudySession: (timetableId: string, sessionId: string, session: StudySession) => {
    set((state) => ({
      monthlyTimetables: state.monthlyTimetables.map((t) => {
        if (t.id === timetableId) {
          return {
            ...t,
            studySessions: t.studySessions.map((s) => (s.id === sessionId ? session : s)),
          };
        }
        return t;
      }),
    }));
  },

  deleteStudySession: (timetableId: string, sessionId: string) => {
    set((state) => ({
      monthlyTimetables: state.monthlyTimetables.map((t) => {
        if (t.id === timetableId) {
          return {
            ...t,
            studySessions: t.studySessions.filter((s) => s.id !== sessionId),
          };
        }
        return t;
      }),
    }));
  },

  markSessionCompleted: (timetableId: string, sessionId: string) => {
    set((state) => ({
      monthlyTimetables: state.monthlyTimetables.map((t) => {
        if (t.id === timetableId) {
          return {
            ...t,
            studySessions: t.studySessions.map((s) =>
              s.id === sessionId ? { ...s, completed: true } : s
            ),
          };
        }
        return t;
      }),
    }));
  },

  // Lecture Management
  addLecture: (lecture: Lecture) => {
    set((state) => ({
      lectures: [...state.lectures, lecture],
    }));
  },

  updateLecture: (lectureId: string, lecture: Lecture) => {
    set((state) => ({
      lectures: state.lectures.map((l) => (l.id === lectureId ? lecture : l)),
    }));
  },

  deleteLecture: (lectureId: string) => {
    set((state) => ({
      lectures: state.lectures.filter((l) => l.id !== lectureId),
    }));
  },

  getLecturesForDay: (day: DayOfWeek, course: string, semester: number) => {
    const { lectures } = get();
    return lectures.filter((l) => l.day === day && l.course === course && l.semester === semester);
  },

  // Custom Subject Management
  addCustomSubject: (subject: CustomStudySubject) => {
    set((state) => ({
      customSubjects: [...state.customSubjects, subject],
    }));
  },

  deleteCustomSubject: (subjectId: string) => {
    set((state) => ({
      customSubjects: state.customSubjects.filter((s) => s.id !== subjectId),
    }));
  },

  updateCustomSubject: (subjectId: string, subject: Partial<CustomStudySubject>) => {
    set((state) => ({
      customSubjects: state.customSubjects.map((s) =>
        s.id === subjectId ? { ...s, ...subject } : s
      ),
    }));
  },

  // Premium Features
  setPremiumStatus: (isPremium: boolean) => {
    set(() => ({
      isPremiumUser: isPremium,
    }));
  },

  syncWeeklyScheduleFromAdmin: (entries: AdminTimetableEntry[], options: SyncOptions) => {
    const { customSubjects } = get();
    const scheduleId = `week-${options.week}-${options.year}-admin`;
    const days: WeeklySchedule['days'] = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };

    entries.forEach((entry) => {
      const day = normalizeDay(entry.day);
      if (!day) {
        return;
      }

      const { startTime, endTime } = parseTimeRange(entry.time);
      const type = entry.type || 'Lecture';
      const normalizedType = type.toUpperCase();
      const status = isBreakEntry(type, entry.subject)
        ? 'BREAK'
        : isStudyEntry(type)
          ? 'STUDY'
          : 'LECTURE';
      const groupCode = normalizedType.includes('PRACTICAL') || normalizedType.includes('TUTORIAL') ? '1' : 'ALL';
      const sectionCode = (entry.section || 'ALL').toUpperCase();
      const roomCode = entry.room || '-';

      days[day].push({
        id: entry.id,
        startTime,
        endTime,
        status,
        subject: entry.subject,
        topic: undefined,
        source: 'ADMIN',
        slotType: entry.type,
        courseCode: entry.subject,
        roomCode,
        sectionCode,
        groupCode,
        breakCategory: status === 'BREAK' ? getBreakCategory(type, entry.subject) : undefined,
      });
    });

    DAYS.forEach((day, dayIndex) => {
      const existing = days[day];

      const addIfNoOverlap = (slot: TimeSlot): void => {
        const hasOverlap = existing.some((item) =>
          overlaps(item.startTime, item.endTime, slot.startTime, slot.endTime),
        );
        if (!hasOverlap) {
          existing.push(slot);
        }
      };

      addIfNoOverlap({
        id: `${scheduleId}-${day}-commute`,
        startTime: '17:00',
        endTime: '18:00',
        status: 'BREAK',
        subject: 'Commute / Home Break',
        breakCategory: 'COMMUTE_BREAK',
        source: 'MANUAL',
        slotType: 'COMMUTE_BREAK',
      });

      const firstSubject = customSubjects[dayIndex % Math.max(customSubjects.length, 1)];
      const secondSubject = customSubjects[(dayIndex + 1) % Math.max(customSubjects.length, 1)];

      if (firstSubject) {
        addIfNoOverlap({
          id: `${scheduleId}-${day}-study-a`,
          startTime: '18:15',
          endTime: '19:15',
          status: 'STUDY',
          subject: firstSubject.name,
          topic: 'Home self-study block',
          priority: firstSubject.priority,
          source: 'CUSTOM_STUDY',
          slotType: 'CUSTOM_HOME_STUDY',
        });
      }

      if (secondSubject) {
        addIfNoOverlap({
          id: `${scheduleId}-${day}-study-b`,
          startTime: '19:30',
          endTime: '20:30',
          status: 'STUDY',
          subject: secondSubject.name,
          topic: 'Home self-study block',
          priority: secondSubject.priority,
          source: 'CUSTOM_STUDY',
          slotType: 'CUSTOM_HOME_STUDY',
        });
      }

      addIfNoOverlap({
        id: `${scheduleId}-${day}-dinner`,
        startTime: '20:30',
        endTime: '21:00',
        status: 'BREAK',
        subject: 'Dinner Break',
        breakCategory: 'DINNER_BREAK',
        source: 'MANUAL',
        slotType: 'DINNER_BREAK',
      });

      days[day] = [...existing].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    });

    const syncedSchedule: WeeklySchedule = {
      id: scheduleId,
      userId: 'user-1',
      week: options.week,
      year: options.year,
      days,
      isPremium: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      weeklySchedules: [
        syncedSchedule,
        ...state.weeklySchedules.filter((item) => item.id !== syncedSchedule.id),
      ],
      currentWeekSchedule: syncedSchedule,
    }));

    return syncedSchedule;
  },
}));
