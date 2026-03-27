'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function AnalyticsPage(): JSX.Element {
  const { growthData, plans } = useAdminStore((state) => ({
    growthData: state.growthData,
    plans: state.plans,
  }));

  const weakSubjectDistribution = plans.reduce<Record<string, number>>((accumulator, plan) => {
    plan.weakSubjects.forEach((subject) => {
      accumulator[subject] = (accumulator[subject] ?? 0) + 1;
    });
    return accumulator;
  }, {});

  const weakData = Object.entries(weakSubjectDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <SectionCard title="User Growth" subtitle="Daily active user trend">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line dataKey="users" stroke="#FF8800" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Study Hours" subtitle="Total study hours across platform">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="studyHours" fill="#FF8800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Weak Subjects" subtitle="Detected weak-subject concentration">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={weakData} dataKey="value" nameKey="name" fill="#FF8800" outerRadius={90} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Engagement %" subtitle="Usage engagement trend by day">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line dataKey="engagement" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
