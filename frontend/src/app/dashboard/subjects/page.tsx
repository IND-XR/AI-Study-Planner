'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';
import { DegreeProgram, DifficultyLevel, Subject } from '@/types/dashboard';

const initialForm: Omit<Subject, 'id'> = {
  name: '',
  code: '',
  degree: 'BTECH',
  semester: 1,
  credits: 3,
  faculty: '',
  difficulty: 'MEDIUM',
  color: '#FF8800',
  weakScore: 40,
  resources: [],
};

export default function SubjectsPage(): JSX.Element {
  const { subjects, addSubject, deleteSubject, updateSubject } = useDashboardStore((state) => ({
    subjects: state.subjects,
    addSubject: state.addSubject,
    deleteSubject: state.deleteSubject,
    updateSubject: state.updateSubject,
  }));

  const [form, setForm] = useState<Omit<Subject, 'id'>>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const difficultySuggestion = useMemo<DifficultyLevel>(() => {
    if (form.credits >= 4 || form.weakScore >= 60) return 'HARD';
    if (form.credits <= 2 && form.weakScore < 40) return 'EASY';
    return 'MEDIUM';
  }, [form.credits, form.weakScore]);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const payload = { ...form, difficulty: difficultySuggestion };

    if (editingId) {
      await updateSubject(editingId, payload);
      setEditingId(null);
    } else {
      await addSubject(payload);
    }

    setForm(initialForm);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SectionCard title="Subject Manager" subtitle="Add, edit, and tag subjects by degree and semester">
        <form className="space-y-3" onSubmit={submit}>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            placeholder="Subject Name"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              value={form.code}
              onChange={(event) => setForm((state) => ({ ...state, code: event.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Code"
            />
            <input
              required
              value={form.faculty}
              onChange={(event) => setForm((state) => ({ ...state, faculty: event.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Faculty"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="subject-degree">
              Degree
            </label>
            <select
              id="subject-degree"
              title="Degree"
              value={form.degree}
              onChange={(event) =>
                setForm((state) => ({ ...state, degree: event.target.value as DegreeProgram }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              {['BTECH', 'BCA', 'BBA', 'MCA', 'MBA', 'OTHER'].map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
            <input
              title="Semester"
              type="number"
              min={1}
              max={8}
              value={form.semester}
              onChange={(event) =>
                setForm((state) => ({ ...state, semester: Number(event.target.value || 1) }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Semester"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              title="Credits"
              type="number"
              min={1}
              max={6}
              value={form.credits}
              onChange={(event) =>
                setForm((state) => ({ ...state, credits: Number(event.target.value || 1) }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Credits"
            />
            <input
              title="Weak score"
              type="number"
              min={0}
              max={100}
              value={form.weakScore}
              onChange={(event) =>
                setForm((state) => ({ ...state, weakScore: Number(event.target.value || 0) }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Weak Score"
            />
            <input
              title="Subject tag color"
              type="color"
              value={form.color}
              onChange={(event) => setForm((state) => ({ ...state, color: event.target.value }))}
              className="h-10 rounded-lg border border-slate-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <p className="text-xs text-primary-600 dark:text-primary-300">
            AI-assisted difficulty: <span className="font-semibold">{difficultySuggestion}</span>
          </p>

          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
            <Plus size={16} />
            {editingId ? 'Update Subject' : 'Add Subject'}
          </button>
        </form>
      </SectionCard>

      <div className="xl:col-span-2">
        <SectionCard title="Subject Catalog" subtitle="Credits, faculty, difficulty, tags, and attached resources">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Meta</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Resources</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-t border-slate-200 dark:border-neutral-800">
                    <td className="py-3">
                      <p className="font-semibold">{subject.name}</p>
                      <p className="text-xs text-slate-500">{subject.code}</p>
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                      {subject.degree} • Sem {subject.semester} • {subject.credits} credits • {subject.faculty}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
                        {subject.difficulty}
                        <span className="text-[10px] opacity-80">{subject.color}</span>
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                      {subject.resources.length ? subject.resources.map((resource) => resource.title).join(', ') : 'No resources'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setForm({ ...subject, resources: subject.resources });
                            setEditingId(subject.id);
                          }}
                          title="Edit subject"
                          aria-label="Edit subject"
                          className="rounded-md border border-slate-200 p-1.5 dark:border-neutral-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          title="Delete subject"
                          aria-label="Delete subject"
                          className="rounded-md border border-red-200 p-1.5 text-red-600 dark:border-red-900/40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
