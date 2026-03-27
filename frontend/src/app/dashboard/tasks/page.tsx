'use client';

import { FormEvent, useState } from 'react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';
import { PlannerTask } from '@/types/dashboard';

export default function TasksPage(): JSX.Element {
  const { tasks, addTask, toggleTask } = useDashboardStore((state) => ({
    tasks: state.tasks,
    addTask: state.addTask,
    toggleTask: state.toggleTask,
  }));

  const [title, setTitle] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!title.trim()) return;

    const payload: Omit<PlannerTask, 'id'> = {
      title,
      dueAt: new Date().toISOString(),
      completed: false,
      priority: 'MEDIUM',
      category: 'PRACTICE',
    };

    addTask(payload);
    setTitle('');
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Daily Planner Task Engine" subtitle="Auto-generated and manual tasks with prioritization">
        <form onSubmit={submit} className="mb-4 flex gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            placeholder="Add manual task"
          />
          <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Add</button>
        </form>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`text-left text-sm ${task.completed ? 'line-through text-slate-400' : ''}`}
              >
                {task.title}
              </button>
              <span className="rounded-md bg-primary-100 px-2 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
