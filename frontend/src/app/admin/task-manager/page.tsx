'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/store/admin';

interface AdminTask {
  id: string;
  title: string;
  status: 'PENDING' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function TaskManagerPage(): JSX.Element {
  const searchQuery = useAdminStore((state) => state.searchQuery);

  const [tasks, setTasks] = useState<AdminTask[]>([
    { id: 'task-1', title: 'Review semester exam schedule', status: 'PENDING', priority: 'HIGH' },
    { id: 'task-2', title: 'Approve new degree mapping', status: 'DONE', priority: 'MEDIUM' },
  ]);

  const [form, setForm] = useState({ title: '', priority: 'MEDIUM' as AdminTask['priority'] });

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return tasks;
    }

    return tasks.filter((task) => [task.title, task.priority, task.status].some((v) => v.toLowerCase().includes(q)));
  }, [tasks, searchQuery]);

  const addTask = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!form.title.trim()) {
      return;
    }

    setTasks((prev) => [
      {
        id: `task-${Date.now()}`,
        title: form.title.trim(),
        status: 'PENDING',
        priority: form.priority,
      },
      ...prev,
    ]);

    setForm({ title: '', priority: 'MEDIUM' });
  };

  const toggleTask = (id: string): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: task.status === 'DONE' ? 'PENDING' : 'DONE' } : task,
      ),
    );
  };

  const deleteTask = (id: string): void => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Manage admin operational tasks.</p>

        <form onSubmit={addTask} className="mt-4 space-y-3">
          <input
            required
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] dark:border-neutral-700 dark:bg-neutral-800"
          />

          <select
            title="Priority"
            value={form.priority}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, priority: event.target.value as AdminTask['priority'] }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] dark:border-neutral-700 dark:bg-neutral-800"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button className="inline-flex items-center gap-2 rounded-xl bg-[#FF8C00] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
            <Plus size={15} />
            Add Task
          </button>
        </form>
      </section>

      <section className="xl:col-span-2 rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
        <h2 className="text-lg font-semibold">Task List</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Live list with search + status toggle.</p>

        <div className="mt-4 space-y-2">
          {filteredTasks.map((task) => (
            <article
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60"
            >
              <button onClick={() => toggleTask(task.id)} className="text-left">
                <p
                  className={`font-semibold ${
                    task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {task.priority} • {task.status}
                </p>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="rounded border border-emerald-300 p-1.5 text-emerald-600"
                  title="Toggle complete"
                >
                  <CheckCircle2 size={14} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded border border-red-300 p-1.5 text-red-600"
                  title="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
