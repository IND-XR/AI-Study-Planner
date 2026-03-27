'use client';

import { FormEvent, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function DegreesPage(): JSX.Element {
  const { degrees, addDegree, updateDegree, deleteDegree } = useAdminStore((state) => ({
    degrees: state.degrees,
    addDegree: state.addDegree,
    updateDegree: state.updateDegree,
    deleteDegree: state.deleteDegree,
  }));

  const [form, setForm] = useState({ name: '', durationYears: 2, totalSemesters: 4 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (editingId) {
      updateDegree(editingId, form);
      setEditingId(null);
    } else {
      addDegree(form);
    }
    setForm({ name: '', durationYears: 2, totalSemesters: 4 });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SectionCard title="Add Degree" subtitle="MCA → 2 years → 4 semesters">
        <form className="space-y-3" onSubmit={submit}>
          <input
            value={form.name}
            onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            placeholder="Degree Name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={1}
              value={form.durationYears}
              onChange={(event) => setForm((state) => ({ ...state, durationYears: Number(event.target.value || 1) }))}
              placeholder="Duration"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
            />
            <input
              type="number"
              min={1}
              value={form.totalSemesters}
              onChange={(event) => setForm((state) => ({ ...state, totalSemesters: Number(event.target.value || 1) }))}
              placeholder="Semesters"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
            />
          </div>
          <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
            {editingId ? 'Update Degree' : 'Add Degree'}
          </button>
        </form>
      </SectionCard>

      <div className="xl:col-span-2">
        <SectionCard title="Degree Catalog" subtitle="Create, edit, delete degree programs">
          <div className="space-y-2">
            {degrees.map((degree) => (
              <div
                key={degree.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{degree.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {degree.durationYears} years • {degree.totalSemesters} semesters
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    title="Edit degree"
                    aria-label="Edit degree"
                    onClick={() => {
                      setEditingId(degree.id);
                      setForm({
                        name: degree.name,
                        durationYears: degree.durationYears,
                        totalSemesters: degree.totalSemesters,
                      });
                    }}
                    className="rounded border border-slate-300 p-1.5 dark:border-neutral-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    title="Delete degree"
                    aria-label="Delete degree"
                    onClick={() => deleteDegree(degree.id)}
                    className="rounded border border-red-300 p-1.5 text-red-600 dark:border-red-900/40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
