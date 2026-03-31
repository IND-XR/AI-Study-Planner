'use client';

import { FormEvent, useMemo, useState } from 'react';
import { BookOpen, Plus, Search, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/store/admin';

interface TopicItem {
  id: string;
  title: string;
  subjectId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function TopicsPage(): JSX.Element {
  const { subjects, searchQuery } = useAdminStore((state) => ({
    subjects: state.subjects,
    searchQuery: state.searchQuery,
  }));

  const [topics, setTopics] = useState<TopicItem[]>([
    {
      id: 'topic-1',
      title: 'Binary Trees and Traversal',
      subjectId: subjects[0]?.id ?? '',
      difficulty: 'MEDIUM',
    },
    {
      id: 'topic-2',
      title: 'Normalization in DBMS',
      subjectId: subjects[1]?.id ?? subjects[0]?.id ?? '',
      difficulty: 'HARD',
    },
  ]);

  const [form, setForm] = useState({
    title: '',
    subjectId: subjects[0]?.id ?? '',
    difficulty: 'MEDIUM' as TopicItem['difficulty'],
  });

  const subjectMap = useMemo(() => {
    return Object.fromEntries(subjects.map((subject) => [subject.id, subject.name]));
  }, [subjects]);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return topics;
    }

    return topics.filter((topic) => {
      const subjectName = (subjectMap[topic.subjectId] ?? '').toLowerCase();
      return [topic.title.toLowerCase(), topic.difficulty.toLowerCase(), subjectName].some((value) =>
        value.includes(q),
      );
    });
  }, [topics, searchQuery, subjectMap]);

  const addTopic = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!form.title.trim() || !form.subjectId) {
      return;
    }

    setTopics((prev) => [
      {
        id: `topic-${Date.now()}`,
        title: form.title.trim(),
        subjectId: form.subjectId,
        difficulty: form.difficulty,
      },
      ...prev,
    ]);

    setForm((prev) => ({ ...prev, title: '' }));
  };

  const deleteTopic = (id: string): void => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
        <h2 className="text-lg font-semibold">Create Topic</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Add subject-wise topics with difficulty tags.</p>

        <form onSubmit={addTopic} className="mt-4 space-y-3">
          <input
            required
            placeholder="Topic title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] dark:border-neutral-700 dark:bg-neutral-800"
          />

          <select
            required
            title="Subject"
            value={form.subjectId}
            onChange={(event) => setForm((prev) => ({ ...prev, subjectId: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] dark:border-neutral-700 dark:bg-neutral-800"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            title="Difficulty"
            value={form.difficulty}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, difficulty: event.target.value as TopicItem['difficulty'] }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF8C00] dark:border-neutral-700 dark:bg-neutral-800"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <button className="inline-flex items-center gap-2 rounded-xl bg-[#FF8C00] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
            <Plus size={15} />
            Add Topic
          </button>
        </form>
      </section>

      <section className="xl:col-span-2 rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/65">
        <h2 className="text-lg font-semibold">Topics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300">Search works from the top bar.</p>

        {searchQuery ? (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            <Search size={12} /> Filter: {searchQuery}
          </p>
        ) : null}

        <div className="mt-4 space-y-2">
          {filteredTopics.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 px-3 py-5 text-sm text-slate-500 dark:border-neutral-700 dark:text-slate-400">
              No topics found for current search.
            </p>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{topic.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    <BookOpen size={12} className="mr-1 inline" />
                    {subjectMap[topic.subjectId] ?? 'Unknown Subject'} • {topic.difficulty}
                  </p>
                </div>
                <button
                  title="Delete topic"
                  aria-label="Delete topic"
                  onClick={() => deleteTopic(topic.id)}
                  className="rounded border border-red-300 p-1.5 text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
