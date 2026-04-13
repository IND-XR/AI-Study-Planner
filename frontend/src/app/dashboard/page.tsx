'use client';

import {
  BellRing,
  Brain,
  BookOpen,
  Crown,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Medal,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Lock,
  Calendar,
  BookMarked,
  ChevronDown,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { PlannerBoard } from '@/features/dashboard/components/PlannerBoard';
import { Timeline } from '@/features/dashboard/components/Timeline';
import { WeeklyScheduleView } from '@/features/dashboard/components/WeeklyScheduleView';
import { MonthlyTimetableView } from '@/features/dashboard/components/MonthlyTimetableView';
import { MonthlyPlannerPanel } from '@/features/dashboard/components/MonthlyPlannerPanel';
import { LecturesList } from '@/features/dashboard/components/LecturesList';
import { CustomSubjectManager } from '@/features/dashboard/components/CustomSubjectManager';
import { apiClient } from '@/api/client';
import { useDashboardStore } from '@/store/dashboard';
import { useTimetableStore } from '@/store/timetable';
import { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import type { StudySession as DashboardStudySession } from '@/types/dashboard';

export default function DashboardPage(): JSX.Element {
  type CalendarHeadingTag = 'STUDY' | 'CODING' | 'EXAM' | 'OTHER';
  type CalendarHeadingItem = {
    id: string;
    title: string;
    tag: CalendarHeadingTag;
    position: number;
  };

  const {
    profile,
    overview,
    analytics,
    tasks,
    sessions,
    timeline,
    notifications,
    settings,
    leaderboard,
    gamification,
    isLoading,
    toggleTask,
    rescheduleSession,
    generateCatchUpPlan,
    saveSettings,
  } = useDashboardStore((state) => ({
    profile: state.profile,
    overview: state.overview,
    analytics: state.analytics,
    tasks: state.tasks,
    sessions: state.sessions,
    timeline: state.timeline,
    notifications: state.notifications,
    settings: state.settings,
    leaderboard: state.leaderboard,
    gamification: state.gamification,
    isLoading: state.isLoading,
    toggleTask: state.toggleTask,
    rescheduleSession: state.rescheduleSession,
    generateCatchUpPlan: state.generateCatchUpPlan,
    saveSettings: state.saveSettings,
  }));

  const {
    weeklySchedules,
    monthlyTimetables,
    lectures,
    customSubjects,
    isPremiumUser,
    currentWeekSchedule,
    currentMonthTimetable,
    createWeeklySchedule,
    generateAIWeeklySchedule,
    createMonthlyTimetable,
    generateAIMonthlyTimetable,
    setPremiumStatus,
    syncWeeklyScheduleFromAdmin,
  } = useTimetableStore();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'lectures' | 'subjects'>('weekly');
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);

  useEffect(() => {
    const loadAdminManagedTimetable = async () => {
      if (!profile) {
        return;
      }

      try {
        const response = await apiClient.getUserTimetable();
        const payload = response.data?.data ?? response.data;
        const entries = Array.isArray(payload) ? payload : [];
        if (entries.length > 0) {
          syncWeeklyScheduleFromAdmin(entries, { week: 12, year: 2026 });
        }
      } catch (error) {
        console.error('Failed to load user timetable from admin data:', error);
      }
    };

    void loadAdminManagedTimetable();
  }, [profile, syncWeeklyScheduleFromAdmin]);

  // Initialize timetables if not exists
  const weeklySchedule =
    currentWeekSchedule ||
    (weeklySchedules.length === 0 ? createWeeklySchedule(12, 2026) : weeklySchedules[0]);
  const monthlyTimetable =
    currentMonthTimetable ||
    (monthlyTimetables.length === 0 ? createMonthlyTimetable(3, 2026) : monthlyTimetables[0]);

  const prioritizedTasks = [...tasks].sort((first, second) => {
    const weight = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
    return weight[second.priority] - weight[first.priority];
  });

  const urgentNotifications = notifications.filter((item) => item.priority === 'URGENT');
  const visibleNotifications =
    urgentNotifications.length > 0 ? urgentNotifications : notifications.slice(0, 3);
  const productivityScore = Math.round(
    analytics.reduce((accumulator, item) => accumulator + item.productivityScore, 0) / Math.max(1, analytics.length),
  );
  const weeklyHours = analytics.reduce((accumulator, item) => accumulator + item.studyHours, 0);

  const degreeName = (profile?.course || profile?.degree || 'OTHER').toUpperCase();
  const degreeKey: 'BCA' | 'MCA' | 'BTECH' | 'MTECH' | 'OTHER' =
    degreeName.includes('MCA')
      ? 'MCA'
      : degreeName.includes('BCA')
        ? 'BCA'
        : degreeName.includes('MTECH')
          ? 'MTECH'
          : degreeName.includes('BTECH')
            ? 'BTECH'
            : 'OTHER';

  const examTypesByDegree: Record<typeof degreeKey, string[]> = {
    BCA: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    MCA: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    BTECH: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    MTECH: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    OTHER: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
  };

  const applicableExamTypes = examTypesByDegree[degreeKey];
  const studentSection = (profile?.section || profile?.department || 'ALL').toUpperCase();

  const timetableTotals = useMemo(() => {
    const getHours = (startTime: string, endTime: string): number =>
       {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      return (endH * 60 + endM - (startH * 60 + startM)) / 60;
    };

    const totals = { lecture: 0, study: 0, break: 0 };
    (Object.keys(weeklySchedule.days) as Array<keyof typeof weeklySchedule.days>).forEach((day) => {
      weeklySchedule.days[day].forEach((slot) => {
        const hours = getHours(slot.startTime, slot.endTime);
        if (slot.status === 'LECTURE') {
          totals.lecture += hours;
        } else if (slot.status === 'STUDY') {
          totals.study += hours;
        } else if (slot.status === 'BREAK') {
          totals.break += hours;
        }
      });
    });
    return totals;
  }, [weeklySchedule]);

  const weeklyCounts = useMemo(() => {
    const counts = { lectures: 0, studySlots: 0, breakSlots: 0 };
    (Object.keys(weeklySchedule.days) as Array<keyof typeof weeklySchedule.days>).forEach((day) => {
      weeklySchedule.days[day].forEach((slot) => {
        if (slot.status === 'LECTURE') {
          counts.lectures += 1;
        } else if (slot.status === 'STUDY') {
          counts.studySlots += 1;
        } else if (slot.status === 'BREAK') {
          counts.breakSlots += 1;
        }
      });
    });
    return counts;
  }, [weeklySchedule]);

  const dayWiseLectureSummary = useMemo(() => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;
    return days.map((day) => ({
      day,
      lectures: weeklySchedule.days[day].filter((slot) => slot.status === 'LECTURE').length,
      studySlots: weeklySchedule.days[day].filter((slot) => slot.status === 'STUDY').length,
      breakSlots: weeklySchedule.days[day].filter((slot) => slot.status === 'BREAK').length,
    }));
  }, [weeklySchedule]);

  const monthlyTotals = useMemo(() => {
    const totalSessions = monthlyTimetable.studySessions.length;
    const completedSessions = monthlyTimetable.studySessions.filter((session) => session.completed).length;
    const examMilestones = monthlyTimetable.examDates.length;
    return { totalSessions, completedSessions, examMilestones };
  }, [monthlyTimetable]);

  const lectureTabTotals = useMemo(() => {
    const course = profile?.course || 'MCA';
    const semester = profile?.semester || 1;
    const filtered = lectures.filter((lecture) => lecture.course === course && lecture.semester === semester);
    return {
      totalLectures: weeklyCounts.lectures > 0 ? weeklyCounts.lectures : filtered.length,
      weeklyLectureHours: timetableTotals.lecture,
      weeklyStudyHours: timetableTotals.study,
      breakHours: timetableTotals.break,
    };
  }, [lectures, profile?.course, profile?.semester, timetableTotals.break, timetableTotals.lecture, timetableTotals.study, weeklyCounts.lectures]);

  const subjectTotals = useMemo(() => {
    const targetHours = customSubjects.reduce((sum, subject) => sum + (subject.targetHours || 0), 0);
    const highPrioritySubjects = customSubjects.filter((subject) => subject.priority === 'HIGH').length;
    return {
      totalSubjects: customSubjects.length,
      targetHours,
      highPrioritySubjects,
    };
  }, [customSubjects]);

  const boardSessions = useMemo<DashboardStudySession[]>(() => {
    const dayIndexes: Record<string, number> = {
      MONDAY: 0,
      TUESDAY: 1,
      WEDNESDAY: 2,
      THURSDAY: 3,
      FRIDAY: 4,
      SATURDAY: 5,
      SUNDAY: 6,
    };

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const adminSlots: DashboardStudySession[] = [];

    (Object.keys(weeklySchedule.days) as Array<keyof typeof weeklySchedule.days>).forEach((day) => {
      weeklySchedule.days[day].forEach((slot) => {
        if (slot.source !== 'ADMIN') {
          return;
        }

        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + dayIndexes[day]);

        const start = new Date(dayDate);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(dayDate);
        end.setHours(endHour, endMinute, 0, 0);

        adminSlots.push({
          id: slot.id,
          title: `${slot.slotType || slot.status} ${slot.groupCode ? `(G:${slot.groupCode})` : ''}`.trim(),
          subjectId: slot.courseCode || slot.subject || 'NA',
          subjectName: `C:${slot.courseCode || slot.subject || '-'} / R:${slot.roomCode || '-'} / S:${slot.sectionCode || 'ALL'}`,
          start: start.toISOString(),
          end: end.toISOString(),
          aiSuggested: false,
        });
      });
    });

    return adminSlots.length > 0 ? adminSlots : sessions;
  }, [sessions, weeklySchedule]);

  const showLoadingState = isLoading && !profile;

  if (showLoadingState) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-sm text-slate-200">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student Context</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {degreeName} • Semester {profile?.semester || 1} • Section {studentSection}
        </p>
      </div> */}

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Study Hours</span>
            <span className="rounded-full bg-orange-500/15 p-2 text-orange-500"><Clock3 size={14} /></span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{overview.studyHoursToday.toFixed(1)}h</p>
          <p className="mt-2 text-xs text-slate-600">{Math.round(overview.studyHoursToday * 2)} blocks planned</p>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Tasks Done</span>
            <span className="rounded-full bg-orange-500/15 p-2 text-orange-500"><CheckCircle2 size={14} /></span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{overview.tasksCompletedToday}</p>
          <p className="mt-2 text-xs text-slate-600">{prioritizedTasks.length} in queue</p>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Upcoming Exam</span>
            <span className="rounded-full bg-orange-500/15 p-2 text-orange-500"><Target size={14} /></span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{overview.upcomingExamCountdownDays}d</p>
          <p className="mt-2 text-xs text-slate-600">Priority revision active</p>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Weekly Progress</span>
            <span className="rounded-full bg-orange-500/15 p-2 text-orange-500"><TrendingUp size={14} /></span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{overview.weeklyProgress}%</p>
          <p className="mt-2 text-xs text-slate-600">{overview.status === 'BEHIND' ? 'Behind schedule' : 'On track'}</p>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <p className="mb-2 text-xl font-bold text-slate-900">Today's Tasks</p>
          <ul className="space-y-1.5">
            {prioritizedTasks.slice(0, 2).map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-700 px-2.5 py-1.5"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`truncate text-left text-xs ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}
                >
                  {task.title}
                </button>
                <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-200">
                  {task.priority}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm">
          <p className="mb-2 text-xl font-bold text-slate-900">Productivity</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-1.5 text-slate-700">
              <span className="flex items-center gap-1"><Gauge size={12} /> Score</span>
              <span className="font-semibold text-orange-500">{productivityScore}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-1.5 text-slate-700">
              <span className="flex items-center gap-1"><Flame size={12} /> Streak</span>
              <span className="font-semibold text-orange-500">{gamification.streakDays}d</span>
            </div>
            <div className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-slate-100">
              Weekly: <span className="font-semibold text-orange-300">{weeklyHours.toFixed(1)}h</span>
            </div>
          </div>
        </article>
      </section>

      {/* Timetable Section */}
      <div className="rounded-t-xl border border-b-0 border-slate-700 bg-neutral-800/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['weekly', 'monthly', 'lectures', 'subjects'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-700/50 text-slate-300 hover:bg-neutral-600'
              }`}
            >
              {tab === 'weekly' && <Clock3 size={16} />}
              {tab === 'monthly' && <Calendar size={16} />}
              {tab === 'lectures' && <BookOpen size={16} />}
              {tab === 'subjects' && <BookMarked size={16} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          {(activeTab === 'weekly' || activeTab === 'subjects') && (
            <div className="ml-2 flex flex-wrap items-center gap-2">
              {applicableExamTypes.map((examType) => (
                <span
                  key={examType}
                  className="rounded-full border border-blue-300/20 bg-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-100"
                >
                  {examType}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-b-xl border border-t-0 border-slate-700 bg-neutral-900 p-6">
        {activeTab === 'weekly' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-blue-900/60 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
                Lecture Hours: <span className="font-semibold">{timetableTotals.lecture.toFixed(1)}h</span>
              </div>
              <div className="rounded-lg border border-orange-900/60 bg-orange-500/10 px-3 py-2 text-sm text-orange-100">
                Study Hours: <span className="font-semibold">{timetableTotals.study.toFixed(1)}h</span>
              </div>
              <div className="rounded-lg border border-slate-700 bg-neutral-800 px-3 py-2 text-sm text-slate-200">
                Break Time: <span className="font-semibold">{timetableTotals.break.toFixed(1)}h</span>
              </div>
            </div>

            {!isPremiumUser && (
              <div className="rounded-lg border border-purple-900/60 bg-purple-500/10 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-purple-200">
                      <Zap size={16} /> AI-Optimized Weekly Schedule
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Get intelligent AI suggestions for the best study times based on your lectures, exams, and priorities.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPremiumUpgrade(true)}
                    className="flex-shrink-0 rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white hover:bg-purple-600"
                  >
                    Upgrade to Premium (₹50)
                  </button>
                </div>
              </div>
            )}
            <WeeklyScheduleView schedule={weeklySchedule} isPremium={isPremiumUser} />
            <div className="flex gap-2">
              <button
                onClick={() => createWeeklySchedule(Math.floor(Math.random() * 52) + 1, 2026)}
                className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Create New Weekly Schedule
              </button>
              {isPremiumUser && (
                <button
                  onClick={() => generateAIWeeklySchedule(Math.floor(Math.random() * 52) + 1, 2026, [], [])}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-semibold text-white hover:from-purple-600 hover:to-purple-700"
                >
                  <Zap size={16} /> Generate AI Schedule
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-indigo-900/60 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-100">
                Total Sessions: <span className="font-semibold">{monthlyTotals.totalSessions}</span>
              </div>
              <div className="rounded-lg border border-emerald-900/60 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                Completed: <span className="font-semibold">{monthlyTotals.completedSessions}</span>
              </div>
              <div className="rounded-lg border border-amber-900/60 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                Exam Milestones: <span className="font-semibold">{monthlyTotals.examMilestones}</span>
              </div>
            </div>

            <MonthlyPlannerPanel
              timetable={monthlyTimetable}
              isPremiumUser={isPremiumUser}
              onCreateNewTimetable={() => createMonthlyTimetable(3, 2026)}
              onGenerateAiTimetable={() => generateAIMonthlyTimetable(3, 2026, [])}
              onOpenUpgrade={() => setShowPremiumUpgrade(true)}
            />
          </div>
        )}

        {activeTab === 'lectures' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
              <div className="rounded-lg border border-blue-900/60 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
                Timetable Lectures: <span className="font-semibold">{lectureTabTotals.totalLectures}</span>
              </div>
              <div className="rounded-lg border border-orange-900/60 bg-orange-500/10 px-3 py-2 text-sm text-orange-100">
                Weekly Lecture Hours: <span className="font-semibold">{lectureTabTotals.weeklyLectureHours.toFixed(1)}h</span>
              </div>
              <div className="rounded-lg border border-emerald-900/60 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                Weekly Study Hours: <span className="font-semibold">{lectureTabTotals.weeklyStudyHours.toFixed(1)}h</span>
              </div>
              <div className="rounded-lg border border-slate-700 bg-neutral-800 px-3 py-2 text-sm text-slate-200">
                Weekly Break Hours: <span className="font-semibold">{lectureTabTotals.breakHours.toFixed(1)}h</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-neutral-800 p-4">
              <h4 className="mb-3 text-sm font-semibold text-slate-100">Weekly Lecture Plan (Day-wise)</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {dayWiseLectureSummary.map((item) => (
                  <div key={item.day} className="rounded border border-slate-700 bg-neutral-900 px-3 py-2 text-xs">
                    <p className="font-semibold text-slate-200">{item.day.slice(0, 3)}</p>
                    <p className="mt-1 text-blue-200">Lectures: {item.lectures}</p>
                    <p className="text-emerald-200">Study: {item.studySlots}</p>
                    <p className="text-slate-300">Breaks: {item.breakSlots}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Total this week: {weeklyCounts.lectures} lectures, {weeklyCounts.studySlots} study blocks, {weeklyCounts.breakSlots} breaks.
              </p>
            </div>

            <div className="rounded-lg border border-blue-900/60 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-200">
                ℹ️ Add your college lectures here. They'll automatically appear in your weekly schedule from 9 AM to 5 PM (lecture hours).
              </p>
            </div>
            <LecturesList course={profile?.course || 'MCA'} semester={profile?.semester || 1} />
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-green-900/60 bg-green-500/10 px-3 py-2 text-sm text-green-100">
                Custom Subjects: <span className="font-semibold">{subjectTotals.totalSubjects}</span>
              </div>
              <div className="rounded-lg border border-orange-900/60 bg-orange-500/10 px-3 py-2 text-sm text-orange-100">
                Target Weekly Hours: <span className="font-semibold">{subjectTotals.targetHours}h</span>
              </div>
              <div className="rounded-lg border border-red-900/60 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                High Priority Subjects: <span className="font-semibold">{subjectTotals.highPrioritySubjects}</span>
              </div>
            </div>

            <div className="rounded-lg border border-green-900/60 bg-green-500/10 p-4">
              <p className="text-sm text-green-200">
                📚 Add your custom study subjects like DSA Coding, Design Patterns, etc. {isPremiumUser ? 'AI will automatically include these in your timetable suggestions.' : 'Premium members can get AI-optimized schedules with these subjects.'}
              </p>
            </div>
            <CustomSubjectManager />
          </div>
        )}
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <SectionCard
            title="AI-Powered Timetable"
            subtitle="Google Calendar-like drag-and-drop planning with adaptive recovery"
            right={
              <div className="flex items-center gap-2">
                <button
                  onClick={generateCatchUpPlan}
                  className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-600"
                >
                  Catch-up Planner
                </button>
                <button className="rounded-lg border border-orange-700/60 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-200">
                  Daily / Weekly / Monthly
                </button>
              </div>
            }
          >
            <PlannerBoard sessions={boardSessions} onReschedule={rescheduleSession} />
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="rounded-lg bg-neutral-800/70 px-3 py-2 text-xs text-slate-300">
                Weak subject boost: <span className="font-semibold text-orange-300">Enabled</span>
              </div>
              <div className="rounded-lg bg-neutral-800/70 px-3 py-2 text-xs text-slate-300">
                Missed session recovery: <span className="font-semibold text-orange-300">Auto</span>
              </div>
              <div className="rounded-lg bg-neutral-800/70 px-3 py-2 text-xs text-slate-300">
                Exam priority mode: <span className="font-semibold text-orange-300">High</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Performance Trend" subtitle="Mini analytics with productivity trend and consistency">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="studyHoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8800" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF8800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="studyHours"
                    stroke="#FF8800"
                    strokeWidth={2}
                    fill="url(#studyHoursGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <SectionCard title="Gamification" subtitle="XP, levels, badges, leaderboard">
            <div className="mb-3 rounded-xl border border-slate-700 bg-neutral-800/80 p-3">
              <p className="text-xs text-slate-400">XP / Level</p>
              <p className="mt-1 flex items-center gap-1 text-lg font-bold text-orange-200">
                <Zap size={14} /> {gamification.xp} XP • Lv.{gamification.level}
              </p>
              <p className="mt-1 text-xs text-slate-400">Badges: {gamification.badges.join(', ')}</p>
            </div>
            <ul className="space-y-2">
              {leaderboard.slice(0, 4).map((entry, index) => (
                <li key={entry.id} className="flex items-center justify-between rounded-lg bg-neutral-800/70 px-3 py-2 text-xs">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Medal size={12} className="text-orange-300" /> #{index + 1} {entry.name}
                  </span>
                  <span className="text-orange-200">{entry.xp} XP</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Smart Notifications"
            subtitle="Priority-based alerts for exams and deadlines"
          >
            <ul className="space-y-2">
              {visibleNotifications.map((item) => (
                <li key={item.id} className="rounded-lg border border-orange-900/50 bg-orange-500/10 px-3 py-2 text-xs text-slate-200">
                  <p className="flex items-center gap-1 font-semibold text-orange-200">
                    <BellRing size={12} /> {item.title}
                  </p>
                  <p className="mt-1 text-slate-300">{item.message}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Subscription" subtitle="High-conversion upgrade CTA">
            <div className="rounded-xl border border-orange-700/60 bg-gradient-to-r from-orange-500/20 to-orange-600/20 p-3 flex flex-col items-start">
              <button className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-orange-500 shadow hover:bg-orange-100 transition-all border border-orange-200">
                <span className="flex items-center gap-1">
                  <Sparkles size={16} className="text-orange-400" /> Upgrade to Pro
                </span>
                <ChevronDown size={18} className="text-orange-400" />
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Quick Personalization" subtitle="Timezone, study hours, notification control">
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300">
                Daily Study Hours
                <input
                  type="number"
                  min={1}
                  max={12}
                  defaultValue={settings.dailyStudyHourGoal}
                  onBlur={(event) =>
                    void saveSettings({ dailyStudyHourGoal: Number(event.currentTarget.value || 1) })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-neutral-800 px-2 py-1"
                />
              </label>
              <label className="block text-slate-300">
                Timezone
                <input
                  defaultValue={settings.timezone}
                  onBlur={(event) => void saveSettings({ timezone: event.currentTarget.value })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-neutral-800 px-2 py-1"
                />
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked={settings.notificationsEnabled}
                  onChange={(event) => void saveSettings({ notificationsEnabled: event.currentTarget.checked })}
                />
                Notifications Enabled
              </label>
              <div className="rounded-lg border border-orange-900/50 bg-orange-500/10 p-2 text-slate-200">
                <p className="flex items-center gap-1 font-semibold text-orange-200">
                  <Brain size={12} /> AI Revision Suggestion
                </p>
                <p className="mt-1">Revise DBMS today (low retention detected).</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <SectionCard title="Activity Timeline" subtitle="Recent study, task, and planner events">
        <Timeline items={timeline.slice(0, 6)} />
      </SectionCard>

      {/* Premium Upgrade Modal */}
      {showPremiumUpgrade && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
          <div className="rounded-xl border border-orange-700/60 bg-neutral-900 p-8 max-w-md">
            <div className="flex items-center gap-2 text-2xl font-bold text-orange-200 mb-4">
              <Crown size={24} /> Upgrade to Premium
            </div>
            <p className="text-slate-300 mb-4">
              Unlock AI-powered timetable generation that intelligently schedules your study sessions based on:
            </p>
            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" /> Exam dates and priorities
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" /> Your college lectures
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" /> Custom study subjects
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" /> Subject difficulty levels
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" /> Optimal study time recommendations
              </li>
            </ul>
            <div className="mb-6 rounded-lg bg-orange-500/20 p-4 text-center">
              <p className="text-3xl font-bold text-orange-300">₹50</p>
              <p className="text-sm text-slate-300">One-time payment</p>
            </div>
            <button
              onClick={() => {
                setPremiumStatus(true);
                setShowPremiumUpgrade(false);
              }}
              className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 mb-2"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => setShowPremiumUpgrade(false)}
              className="w-full rounded-lg border border-slate-700 bg-neutral-800 px-4 py-3 font-semibold text-slate-300 hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

