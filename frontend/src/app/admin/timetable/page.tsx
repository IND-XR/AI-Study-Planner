'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarPlus, CheckCircle2, AlertCircle, Clock3, Building2, Layers3 } from 'lucide-react';
import { apiClient } from '@/api/client';

type Degree = {
  id: string;
  name: string;
  code: string;
};

type TimetableRow = {
  id: string;
  degreeId: string;
  degreeName?: string;
  day: string;
  subject: string;
  time: string;
  room?: string;
  type: string;
  section?: string;
  notes?: string;
};

type TimetableType = 'LECTURE' | 'TUTORIAL' | 'PRACTICAL' | 'COLLEGE_BREAK' | 'COMMUTE_BREAK' | 'DINNER_BREAK' | 'SELF_STUDY';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;
const SECTION_OPTIONS = ['ALL', 'A', 'B', 'C', 'D', 'D2527', 'DE657', 'DE676', '9PV84', '9PV13', '9P58D', '9P69D'] as const;

const typeOptions: { label: string; value: TimetableType }[] = [
  { label: 'Lecture', value: 'LECTURE' },
  { label: 'Tutorial', value: 'TUTORIAL' },
  { label: 'Practical', value: 'PRACTICAL' },
  { label: 'College Break', value: 'COLLEGE_BREAK' },
  { label: 'Commute/Home Break', value: 'COMMUTE_BREAK' },
  { label: 'Dinner Break', value: 'DINNER_BREAK' },
  { label: 'Self Study', value: 'SELF_STUDY' },
];

const readSection = (row: TimetableRow): string => {
  if (row.section) {
    return row.section;
  }
  if (row.notes) {
    const match = row.notes.match(/SECTION:([^|]+)/i);
    return match?.[1]?.trim()?.toUpperCase() || 'ALL';
  }
  return 'ALL';
};

const parseTimeRange = (value: string): { startTime: string; endTime: string } => {
  const [startTime, endTime] = value.split('-');
  return {
    startTime: startTime?.trim() || '09:00',
    endTime: endTime?.trim() || '10:00',
  };
};

const escapeCsvValue = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const buildCsv = (rows: TimetableRow[]): string => {
  const header = ['degreeId', 'day', 'startTime', 'endTime', 'subject', 'room', 'type', 'section'];
  const lines = rows.map((row) => {
    const { startTime, endTime } = parseTimeRange(row.time);
    const values = [
      row.degreeId,
      row.day,
      startTime,
      endTime,
      row.subject,
      row.room || '',
      row.type,
      readSection(row),
    ];
    return values.map((value) => escapeCsvValue(String(value ?? ''))).join(',');
  });
  return [header.join(','), ...lines].join('\n');
};

const parseCsv = (text: string): Record<string, string>[] => {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  const pushCell = (): void => {
    row.push(current);
    current = '';
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (current.length > 0 || row.length > 0) {
        pushCell();
        rows.push(row);
        row = [];
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    pushCell();
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? '').trim();
    });
    return record;
  });
};

export default function AdminTimetablePage(): JSX.Element {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [entries, setEntries] = useState<TimetableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [bulkTargetDegreeId, setBulkTargetDegreeId] = useState('');
  const [bulkTargetSection, setBulkTargetSection] = useState('ALL');
  const [collegeTimetableDegreeId, setCollegeTimetableDegreeId] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    mode: 'SINGLE_DAY' as 'SINGLE_DAY' | 'WEEKLY',
    degreeSelection: 'ALL_DEGREES',
    section: 'ALL',
    day: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    type: 'LECTURE' as TimetableType,
    subject: '',
    room: '',
  });
  const [weeklyDays, setWeeklyDays] = useState<string[]>(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);

  const degreeNameMap = useMemo(() => {
    return new Map(degrees.map((degree) => [degree.id, `${degree.name} (${degree.code})`]));
  }, [degrees]);

  const selectedDegreeIds = useMemo(() => {
    if (form.degreeSelection === 'ALL_DEGREES') {
      return degrees.map((degree) => degree.id);
    }
    return form.degreeSelection ? [form.degreeSelection] : [];
  }, [degrees, form.degreeSelection]);

  const collegeTimetableDegreeName = useMemo(() => {
    return degreeNameMap.get(collegeTimetableDegreeId) || 'Select a degree';
  }, [collegeTimetableDegreeId, degreeNameMap]);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const [degreeRes] = await Promise.all([apiClient.getDegrees()]);
      const degreeItems = (degreeRes.data?.data ?? degreeRes.data ?? []) as Degree[];
      setDegrees(degreeItems);

      const timetableResults = await Promise.all(
        degreeItems.map(async (degree) => {
          try {
            const timetableRes = await apiClient.getTimetableByDegree(degree.id);
            const rows = (timetableRes.data?.data ?? timetableRes.data ?? []) as TimetableRow[];
            return rows.map((row) => ({ ...row, degreeName: degree.name }));
          } catch {
            return [] as TimetableRow[];
          }
        }),
      );

      setEntries(timetableResults.flat());
    } catch (fetchError: unknown) {
      const err = fetchError as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const isBreakType = form.type.includes('BREAK');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    if (selectedDegreeIds.length === 0) {
      setSubmitting(false);
      setError('Please select at least one degree');
      return;
    }

    const selectedDays = form.mode === 'WEEKLY' ? weeklyDays : [form.day];
    if (selectedDays.length === 0) {
      setSubmitting(false);
      setError('Please select at least one day for weekly mode');
      return;
    }

    const payloads = selectedDegreeIds.flatMap((degreeId) =>
      selectedDays.map((selectedDay) => ({
        degreeId,
        day: selectedDay,
        subject: form.subject.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room.trim() || '-',
        type: form.type,
        section: form.section.trim() || 'ALL',
      })),
    );

    try {
      if (editingId) {
        await apiClient.updateTimetableEntry(editingId, payloads[0]);
      } else {
        await Promise.all(payloads.map((payload) => apiClient.createTimetableEntry(payload)));
      }

      setMessage(
        form.degreeSelection === 'ALL_DEGREES'
          ? `Timetable entries created for all ${selectedDegreeIds.length} degrees (${form.section} section).`
          : editingId
            ? 'Timetable entry updated successfully.'
            : `Timetable ${payloads.length > 1 ? 'entries' : 'entry'} created successfully.`,
      );

      setForm((prev) => ({
        ...prev,
        subject: '',
        room: '',
        mode: 'SINGLE_DAY',
        degreeSelection: 'ALL_DEGREES',
        section: 'ALL',
        day: 'MONDAY',
        startTime: '09:00',
        endTime: '10:00',
        type: 'LECTURE',
      }));
      setWeeklyDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
      setEditingId(null);

      await loadData();
    } catch (submitError: unknown) {
      const err = submitError as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Could not create timetable entry');
    } finally {
      setSubmitting(false);
    }
  };

  const applyCollegeTimetableDegree = (): void => {
    if (!collegeTimetableDegreeId) {
      setError('Please choose a college timetable degree first');
      return;
    }

    setForm((prev) => ({
      ...prev,
      degreeSelection: collegeTimetableDegreeId,
      mode: 'WEEKLY',
      section: 'ALL',
    }));
    setWeeklyDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
    setMessage(`College timetable scope set to ${degreeNameMap.get(collegeTimetableDegreeId) || collegeTimetableDegreeId}`);
  };

  const applyMcaWeeklyPreset = (): void => {
    const mcaDegree = degrees.find((degree) => degree.code.toUpperCase().includes('MCA') || degree.name.toUpperCase().includes('MCA'));
    if (!mcaDegree) {
      setError('MCA degree not found in degree list');
      return;
    }

    setCollegeTimetableDegreeId(mcaDegree.id);
    setForm((prev) => ({
      ...prev,
      degreeSelection: mcaDegree.id,
      mode: 'WEEKLY',
      section: 'ALL',
    }));
    setWeeklyDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
    setMessage(`MCA weekly college timetable preset selected: ${mcaDegree.name}`);
  };

  const visibleEntries = useMemo(() => {
    if (form.degreeSelection === 'ALL_DEGREES') {
      return entries;
    }
    return entries.filter((entry) => entry.degreeId === form.degreeSelection);
  }, [entries, form.degreeSelection]);

  const visibleEntryIds = useMemo(() => visibleEntries.map((entry) => entry.id), [visibleEntries]);

  const allVisibleSelected = visibleEntryIds.length > 0 && visibleEntryIds.every((id) => selectedEntryIds.includes(id));

  const toggleEntrySelection = (entryId: string): void => {
    setSelectedEntryIds((current) =>
      current.includes(entryId) ? current.filter((id) => id !== entryId) : [...current, entryId],
    );
  };

  const toggleSelectVisible = (): void => {
    setSelectedEntryIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleEntryIds.includes(id))
        : Array.from(new Set([...current, ...visibleEntryIds])),
    );
  };

  const exportCsv = (onlySelected: boolean): void => {
    const exportRows = onlySelected
      ? entries.filter((entry) => selectedEntryIds.includes(entry.id))
      : visibleEntries;

    if (exportRows.length === 0) {
      setError('No timetable rows available for export');
      return;
    }

    const csv = buildCsv(exportRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = onlySelected ? 'selected_timetable.csv' : 'timetable_export.csv';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setMessage(`Exported ${exportRows.length} timetable row(s) to CSV.`);
  };

  const importCsv = async (file: File): Promise<void> => {
    const text = await file.text();
    const records = parseCsv(text);

    if (records.length === 0) {
      throw new Error('CSV file is empty');
    }

    const payloads = records.map((record) => {
      const degreeId = record.degreeId || bulkTargetDegreeId;
      if (!degreeId) {
        throw new Error('CSV must include degreeId or you must choose a target degree before import');
      }

      return {
        degreeId,
        day: (record.day || 'MONDAY').toUpperCase(),
        subject: record.subject || 'Untitled',
        startTime: record.startTime || '09:00',
        endTime: record.endTime || '10:00',
        room: record.room || '-',
        type: (record.type || 'LECTURE').toUpperCase(),
        section: (record.section || bulkTargetSection || 'ALL').toUpperCase(),
      };
    });

    await Promise.all(payloads.map((payload) => apiClient.createTimetableEntry(payload)));
  };

  const handleImportButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await importCsv(file);
      setMessage('CSV imported successfully.');
      await loadData();
    } catch (importError: unknown) {
      const err = importError as { message?: string };
      setError(err.message || 'Could not import CSV');
    } finally {
      setSubmitting(false);
      event.target.value = '';
    }
  };

  const copySelectedToDegree = async (): Promise<void> => {
    if (selectedEntryIds.length === 0) {
      setError('Select at least one timetable row to copy');
      return;
    }

    if (!bulkTargetDegreeId) {
      setError('Choose a target degree to copy timetable rows');
      return;
    }

    const sourceRows = entries.filter((entry) => selectedEntryIds.includes(entry.id));
    const payloads = sourceRows.map((entry) => ({
      degreeId: bulkTargetDegreeId,
      day: entry.day,
      subject: entry.subject,
      startTime: parseTimeRange(entry.time).startTime,
      endTime: parseTimeRange(entry.time).endTime,
      room: entry.room || '-',
      type: entry.type,
      section: bulkTargetSection.trim() || readSection(entry),
    }));

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await Promise.all(payloads.map((payload) => apiClient.createTimetableEntry(payload)));
      setMessage(`Copied ${payloads.length} timetable row(s) to ${degreeNameMap.get(bulkTargetDegreeId) || bulkTargetDegreeId}.`);
      setSelectedEntryIds([]);
      await loadData();
    } catch (copyError: unknown) {
      const err = copyError as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Could not copy timetable rows');
    } finally {
      setSubmitting(false);
    }
  };

  const duplicateVisibleWeekToDegree = async (): Promise<void> => {
    if (visibleEntries.length === 0) {
      setError('No timetable rows available to duplicate');
      return;
    }

    if (!bulkTargetDegreeId) {
      setError('Choose a target degree to duplicate the week');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const payloads = visibleEntries.map((entry) => ({
        degreeId: bulkTargetDegreeId,
        day: entry.day,
        subject: entry.subject,
        startTime: parseTimeRange(entry.time).startTime,
        endTime: parseTimeRange(entry.time).endTime,
        room: entry.room || '-',
        type: entry.type,
        section: bulkTargetSection.trim() || readSection(entry),
      }));

      await Promise.all(payloads.map((payload) => apiClient.createTimetableEntry(payload)));
      setMessage(`Duplicated ${payloads.length} timetable row(s) to ${degreeNameMap.get(bulkTargetDegreeId) || bulkTargetDegreeId}.`);
      await loadData();
    } catch (duplicateError: unknown) {
      const err = duplicateError as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Could not duplicate timetable week');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (entry: TimetableRow): void => {
    const { startTime, endTime } = parseTimeRange(entry.time);
    setEditingId(entry.id);
    setForm({
      mode: 'SINGLE_DAY',
      degreeSelection: entry.degreeId,
      section: readSection(entry),
      day: entry.day,
      startTime,
      endTime,
      type: entry.type as TimetableType,
      subject: entry.subject,
      room: entry.room || '',
    });
    setWeeklyDays([entry.day]);
    setMessage('Editing mode enabled');
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setForm({
      mode: 'SINGLE_DAY',
      degreeSelection: 'ALL_DEGREES',
      section: 'ALL',
      day: 'MONDAY',
      startTime: '09:00',
      endTime: '10:00',
      type: 'LECTURE',
      subject: '',
      room: '',
    });
    setWeeklyDays(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
    setMessage('');
  };

  const removeEntry = async (entry: TimetableRow): Promise<void> => {
    const confirmed = window.confirm(`Delete timetable entry for ${entry.subject} on ${entry.day}?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiClient.deleteTimetableEntry(entry.id);
      setMessage('Timetable entry deleted successfully.');
      if (editingId === entry.id) {
        cancelEdit();
      }
      await loadData();
    } catch (deleteError: unknown) {
      const err = deleteError as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Could not delete timetable entry');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">
      <div className="mb-6 rounded-2xl border border-[#ece6df] bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <CalendarPlus size={24} className="text-orange-500" />
          Timetable Management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add timetable for one degree or all degrees, with section-level control and break type selection.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-[#ece6df] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                College Timetable Degree
              </label>
              <select
                title="College Timetable Degree"
                value={collegeTimetableDegreeId}
                onChange={(event) => setCollegeTimetableDegreeId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select degree for weekly college timetable</option>
                {degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name} ({degree.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current Selection
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {collegeTimetableDegreeName}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={applyCollegeTimetableDegree}
                className="w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Apply as College Timetable
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={applyMcaWeeklyPreset}
            className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
          >
            Set MCA Weekly Preset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#ece6df] bg-white p-6 shadow-sm">
            {editingId ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                Editing existing timetable entry. Changes will update this row only.
                <button type="button" onClick={cancelEdit} className="ml-2 font-semibold underline">
                  Cancel edit
                </button>
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Degree Selection</label>
              <div className="mb-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, mode: 'SINGLE_DAY' }))}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    form.mode === 'SINGLE_DAY'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Single Day
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, mode: 'WEEKLY' }))}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    form.mode === 'WEEKLY'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Weekly Mode
                </button>
              </div>

              <select
                id="timetable-degree-selection"
                title="Degree Selection"
                value={form.degreeSelection}
                onChange={(event) => setForm((prev) => ({ ...prev, degreeSelection: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              >
                <option value="ALL_DEGREES">All Degrees</option>
                {degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name} ({degree.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Section</label>
              <input
                id="timetable-section-selection"
                title="Section Selection"
                value={form.section}
                onChange={(event) => setForm((prev) => ({ ...prev, section: event.target.value }))}
                list="section-suggestions"
                placeholder="ALL or D2527"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
              <datalist id="section-suggestions">
                {SECTION_OPTIONS.map((section) => (
                  <option key={section} value={section} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Day</label>
                <select
                  id="timetable-day-selection"
                  title="Day Selection"
                  value={form.day}
                  onChange={(event) => setForm((prev) => ({ ...prev, day: event.target.value }))}
                  disabled={form.mode === 'WEEKLY'}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Type</label>
                <select
                  id="timetable-type-selection"
                  title="Type Selection"
                  value={form.type}
                  onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as TimetableType }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.mode === 'WEEKLY' && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Weekly Days</label>
                <div className="grid grid-cols-3 gap-2">
                  {DAYS.map((day) => {
                    const selected = weeklyDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setWeeklyDays((prev) =>
                            prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
                          );
                        }}
                        className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                          selected
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-300 text-slate-700'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Start Time</label>
                <input
                  id="timetable-start-time"
                  title="Start Time"
                  type="time"
                  value={form.startTime}
                  onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">End Time</label>
                <input
                  id="timetable-end-time"
                  title="End Time"
                  type="time"
                  value={form.endTime}
                  onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                {isBreakType ? 'Break Label' : 'Subject'}
              </label>
              <input
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                placeholder={isBreakType ? 'Lunch Break / Commute Break' : 'Data Structures'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Room / Location</label>
              <input
                value={form.room}
                onChange={(event) => setForm((prev) => ({ ...prev, room: event.target.value }))}
                placeholder={isBreakType ? 'Campus Cafeteria / Commute' : 'A-204'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Timetable Entry' : 'Save Timetable Entry'}
            </button>

            {message ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 size={16} /> {message}
              </div>
            ) : null}

            {error ? (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} /> {error}
              </div>
            ) : null}
          </form>
        </div>

        <div className="xl:col-span-3 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#ece6df] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Entries</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{visibleEntries.length}</p>
            </div>
            <div className="rounded-xl border border-[#ece6df] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Break Slots</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {visibleEntries.filter((entry) => entry.type.toUpperCase().includes('BREAK')).length}
              </p>
            </div>
            <div className="rounded-xl border border-[#ece6df] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sections Covered</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {new Set(visibleEntries.map((entry) => readSection(entry))).size}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece6df] bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Copy to Degree</label>
                <select
                  title="Copy to Degree"
                  value={bulkTargetDegreeId}
                  onChange={(event) => setBulkTargetDegreeId(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select target degree</option>
                  {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name} ({degree.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target Section</label>
                <input
                  value={bulkTargetSection}
                  onChange={(event) => setBulkTargetSection(event.target.value)}
                  list="section-suggestions"
                  placeholder="ALL or D2527"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => exportCsv(false)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Export Visible CSV
                </button>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleImportButtonClick}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Import CSV
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  title="Import CSV File"
                  className="hidden"
                  onChange={(event) => void handleImportChange(event)}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectVisible}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {allVisibleSelected ? 'Unselect Visible' : 'Select Visible'}
              </button>
              <button
                type="button"
                onClick={() => exportCsv(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Export Selected CSV
              </button>
              <button
                type="button"
                onClick={() => void copySelectedToDegree()}
                disabled={submitting}
                className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Copy Selected to Degree
              </button>
              <button
                type="button"
                onClick={() => void duplicateVisibleWeekToDegree()}
                disabled={submitting}
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Duplicate Week to Degree
              </button>
              <span className="text-xs text-slate-500">Selected: {selectedEntryIds.length}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece6df] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Current Timetable Entries</h2>
              <button
                onClick={() => void loadData()}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Loading timetable...</p>
            ) : visibleEntries.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No timetable entries found for selected scope.</p>
            ) : (
              <div className="max-h-[520px] overflow-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="w-10 px-3 py-2">
                        <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectVisible} aria-label="Select visible timetable rows" />
                      </th>
                      <th className="px-3 py-2">Degree</th>
                      <th className="px-3 py-2">Section</th>
                      <th className="px-3 py-2">Day</th>
                      <th className="px-3 py-2">Time</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Subject / Label</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEntries.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 align-top">
                          <input
                            type="checkbox"
                            checked={selectedEntryIds.includes(entry.id)}
                            onChange={() => toggleEntrySelection(entry.id)}
                            aria-label={`Select timetable row for ${entry.subject}`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 text-slate-700">
                            <Building2 size={13} className="text-slate-400" />
                            {entry.degreeName || degreeNameMap.get(entry.degreeId) || entry.degreeId}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                            <Layers3 size={12} /> {readSection(entry)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700">{entry.day}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 text-slate-700">
                            <Clock3 size={12} className="text-slate-400" />
                            {entry.time}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700">{entry.type}</td>
                        <td className="px-3 py-2 font-medium text-slate-800">{entry.subject}</td>
                        <td className="px-3 py-2 text-slate-600">{entry.room || '-'}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void removeEntry(entry)}
                              className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
