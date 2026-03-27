'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

const progressClass = (progress: number): string => {
  if (progress >= 90) return 'w-full';
  if (progress >= 80) return 'w-10/12';
  if (progress >= 70) return 'w-9/12';
  if (progress >= 60) return 'w-8/12';
  if (progress >= 50) return 'w-7/12';
  if (progress >= 40) return 'w-6/12';
  if (progress >= 30) return 'w-5/12';
  if (progress >= 20) return 'w-4/12';
  if (progress >= 10) return 'w-3/12';
  return 'w-2/12';
};

export default function ExamsPage(): JSX.Element {
  const exams = useDashboardStore((state) => state.exams);

  return (
    <SectionCard title="Exams & Continuous Assessment" subtitle="CA1/CA2/CA3, Midterm, Endterm tracking with AI revision focus">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {exams.map((exam) => (
          <article
            key={exam.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/60"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{exam.subjectName}</h3>
              <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {exam.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Countdown: {formatDistanceToNowStrict(new Date(exam.date), { addSuffix: true })}
            </p>
            <p className="mt-2 text-xs text-slate-500">Preparation: {exam.preparationProgress}%</p>
            <div className="mt-2 h-2 w-full rounded bg-slate-200 dark:bg-neutral-700">
              <div className={`h-2 rounded bg-primary-500 ${progressClass(exam.preparationProgress)}`} />
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
