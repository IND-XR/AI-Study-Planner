'use client';

import { useEffect, useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { Zap } from 'lucide-react';
import { apiClient } from '@/api/client';
import { MonthlyTimetableView } from '@/features/dashboard/components/MonthlyTimetableView';
import type { MonthlyTimetable } from '@/types';

type CalendarHeadingTag = 'STUDY' | 'CODING' | 'EXAM' | 'OTHER';

type CalendarHeadingItem = {
  id: string;
  title: string;
  tag: CalendarHeadingTag;
  position: number;
};

interface MonthlyPlannerPanelProps {
  timetable: MonthlyTimetable;
  isPremiumUser: boolean;
  onCreateNewTimetable: () => void;
  onGenerateAiTimetable: () => void;
  onOpenUpgrade: () => void;
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const tagClassMap: Record<CalendarHeadingTag, string> = {
  STUDY: 'bg-blue-500/25 text-blue-200',
  CODING: 'bg-purple-500/25 text-purple-200',
  EXAM: 'bg-red-500/25 text-red-200',
  OTHER: 'bg-emerald-500/25 text-emerald-200',
};

export const MonthlyPlannerPanel = ({
  timetable,
  isPremiumUser,
  onCreateNewTimetable,
  onGenerateAiTimetable,
  onOpenUpgrade,
}: MonthlyPlannerPanelProps): JSX.Element => {
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayNotes, setDayNotes] = useState<Record<string, CalendarHeadingItem[]>>({});
  const [noteDraft, setNoteDraft] = useState('');
  const [isSavingHeading, setIsSavingHeading] = useState(false);

  const timetableMonthDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [visibleMonth]);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateNotes = dayNotes[selectedDateKey] ?? [];

  const selectedTagSummary = selectedDateNotes.reduce(
    (accumulator, item) => {
      accumulator[item.tag] += 1;
      return accumulator;
    },
    { STUDY: 0, CODING: 0, EXAM: 0, OTHER: 0 } as Record<CalendarHeadingTag, number>,
  );

  const inferHeadingTag = (title: string): CalendarHeadingTag => {
    const normalized = title.toLowerCase();

    if (/\b(exam|test|midterm|revision|paper)\b/.test(normalized)) return 'EXAM';
    if (/\b(code|coding|program|programming|dsa|react|node|java|python|sql)\b/.test(normalized)) return 'CODING';
    if (/\b(study|learn|read|practice|assignment|homework|notes|prep|prepare)\b/.test(normalized)) return 'STUDY';
    return 'OTHER';
  };

  useEffect(() => {
    const loadMonthHeadings = async (): Promise<void> => {
      try {
        const month = visibleMonth.getMonth() + 1;
        const year = visibleMonth.getFullYear();
        const response = await apiClient.getCalendarHeadings(month, year);
        const items = response?.data?.data ?? response?.data ?? [];

        const grouped = (Array.isArray(items) ? items : []).reduce(
          (accumulator: Record<string, CalendarHeadingItem[]>, item: any) => {
            const key = format(new Date(item.date), 'yyyy-MM-dd');
            const record: CalendarHeadingItem = {
              id: String(item.id),
              title: String(item.title),
              tag: (item.tag as CalendarHeadingTag) || 'STUDY',
              position: Number(item.position ?? 0),
            };

            if (!accumulator[key]) {
              accumulator[key] = [];
            }

            accumulator[key].push(record);
            return accumulator;
          },
          {},
        );

        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((first, second) => first.position - second.position);
        });

        setDayNotes(grouped);
      } catch {
        // Keep local UI state if API is unavailable.
      }
    };

    void loadMonthHeadings();
  }, [visibleMonth]);

  const moveHeadingInSelectedDate = async (draggedId: string, targetId: string): Promise<void> => {
    const current = dayNotes[selectedDateKey] ?? [];
    const sourceIndex = current.findIndex((item) => item.id === draggedId);
    const targetIndex = current.findIndex((item) => item.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
      return;
    }

    const reordered = [...current];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    const withPositions = reordered.map((item, index) => ({ ...item, position: index }));

    setDayNotes((previous) => ({
      ...previous,
      [selectedDateKey]: withPositions,
    }));

    try {
      await apiClient.reorderCalendarHeadings({
        date: selectedDateKey,
        headingIds: withPositions.map((item) => item.id),
      });
    } catch {
      // Keep optimistic order if persistence fails.
    }
  };

  const saveSelectedDateNote = (): void => {
    void (async () => {
      const cleaned = noteDraft.trim();
      if (!cleaned) return;

      setIsSavingHeading(true);
      try {
        const inferredTag = inferHeadingTag(cleaned);
        const response = await apiClient.createCalendarHeading({
          date: selectedDateKey,
          title: cleaned,
          tag: inferredTag,
        });

        const created = response?.data?.data ?? response?.data;
        if (created?.id) {
          const entry: CalendarHeadingItem = {
            id: String(created.id),
            title: String(created.title),
            tag: ((created.tag as CalendarHeadingTag) || inferredTag) as CalendarHeadingTag,
            position: Number(created.position ?? selectedDateNotes.length),
          };

          setDayNotes((previous) => {
            const existing = previous[selectedDateKey] ?? [];
            return {
              ...previous,
              [selectedDateKey]: [...existing, entry],
            };
          });
        }

        setNoteDraft('');
      } catch {
        // Ignore API errors to avoid blocking typing flow.
      } finally {
        setIsSavingHeading(false);
      }
    })();
  };

  const removeSelectedDateNote = (index: number): void => {
    void (async () => {
      const target = selectedDateNotes[index];
      if (!target) return;

      setDayNotes((previous) => ({
        ...previous,
        [selectedDateKey]: (previous[selectedDateKey] ?? []).filter((_, itemIndex) => itemIndex !== index),
      }));

      try {
        await apiClient.deleteCalendarHeading(target.id);
      } catch {
        // Keep optimistic removal to preserve responsiveness.
      }
    })();
  };

  return (
    <div className="space-y-4">
      {!isPremiumUser && (
        <div className="rounded-lg border border-purple-900/60 bg-purple-500/10 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold text-purple-200">
                <Zap size={16} /> AI-Optimized Monthly Planner
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Plan your entire month with AI suggestions for study sessions prioritized by exam dates and subject difficulty.
              </p>
            </div>
            <button
              onClick={onOpenUpgrade}
              className="flex-shrink-0 rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white hover:bg-purple-600"
            >
              Upgrade to Premium (₹50)
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-neutral-950 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-3 border-b border-slate-800 bg-neutral-900/90 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">Monthly Planner</p>
              <p className="text-sm font-bold text-slate-100">{format(visibleMonth, 'MMMM yyyy')}</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
                Selected: {selectedDateNotes.length}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
                Total this day: {selectedDateNotes.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => subMonths(current, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-neutral-800 text-slate-200 transition hover:border-orange-500 hover:bg-neutral-700"
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pick a date</p>
              <p className="text-sm font-semibold text-slate-200">Manage headings directly from the grid</p>
            </div>
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-neutral-800 text-slate-200 transition hover:border-orange-500 hover:bg-neutral-700"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 border-b border-slate-800 px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 px-4 py-4">
          {timetableMonthDays.map((day) => {
            const selected = isSameDay(day, selectedDate);
            const inMonth = isSameMonth(day, visibleMonth);
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayNoteList = dayNotes[dayKey] ?? [];
            const visibleNotes = dayNoteList.slice(0, 2);
            const hiddenNotesCount = dayNoteList.length - visibleNotes.length;
            const hasNote = dayNoteList.length > 0;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => {
                  setVisibleMonth(day);
                  setSelectedDate(day);
                  setNoteDraft('');
                }}
                className={`relative aspect-square overflow-hidden rounded-2xl border text-sm font-semibold transition duration-200 ${
                  selected
                    ? 'border-orange-400 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/25 ring-2 ring-orange-300/30'
                    : inMonth
                      ? 'border-slate-700 bg-neutral-900 text-slate-100 hover:border-orange-500/60 hover:bg-neutral-800'
                      : 'border-slate-800 bg-neutral-950 text-slate-500 hover:border-slate-700 hover:bg-neutral-900'
                }`}
              >
                <span className="absolute left-3 top-3 text-[13px]">{format(day, 'd')}</span>
                {hasNote ? (
                  <span
                    className={`absolute right-3 top-3 h-2 w-2 rounded-full ${
                      selected ? 'bg-white/95' : 'bg-sky-300'
                    }`}
                  />
                ) : null}
                {hasNote ? (
                  <span className="absolute bottom-3 left-2 right-2 flex flex-col gap-1.5">
                    {visibleNotes.map((heading) => (
                      <span
                        key={heading.id}
                        className={`rounded-md px-2 py-1 text-left text-[10px] font-semibold leading-tight shadow-sm ${
                          selected ? 'bg-white/95 text-orange-700' : tagClassMap[heading.tag]
                        }`}
                        title={`${heading.tag}: ${heading.title}`}
                      >
                        <span className="block truncate">{heading.title}</span>
                      </span>
                    ))}
                    {hiddenNotesCount > 0 ? (
                      <span className={`text-left text-[10px] font-semibold ${selected ? 'text-white/90' : 'text-slate-400'}`}>
                        +{hiddenNotesCount} more
                      </span>
                    ) : null}
                  </span>
                ) : null}
                {isToday(day) ? (
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wide ${
                      selected ? 'bottom-1 text-white/90' : 'bottom-1 text-orange-200'
                    }`}
                  >
                    Today
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-800 bg-neutral-900/95 px-4 py-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-neutral-800/80 p-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-100">{format(selectedDate, 'EEE, dd MMM yyyy')}</p>
                <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-200">
                  {selectedDateNotes.length} headings
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Add multiple task headings for this date. They appear inside the date tile and can be reordered.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
                <span className="rounded-full bg-slate-700 px-2.5 py-1">Study {selectedTagSummary.STUDY}</span>
                <span className="rounded-full bg-slate-700 px-2.5 py-1">Coding {selectedTagSummary.CODING}</span>
                <span className="rounded-full bg-slate-700 px-2.5 py-1">Exam {selectedTagSummary.EXAM}</span>
                <span className="rounded-full bg-slate-700 px-2.5 py-1">Other {selectedTagSummary.OTHER}</span>
              </div>
            </div>

            <div className="flex gap-2 rounded-xl border border-slate-700 bg-neutral-900/80 px-3 py-2 text-xs text-slate-300">
              <span>Drag chips to reorder</span>
              <span className="text-slate-500">•</span>
              <span>Color auto-detects from title</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <input
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.currentTarget.value)}
              placeholder="Example: DBMS revision + assignment"
              className="w-full rounded-lg border border-slate-600 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={saveSelectedDateNote}
              disabled={isSavingHeading}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingHeading ? 'Saving...' : 'Add Heading'}
            </button>
          </div>

          {selectedDateNotes.length > 0 ? (
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {selectedDateNotes.map((heading, index) => (
                <li
                  key={heading.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', heading.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const draggedId = event.dataTransfer.getData('text/plain');
                    void moveHeadingInSelectedDate(draggedId, heading.id);
                  }}
                  className="flex cursor-move items-center justify-between rounded-xl border border-slate-600 bg-neutral-900/70 px-3 py-3 text-xs text-slate-200 shadow-sm transition hover:border-orange-500/50 hover:bg-neutral-900"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${tagClassMap[heading.tag]}`}>
                      {heading.tag}
                    </span>
                    <span className="truncate">{heading.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSelectedDateNote(index)}
                    className="rounded bg-red-900/40 px-2 py-0.5 text-[10px] font-semibold text-red-200 hover:bg-red-900/60"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-slate-500">No heading saved for this date.</p>
          )}
        </div>
      </div>

      <MonthlyTimetableView timetable={timetable} isPremium={isPremiumUser} />

      <div className="flex gap-2">
        <button
          onClick={onCreateNewTimetable}
          className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Create New Monthly Timetable
        </button>
        {isPremiumUser && (
          <button
            onClick={onGenerateAiTimetable}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-semibold text-white hover:from-purple-600 hover:to-purple-700"
          >
            <Zap size={16} /> AI Generate Monthly Plan
          </button>
        )}
      </div>
    </div>
  );
};
