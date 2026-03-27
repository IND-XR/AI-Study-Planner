'use client';

import { Sparkles } from 'lucide-react';
import { PlannerBoard } from '@/features/dashboard/components/PlannerBoard';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

export default function PlannerPage(): JSX.Element {
  const { sessions, rescheduleSession, generateCatchUpPlan } = useDashboardStore((state) => ({
    sessions: state.sessions,
    rescheduleSession: state.rescheduleSession,
    generateCatchUpPlan: state.generateCatchUpPlan,
  }));

  return (
    <div className="space-y-4">
      <SectionCard
        title="AI-Powered Timetable"
        subtitle="Daily, weekly, and monthly adaptive planning with missed-session recovery"
        right={
          <button
            onClick={generateCatchUpPlan}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
          >
            <Sparkles size={16} />
            Generate AI Timetable
          </button>
        }
      >
        <PlannerBoard sessions={sessions} onReschedule={rescheduleSession} />
      </SectionCard>

      <SectionCard title="Smart Suggestions" subtitle="Adaptive study planning intelligence layer">
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-neutral-800/60">
            Revise DBMS today (low retention detected)
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-neutral-800/60">
            OS catch-up session added for 6:00 PM after college
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-neutral-800/60">
            Midterm focus switched to CA2 priority subjects for this week
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
