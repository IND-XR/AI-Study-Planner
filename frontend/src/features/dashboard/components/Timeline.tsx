import { TimelineEvent } from '@/types/dashboard';

interface TimelineProps {
  items: TimelineEvent[];
}

export const Timeline = ({ items }: TimelineProps): JSX.Element => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li
        key={item.id}
        className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">{item.title}</p>
          <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-300">
            {item.type}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
      </li>
    ))}
  </ul>
);
