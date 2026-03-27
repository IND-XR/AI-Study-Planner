'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

export default function AnalyticsPage(): JSX.Element {
  const { analytics, strength, gamification } = useDashboardStore((state) => ({
    analytics: state.analytics,
    strength: state.strength,
    gamification: state.gamification,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <SectionCard title="Study Hours Tracking" subtitle="Weekly and monthly productivity reports">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="studyHours" fill="#FF8800" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Weak vs Strong Analysis" subtitle="AI identifies subject-level knowledge distribution">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="weakPercent" data={strength} fill="#FF8800" nameKey="subjectName" outerRadius={90} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Gamification Metrics" subtitle="XP, streaks, badges, and level progression">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-neutral-800/60">
            <p className="text-xs text-slate-500">XP Points</p>
            <p className="text-xl font-bold">{gamification.xp}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-neutral-800/60">
            <p className="text-xs text-slate-500">Streak</p>
            <p className="text-xl font-bold">{gamification.streakDays}d</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-neutral-800/60">
            <p className="text-xs text-slate-500">Level</p>
            <p className="text-xl font-bold">{gamification.level}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
