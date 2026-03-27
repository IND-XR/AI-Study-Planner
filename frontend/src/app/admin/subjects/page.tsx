'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function SubjectsPage(): JSX.Element {
  const { subjects, degrees, addSubject, deleteSubject } = useAdminStore((state) => ({
    subjects: state.subjects,
    degrees: state.degrees,
    addSubject: state.addSubject,
    deleteSubject: state.deleteSubject,
  }));

  const [form, setForm] = useState({ name: '', code: '', degreeId: '', semester: 1 });
  const [filterDegree, setFilterDegree] = useState('ALL');
  const [filterSemester, setFilterSemester] = useState('ALL');

  const filtered = useMemo(() => {
    return subjects.filter((subject) => {
      const degreeMatch = filterDegree === 'ALL' || subject.degreeId === filterDegree;
      const semesterMatch = filterSemester === 'ALL' || String(subject.semester) === filterSemester;
      return degreeMatch && semesterMatch;
    });
  }, [subjects, filterDegree, filterSemester]);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addSubject(form);
    setForm({ name: '', code: '', degreeId: '', semester: 1 });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SectionCard title="Add Subject" subtitle="Assign by degree and semester">
        <form onSubmit={submit} className="space-y-3">
          <input
            required
            placeholder="Subject Name"
            value={form.name}
            onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <input
            required
            placeholder="Subject Code"
            value={form.code}
            onChange={(event) => setForm((state) => ({ ...state, code: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <select
            title="Degree"
            value={form.degreeId}
            onChange={(event) => setForm((state) => ({ ...state, degreeId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          >
            <option value="">Select Degree</option>
            {degrees.map((degree) => (
              <option key={degree.id} value={degree.id}>
                {degree.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            title="Semester"
            min={1}
            value={form.semester}
            onChange={(event) => setForm((state) => ({ ...state, semester: Number(event.target.value || 1) }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Add Subject</button>
        </form>
      </SectionCard>

      <div className="xl:col-span-2">
        <SectionCard title="Subjects" subtitle="Filter by degree and semester">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              title="Filter Degree"
              value={filterDegree}
              onChange={(event) => setFilterDegree(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
            >
              <option value="ALL">All Degrees</option>
              {degrees.map((degree) => (
                <option key={degree.id} value={degree.id}>
                  {degree.name}
                </option>
              ))}
            </select>
            <select
              title="Filter Semester"
              value={filterSemester}
              onChange={(event) => setFilterSemester(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                <option key={semester} value={String(semester)}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filtered.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{subject.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{subject.code} • Sem {subject.semester}</p>
                </div>
                <button title="Delete subject" aria-label="Delete subject" onClick={() => deleteSubject(subject.id)} className="rounded border border-red-300 p-1.5 text-red-600 dark:border-red-900/40">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
