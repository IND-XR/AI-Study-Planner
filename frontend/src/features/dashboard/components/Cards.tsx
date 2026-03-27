import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  meta?: string;
  icon: ReactNode;
}

export const MetricCard = ({ label, value, meta, icon }: MetricCardProps): JSX.Element => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        {meta ? <p className="mt-1 text-xs text-slate-500">{meta}</p> : null}
      </div>
      <div className="rounded-xl bg-primary-100 p-2 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
        {icon}
      </div>
    </div>
  </article>
);

interface SectionCardProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({ title, subtitle, right, children }: SectionCardProps): JSX.Element => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </section>
);
