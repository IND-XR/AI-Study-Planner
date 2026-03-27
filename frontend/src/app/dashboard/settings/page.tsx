'use client';

import { FormEvent, useState } from 'react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

export default function SettingsPage(): JSX.Element {
  const { settings, saveSettings, setTheme } = useDashboardStore((state) => ({
    settings: state.settings,
    saveSettings: state.saveSettings,
    setTheme: state.setTheme,
  }));

  const [dailyGoal, setDailyGoal] = useState(settings.dailyStudyHourGoal);
  const [timezone, setTimezone] = useState(settings.timezone);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void saveSettings({ dailyStudyHourGoal: dailyGoal, timezone });
  };

  return (
    <SectionCard title="Settings & Personalization" subtitle="Theme, preferences, study targets, and schedule controls">
      <form onSubmit={submit} className="space-y-4 text-sm">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Theme Mode</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`rounded-lg px-3 py-2 ${
                settings.theme === 'light'
                  ? 'bg-primary-500 text-white'
                  : 'border border-slate-200 dark:border-neutral-700'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`rounded-lg px-3 py-2 ${
                settings.theme === 'dark'
                  ? 'bg-primary-500 text-white'
                  : 'border border-slate-200 dark:border-neutral-700'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wide text-slate-500">Daily study hour goal</span>
            <input
              type="number"
              min={1}
              max={12}
              value={dailyGoal}
              onChange={(event) => setDailyGoal(Number(event.target.value || 1))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wide text-slate-500">Time zone</span>
            <input
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </label>
        </div>

        <button className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white">Save Settings</button>
      </form>
    </SectionCard>
  );
}
