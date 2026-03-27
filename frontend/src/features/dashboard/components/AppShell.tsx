'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CreditCard,
  Home,
  ListChecks,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDashboardStore } from '@/store/dashboard';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/dashboard/planner', label: 'Study Plan', icon: Sparkles },
  { href: '/dashboard/exams', label: 'Exams', icon: CalendarDays },
  { href: '/dashboard/tasks', label: 'Daily Tasks', icon: ListChecks },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const AppShell = ({ children }: AppShellProps): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  const profile = useDashboardStore((state) => state.profile);
  const settings = useDashboardStore((state) => state.settings);
  const unread = useDashboardStore(
    (state) => state.notifications.filter((notification) => !notification.read).length,
  );
  const setTheme = useDashboardStore((state) => state.setTheme);

  const isDark = settings.theme === 'dark';

  const logout = (): void => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className={isDark ? 'dark' : ''}>
        <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-neutral-950 dark:text-slate-100">
          <aside className="hidden w-72 border-r border-slate-200 bg-white/90 p-5 dark:border-neutral-800 dark:bg-neutral-900 lg:block">
            <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
              <p className="text-sm opacity-90">AI Study Planner</p>
              <p className="text-lg font-semibold">{profile?.name ?? 'Student'}</p>
              <p className="text-xs opacity-80">
                {profile?.degree ?? 'BTECH'} • Semester {profile?.semester ?? 1}
              </p>
            </div>

            <nav className="mt-6 space-y-1">
              {navigation.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </aside>

          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 md:px-6">
              <div className="flex items-center justify-between gap-3">
                <input
                  className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-800"
                  placeholder="Search tasks, subjects, exams..."
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="rounded-lg border border-slate-200 p-2 dark:border-neutral-700"
                    aria-label="toggle theme"
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>

                  <Link
                    href="/dashboard/notifications"
                    className="relative rounded-lg border border-slate-200 p-2 dark:border-neutral-700"
                  >
                    <Bell size={16} />
                    {unread > 0 ? (
                      <span className="absolute -right-1 -top-1 rounded-full bg-primary-500 px-1.5 text-[10px] text-white">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
