'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  ListChecks,
  LogOut,
  Mail,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDashboardStore } from '@/store/dashboard';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/dashboard/exams', label: 'Exams', icon: CalendarDays },
  { href: '/dashboard/planner', label: 'Study Plan', icon: Sparkles },
  { href: '/dashboard/analytics', label: 'Progress', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/tasks', label: 'Daily Tasks', icon: ListChecks },
  { href: '/dashboard/subscription', label: 'Degree', icon: GraduationCap },
  { href: '/dashboard/messages', label: 'Messages', icon: Mail },
  { href: '/dashboard/upgrade', label: 'Upgrade to Pro', icon: Sparkles, isUpgrade: true },
];

const isRouteActive = (pathname: string, href: string): boolean => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

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
  const degreeName = profile?.course || profile?.degree || 'BTECH';
  const degreeCode = profile?.degree || 'N/A';
  const showDegreeCode = Boolean(profile?.course && profile?.degree && profile.course !== profile.degree);

  const logout = (): void => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-[#eef2f7] text-slate-900 dark:bg-neutral-950 dark:text-slate-100">
          <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-[#ebe3da] bg-gradient-to-b from-[#f8f5f1] to-[#f4f1ed] px-4 py-4 lg:flex">
            <div className="mb-4 border-b border-[#e7dfd6] pb-4">
              <p className="text-[26px] leading-none font-semibold text-slate-800">Study Planner</p>
            </div>

            <div className="mb-4 rounded-xl border border-[#e6dfd6] bg-[#f7f3ee] p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.name ?? 'Student'}</p>
                  <p className="text-xs text-slate-500">
                    {degreeName}
                    {showDegreeCode ? ` (${degreeCode})` : ''} • Sem {profile?.semester ?? 1}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Enroll:</span>{' '}
                  {profile?.enrollmentNumber ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Section:</span>{' '}
                  {profile?.department ?? 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Degree:</span>{' '}
                  {degreeName}
                  {/* {showDegreeCode ? ` (${degreeCode})` : ''} */}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Role:</span>{' '}
                  {profile?.role ?? 'STUDENT'}
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1.5">
                {navigation.map(({ href, label, icon: Icon, isUpgrade }) => {
                  const active = isRouteActive(pathname, href);
                  if (isUpgrade) {
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-orange-500 bg-white/90 border border-orange-200 shadow hover:bg-orange-100 transition-all"
                        >
                          <Icon size={16} className="text-orange-400" />
                          {label}
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto text-orange-400"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                        }`}
                      >
                        {active ? <span className="absolute -left-4 h-7 w-1 rounded-full bg-[#ff8c00]" /> : null}
                        <Icon size={16} className={active ? 'text-[#ff8c00]' : 'text-slate-500'} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </aside>

          <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
            <header className="sticky top-0 z-30 border-b border-[#dbe1ea] bg-[#eef2f7]/95 px-4 py-3 backdrop-blur md:px-6">
              <div className="flex items-center justify-between gap-3">
                <input
                  className="w-full rounded-xl border border-[#d4dae5] bg-[#f5f7fb] px-4 py-2.5 text-sm outline-none transition focus:border-primary-500"
                  placeholder="Search tasks, subjects, exams..."
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="rounded-lg border border-[#d4dae5] bg-white p-2"
                    aria-label="toggle theme"
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>

                  <Link
                    href="/dashboard/notifications"
                    className="relative rounded-lg border border-[#d4dae5] bg-white p-2"
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

            <main className="flex-1 overflow-x-hidden px-4 py-5 md:px-6">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
