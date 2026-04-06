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
import { MetricCard, SectionCard } from '@/features/dashboard/components/Cards';
import { PlannerBoard } from '@/features/dashboard/components/PlannerBoard';
import { Timeline } from '@/features/dashboard/components/Timeline';
import { WeeklyScheduleView } from '@/features/dashboard/components/WeeklyScheduleView';
import { MonthlyTimetableView } from '@/features/dashboard/components/MonthlyTimetableView';
import { MonthlyPlannerPanel } from '@/features/dashboard/components/MonthlyPlannerPanel';
import { LecturesList } from '@/features/dashboard/components/LecturesList';
import { CustomSubjectManager } from '@/features/dashboard/components/CustomSubjectManager';
import { useSmartInsight } from '@/features/dashboard/hooks';
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
    error,
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
    error: state.error,
    toggleTask: state.toggleTask,
    rescheduleSession: state.rescheduleSession,
    generateCatchUpPlan: state.generateCatchUpPlan,
    saveSettings: state.saveSettings,
  }));

  const {
    weeklySchedules,
    monthlyTimetables,
    isPremiumUser,
    currentWeekSchedule,
    currentMonthTimetable,
    createWeeklySchedule,
    generateAIWeeklySchedule,
    createMonthlyTimetable,
    generateAIMonthlyTimetable,
    setPremiumStatus,
  } = useTimetableStore();

  const insight = useSmartInsight();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'lectures' | 'subjects'>('weekly');
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  if (isLoading && !profile) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-sm text-slate-200">
        Loading dashboard...
      </div>
    );
  }

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

  const degreeName = profile?.course || profile?.degree || 'BTECH';
  const degreeCode = profile?.degree || 'N/A';
  const showDegreeCode = Boolean(profile?.course && profile?.degree && profile.course !== profile.degree);

  const normalizedDegree = degreeName.toUpperCase();
  let studentDegreeKey: 'BCA' | 'MCA' | 'BTECH' | 'MTECH' | 'OTHER' = 'OTHER';
  if (normalizedDegree.includes('MCA')) studentDegreeKey = 'MCA';
  else if (normalizedDegree.includes('BCA')) studentDegreeKey = 'BCA';
  else if (normalizedDegree.includes('MTECH')) studentDegreeKey = 'MTECH';
  else if (normalizedDegree.includes('BTECH')) studentDegreeKey = 'BTECH';

  const examTypes = {
    BCA: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    MCA: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    BTECH: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    MTECH: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
    OTHER: ['CA1', 'CA2', 'CA3', 'MIDTERM', 'ENDTERM'],
  };

  const applicableExamTypes = examTypes[studentDegreeKey] || examTypes.BTECH;

  return (
    <div className="space-y-6">
      {/* Unified Top Header */}
      <div className="rounded-2xl border border-blue-900/60 bg-gradient-to-r from-blue-950/40 via-neutral-900 to-blue-950/40 p-6 shadow-xl shadow-blue-950/20 mb-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
              Welcome, {profile?.name ?? 'Student'} <span className="text-primary-500">👋</span>
            </h1>
            <p className="mt-1 text-base font-semibold text-blue-200">
              {degreeName}
              {showDegreeCode ? ` (${degreeCode})` : ''} • Year {Math.ceil((profile?.semester || 1) / 2)} • Semester{' '}
              {profile?.semester || 1}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-300">Applicable Exam Types:</span>
              {applicableExamTypes.map((examType) => (
                <span
                  key={examType}
                  className="inline-block rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-200"
                >
                  {examType}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-[120px] text-right">
            <p className="text-xs text-blue-200">Enrollment</p>
            <p className="font-mono text-lg font-bold text-white">{profile?.enrollmentNumber || 'N/A'}</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-orange-900/50 bg-orange-500/10 p-3 text-sm text-orange-200">
          <span className="font-semibold">Smart Insight:</span> {insight}
        </div>
        {error ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        ) : null}
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Study Hours Today"
          value={`${overview.studyHoursToday.toFixed(1)}h`}
          meta={`Time Blocking: ${Math.round(overview.studyHoursToday * 2)} slots`}
          icon={<Clock3 size={18} />}
        />
        <MetricCard
          label="Tasks Completed"
          value={`${overview.tasksCompletedToday}`}
          meta={`Prioritized queue: ${prioritizedTasks.length}`}
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="Upcoming Exam"
          value={`${overview.upcomingExamCountdownDays}d`}
          meta="AI revision priority active"
          icon={<Target size={18} />}
        />
        <MetricCard
          label="Weekly Progress"
          value={`${overview.weeklyProgress}%`}
          meta={overview.status === 'BEHIND' ? 'Behind schedule' : 'On track'}
          icon={<TrendingUp size={18} />}
        />
      </section>

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
            <PlannerBoard sessions={sessions} onReschedule={rescheduleSession} />
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
          <SectionCard title="Today’s Tasks" subtitle="Task prioritization engine">
            <ul className="space-y-2">
              {prioritizedTasks.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-neutral-800/80 px-3 py-2"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`text-left text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
                  >
                    {task.title}
                  </button>
                  <span className="rounded-md bg-orange-500/20 px-2 py-1 text-[10px] font-semibold text-orange-200">
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Productivity" subtitle="Score + consistency streak">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-orange-900/50 bg-orange-500/10 p-3">
                <p className="text-xs text-slate-300">Productivity Score</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-orange-200">
                  <Gauge size={16} /> {productivityScore}
                </p>
              </div>
              <div className="rounded-xl border border-orange-900/50 bg-orange-500/10 p-3">
                <p className="text-xs text-slate-300">Streak</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-bold text-orange-200">
                  <Flame size={16} /> {gamification.streakDays}d
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-slate-700 bg-neutral-800/80 p-3 text-xs text-slate-300">
                Weekly hours: <span className="font-semibold text-orange-200">{weeklyHours.toFixed(1)}h</span>
              </div>
            </div>
          </SectionCard>

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

      {/* ======================= */}
      {/* NEW TIMETABLE SECTION */}
      {/* ======================= */}



      {/* Timetable Navigation Tabs */}
      <div className="rounded-t-xl border border-b-0 border-slate-700 bg-neutral-800/50 p-4">
        <div className="flex gap-2">
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
        </div>
      </div>

      {/* Timetable Content */}
      <div className="rounded-b-xl border border-t-0 border-slate-700 bg-neutral-900 p-6">
        {activeTab === 'weekly' && (
          <div className="space-y-4">
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
          <MonthlyPlannerPanel
            timetable={monthlyTimetable}
            isPremiumUser={isPremiumUser}
            onCreateNewTimetable={() => createMonthlyTimetable(3, 2026)}
            onGenerateAiTimetable={() => generateAIMonthlyTimetable(3, 2026, [])}
            onOpenUpgrade={() => setShowPremiumUpgrade(true)}
          />
        )}

        {activeTab === 'lectures' && (
          <div className="space-y-4">
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
            <div className="rounded-lg border border-green-900/60 bg-green-500/10 p-4">
              <p className="text-sm text-green-200">
                📚 Add your custom study subjects like DSA Coding, Design Patterns, etc. {isPremiumUser ? 'AI will automatically include these in your timetable suggestions.' : 'Premium members can get AI-optimized schedules with these subjects.'}
              </p>
            </div>
            <CustomSubjectManager />
          </div>
        )}
      </div>
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

