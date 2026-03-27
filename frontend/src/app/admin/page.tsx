'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { SectionCard, MetricCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function AdminPage(): JSX.Element {
  const { metrics, growthData, exams, activities, students } = useAdminStore((state) => ({
    metrics: state.metrics,
    growthData: state.growthData,
    exams: state.exams,
    activities: state.activities,
    students: state.students,
  }));

  const upcoming = [...exams]
    .sort((first, second) => new Date(first.examDate).getTime() - new Date(second.examDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          SaaS system overview for students, exams, and study plan operations
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard key={item.label} label={item.label} value={String(item.value)} meta={item.delta} icon={<span>📊</span>} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <SectionCard title="Daily Active Users" subtitle="User growth and engagement trend">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8800" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FF8800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#FF8800" fill="url(#users)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Study Plan Usage" subtitle="Generated plans by day">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="plans" fill="#FF8800" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <SectionCard title="Upcoming Exams" subtitle="College-wide schedule">
            <ul className="space-y-2 text-sm">
              {upcoming.map((exam) => (
                <li key={exam.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{exam.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {exam.examType} • {format(new Date(exam.examDate), 'dd MMM yyyy')} • Sem {exam.semester}
                  </p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Recent Activities" subtitle="Latest admin actions">
            <ul className="space-y-2 text-sm">
              {activities.slice(0, 5).map((activity) => (
                <li key={activity.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                  <p className="text-slate-700 dark:text-slate-200">{activity.text}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="System Pulse" subtitle="Quick status summary">
            <p className="text-sm text-slate-600 dark:text-slate-300">Students managed: <span className="font-semibold">{students.length}</span></p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Exam pattern: <span className="font-semibold">3 CA + Mid + End</span></p>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
