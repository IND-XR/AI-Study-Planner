import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  meta?: string;
  icon: ReactNode;
}

export const MetricCard = ({ label, value, meta, icon }: MetricCardProps): JSX.Element => (
  <article className="rounded-2xl border border-[#d9e1ea] bg-[#f7f9fc] p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 text-[38px] leading-none font-bold text-[#0f2340]">{value}</p>
        {meta ? <p className="mt-2 text-sm text-slate-500">{meta}</p> : null}
      </div>
      <div className="rounded-2xl bg-[#ffe9d3] p-2.5 text-[#f18722]">
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
  <section className="rounded-2xl border border-[#d9e1ea] bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[#0f2340]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </section>
);
