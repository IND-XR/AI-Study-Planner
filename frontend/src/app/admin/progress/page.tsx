'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAdminStore } from '@/store/admin';

export default function ProgressPage(): JSX.Element {
  const { growthData, students, plans, searchQuery } = useAdminStore((state) => ({
    growthData: state.growthData,
    students: state.students,
    plans: state.plans,
    searchQuery: state.searchQuery,
  }));

  const q = searchQuery.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    if (!q) {
      return true;
    }
    return [student.name, student.email].some((value) => value.toLowerCase().includes(q));
  });

  const completion = Math.round((plans.length / Math.max(1, filteredStudents.length)) * 100);

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
          <p className="text-sm text-slate-500">Students Tracked</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{filteredStudents.length}</p>
        </article>

        <article className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
          <p className="text-sm text-slate-500">Plans Generated</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{plans.length}</p>
        </article>

        <article className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
          <p className="text-sm text-slate-500">Coverage</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{completion}%</p>
        </article>
      </section>

      <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
        <h2 className="text-lg font-semibold">Progress Trend</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Daily engagement and user trend.</p>

        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#FF8C00" strokeWidth={2.5} />
              <Line type="monotone" dataKey="engagement" stroke="#16a34a" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
