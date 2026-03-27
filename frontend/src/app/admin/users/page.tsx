'use client';

import { SectionCard } from '@/features/dashboard/components/Cards';

export default function UsersPage(): JSX.Element {
  return (
    <SectionCard title="RBAC Control" subtitle="Super Admin and Admin role governance">
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
          <span className="font-semibold">Super Admin:</span> Full access (degrees, subjects, exam patterns, all data)
        </li>
        <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
          <span className="font-semibold">Admin:</span> College-level control (students, exams, subject assignment)
        </li>
        <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
          <span className="font-semibold">Student:</span> View-only dashboard (plans, exams, progress)
        </li>
      </ul>
    </SectionCard>
  );
}
