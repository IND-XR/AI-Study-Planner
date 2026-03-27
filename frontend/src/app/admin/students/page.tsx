'use client';

import { FormEvent, useState } from 'react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function StudentsPage(): JSX.Element {
  const {
    students,
    subjects,
    degrees,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkImportStudents,
    assignSubjects,
  } = useAdminStore((state) => ({
    students: state.students,
    subjects: state.subjects,
    degrees: state.degrees,
    addStudent: state.addStudent,
    updateStudent: state.updateStudent,
    deleteStudent: state.deleteStudent,
    bulkImportStudents: state.bulkImportStudents,
    assignSubjects: state.assignSubjects,
  }));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [csvText, setCsvText] = useState('name,email,degreeId,semester,status');
  const [form, setForm] = useState({
    name: '',
    email: '',
    degreeId: '',
    semester: 1,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    subjectIds: [] as string[],
  });

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (editingId) {
      updateStudent(editingId, form);
      setEditingId(null);
    } else {
      addStudent(form);
    }
    setForm({ name: '', email: '', degreeId: '', semester: 1, status: 'ACTIVE', subjectIds: [] });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4">
        <SectionCard title="Add Student" subtitle="Create and assign student profile">
          <form className="space-y-3" onSubmit={submit}>
            <input value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} required placeholder="Name" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200" />
            <input value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} required placeholder="Email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200" />
            <select title="Degree" value={form.degreeId} onChange={(event) => setForm((state) => ({ ...state, degreeId: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200">
              <option value="">Select Degree</option>
              {degrees.map((degree) => <option key={degree.id} value={degree.id}>{degree.name}</option>)}
            </select>
            <input title="Semester" type="number" min={1} value={form.semester} onChange={(event) => setForm((state) => ({ ...state, semester: Number(event.target.value || 1) }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200" />
            <select title="Status" value={form.status} onChange={(event) => setForm((state) => ({ ...state, status: event.target.value as 'ACTIVE' | 'INACTIVE' }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">{editingId ? 'Update Student' : 'Add Student'}</button>
          </form>
        </SectionCard>

        <SectionCard title="Bulk Upload CSV" subtitle="name,email,degreeId,semester,status">
          <textarea
            title="CSV Input"
            value={csvText}
            onChange={(event) => setCsvText(event.target.value)}
            className="h-32 w-full rounded-lg border border-slate-200 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <button
            onClick={() => bulkImportStudents(csvText)}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
          >
            <Upload size={14} /> Import CSV
          </button>
        </SectionCard>
      </div>

      <div className="xl:col-span-2">
        <SectionCard title="Students" subtitle="Manage, assign subjects, and control status">
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      {student.email} • Sem {student.semester} • {student.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      title="Edit student"
                      aria-label="Edit student"
                      onClick={() => {
                        setEditingId(student.id);
                        setForm({
                          name: student.name,
                          email: student.email,
                          degreeId: student.degreeId,
                          semester: student.semester,
                          status: student.status,
                          subjectIds: student.subjectIds,
                        });
                      }}
                      className="rounded border border-slate-300 p-1.5 dark:border-neutral-700"
                    >
                      <Pencil size={14} />
                    </button>
                    <button title="Delete student" aria-label="Delete student" onClick={() => deleteStudent(student.id)} className="rounded border border-red-300 p-1.5 text-red-600 dark:border-red-900/40">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="mb-1 text-xs text-slate-500 dark:text-slate-300">Assign Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => {
                      const active = student.subjectIds.includes(subject.id);
                      return (
                        <button
                          key={subject.id}
                          onClick={() => {
                            const next = active
                              ? student.subjectIds.filter((id) => id !== subject.id)
                              : [...student.subjectIds, subject.id];
                            assignSubjects(student.id, next);
                          }}
                          className={`rounded-full px-2 py-1 text-[11px] ${
                            active
                              ? 'bg-primary-500 text-white'
                              : 'border border-slate-300 text-slate-600 dark:border-neutral-700 dark:text-slate-300'
                          }`}
                        >
                          {subject.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
