'use client';

import { FormEvent, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';
import { ExamType } from '@/types/admin';

export default function ExamsPage(): JSX.Element {
  const { exams, subjects, addExam, updateExam, deleteExam } = useAdminStore((state) => ({
    exams: state.exams,
    subjects: state.subjects,
    addExam: state.addExam,
    updateExam: state.updateExam,
    deleteExam: state.deleteExam,
  }));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    examType: 'CA1' as ExamType,
    examDate: new Date().toISOString().slice(0, 10),
    subjectId: '',
    semester: 1,
  });

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const payload = { ...form, examDate: new Date(form.examDate).toISOString() };

    if (editingId) {
      updateExam(editingId, payload);
      setEditingId(null);
    } else {
      addExam(payload);
    }

    setForm({ name: '', examType: 'CA1', examDate: new Date().toISOString().slice(0, 10), subjectId: '', semester: 1 });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <SectionCard title="Add Exam" subtitle="CA1/CA2/CA3, Mid Term, End Term">
        <form className="space-y-3" onSubmit={submit}>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            placeholder="Exam Name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <select
            title="Exam Type"
            value={form.examType}
            onChange={(event) => setForm((state) => ({ ...state, examType: event.target.value as ExamType }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          >
            {['CA1', 'CA2', 'CA3', 'MID_TERM', 'END_TERM'].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="date"
            title="Exam Date"
            value={form.examDate}
            onChange={(event) => setForm((state) => ({ ...state, examDate: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
          <select
            title="Subject"
            value={form.subjectId}
            onChange={(event) => setForm((state) => ({ ...state, subjectId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
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
          <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">
            {editingId ? 'Update Exam' : 'Add Exam'}
          </button>
        </form>
      </SectionCard>

      <div className="xl:col-span-2">
        <SectionCard title="Exam Schedule" subtitle="Manage full exam lifecycle">
          <div className="space-y-2">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{exam.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {exam.examType} • {format(new Date(exam.examDate), 'dd MMM yyyy')} • Sem {exam.semester}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    title="Edit exam"
                    aria-label="Edit exam"
                    onClick={() => {
                      setEditingId(exam.id);
                      setForm({
                        name: exam.name,
                        examType: exam.examType,
                        examDate: exam.examDate.slice(0, 10),
                        subjectId: exam.subjectId,
                        semester: exam.semester,
                      });
                    }}
                    className="rounded border border-slate-300 p-1.5 dark:border-neutral-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button title="Delete exam" aria-label="Delete exam" onClick={() => deleteExam(exam.id)} className="rounded border border-red-300 p-1.5 text-red-600 dark:border-red-900/40">
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
