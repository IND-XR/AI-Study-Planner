'use client';

import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

export default function NotificationsPage(): JSX.Element {
  const { notifications, markNotificationRead, settings, saveSettings } = useDashboardStore((state) => ({
    notifications: state.notifications,
    markNotificationRead: state.markNotificationRead,
    settings: state.settings,
    saveSettings: state.saveSettings,
  }));

  return (
    <div className="space-y-4">
      <SectionCard title="Intelligent Notifications" subtitle="Smart reminders, deadlines, urgent exam alerts, announcements">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(event) => void saveSettings({ notificationsEnabled: event.target.checked })}
            />
            In-app notifications
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.emailNotificationsEnabled}
              onChange={(event) => void saveSettings({ emailNotificationsEnabled: event.target.checked })}
            />
            Email notifications
          </label>
        </div>

        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`rounded-xl border px-3 py-3 text-sm ${
                notification.read
                  ? 'border-slate-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800/50'
                  : 'border-primary-300 bg-primary-50 dark:border-primary-900/50 dark:bg-primary-900/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{notification.title}</p>
                <button
                  onClick={() => markNotificationRead(notification.id)}
                  className="text-xs text-primary-700 underline dark:text-primary-300"
                >
                  Mark read
                </button>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{notification.message}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
