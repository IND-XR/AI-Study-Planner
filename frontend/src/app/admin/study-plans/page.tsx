'use client';

import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function StudyPlansPage(): JSX.Element {
  const { plans, students, forceRegeneratePlan } = useAdminStore((state) => ({
    plans: state.plans,
    students: state.students,
    forceRegeneratePlan: state.forceRegeneratePlan,
  }));

  return (
    <SectionCard title="Study Plan Control" subtitle="View all plans, force regeneration, and track weak subjects">
      <div className="space-y-3">
        {plans.map((plan) => {
          const student = students.find((item) => item.id === plan.studentId);
          return (
            <div key={plan.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{student?.name ?? 'Unknown Student'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {plan.status} • {format(new Date(plan.generatedAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Weak Subjects: {plan.weakSubjects.join(', ') || 'None'}
                  </p>
                </div>
                <button
                  onClick={() => forceRegeneratePlan(plan.id)}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white"
                >
                  <RefreshCw size={12} /> Regenerate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
