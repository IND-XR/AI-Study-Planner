'use client';

import { FormEvent, useState } from 'react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function SettingsPage(): JSX.Element {
  const { settings, updateSettings } = useAdminStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));

  const [defaultStudyHours, setDefaultStudyHours] = useState(settings.defaultStudyHours);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    updateSettings({ defaultStudyHours, notificationsEnabled, examPattern: '3_CA_SYSTEM' });
  };

  return (
    <SectionCard title="Admin Settings" subtitle="Default hours, exam pattern, and notification controls">
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Default Study Hours
          <input
            type="number"
            min={1}
            max={12}
            value={defaultStudyHours}
            onChange={(event) => setDefaultStudyHours(Number(event.target.value || 1))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Exam Pattern
          <input
            value="3 CA SYSTEM + MID + END"
            disabled
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(event) => setNotificationsEnabled(event.target.checked)}
          />
          Enable Notifications
        </label>

        <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Save Settings</button>
      </form>
    </SectionCard>
  );
}
