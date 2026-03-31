'use client';

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { Users, Sparkles, TrendingUp, CalendarDays } from 'lucide-react';
import { useAdminStore } from '@/store/admin';

export default function AdminPage(): JSX.Element {
  const { growthData, exams, activities, students, plans, searchQuery } = useAdminStore((state) => ({
    growthData: state.growthData,
    exams: state.exams,
    activities: state.activities,
    students: state.students,
    plans: state.plans,
    searchQuery: state.searchQuery,
  }));

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredExams = exams.filter((exam) => {
    if (!normalizedQuery) {
      return true;
    }

    return [exam.name, exam.examType, `semester ${exam.semester}`].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });

  const filteredActivities = activities.filter((activity) => {
    if (!normalizedQuery) {
      return true;
    }

    return activity.text.toLowerCase().includes(normalizedQuery);
  });

  const filteredStudents = students.filter((student) => {
    if (!normalizedQuery) {
      return true;
    }

    return [student.name, student.email].some((value) => value.toLowerCase().includes(normalizedQuery));
  });

  const filteredPlans = plans.filter((plan) => {
    if (!normalizedQuery) {
      return true;
    }

    return plan.weakSubjects.some((subject) => subject.toLowerCase().includes(normalizedQuery));
  });

  const upcoming = [...filteredExams]
    .sort((first, second) => new Date(first.examDate).getTime() - new Date(second.examDate).getTime())
    .slice(0, 5);

  const cardData = [
    {
      label: 'Total Students',
      value: String(filteredStudents.length),
      growth: '+8.6%',
      icon: <Users size={18} className="text-orange-500" />,
    },
    {
      label: 'Active Study Plans',
      value: String(filteredPlans.length),
      growth: '+5.2%',
      icon: <Sparkles size={18} className="text-orange-500" />,
    },
    {
      label: 'Upcoming Exams',
      value: String(upcoming.length),
      growth: '+3.1%',
      icon: <CalendarDays size={18} className="text-orange-500" />,
    },
    {
      label: 'Engagement Trend',
      value: `${Math.round(growthData.reduce((acc, item) => acc + item.engagement, 0) / Math.max(1, growthData.length))}%`,
      growth: '+6.4%',
      icon: <TrendingUp size={18} className="text-orange-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/70 bg-white/65 p-5 shadow-lg shadow-slate-300/40 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:shadow-black/20">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          SaaS system overview for students, exams, and study plan operations
        </p>
        {searchQuery ? (
          <p className="mt-2 text-xs font-medium text-orange-600 dark:text-orange-300">
            Showing filtered data for: &quot;{searchQuery}&quot;
          </p>
        ) : null}
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{card.label}</p>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">{card.icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{card.growth}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Daily Active Users</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Dynamic line chart for engagement trend</p>
            <div className="mt-4 h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#FF8C00" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Study Plan Usage</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Bar chart for plan generation volume</p>
            <div className="mt-4 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="plans" fill="#FF8C00" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming Exams</h2>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">College-wide schedule</p>
            <ul className="space-y-2 text-sm">
              {upcoming.map((exam) => (
                <li key={exam.id} className="rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-2 dark:border-orange-900/30 dark:bg-orange-900/10">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{exam.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {exam.examType} • {format(new Date(exam.examDate), 'dd MMM yyyy')} • Sem {exam.semester}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activities</h2>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">Latest admin actions</p>
            <ul className="space-y-2 text-sm">
              {filteredActivities.slice(0, 5).map((activity) => (
                <li key={activity.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <p className="text-slate-700 dark:text-slate-200">{activity.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/70 backdrop-blur-md dark:border-neutral-700/60 dark:bg-neutral-900/65 dark:shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System Pulse</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Students managed: <span className="font-semibold">{filteredStudents.length}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Active filtered plans: <span className="font-semibold">{filteredPlans.length}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Exam pattern: <span className="font-semibold">3 CA + Mid + End</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
