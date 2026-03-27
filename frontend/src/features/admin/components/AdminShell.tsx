'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Crown,
  GraduationCap,
  Home,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/degrees', label: 'Degrees', icon: GraduationCap },
  { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/admin/exams', label: 'Exams', icon: CalendarDays },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/study-plans', label: 'Study Plans', icon: Sparkles },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Crown },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminShell = ({ children }: { children: ReactNode }): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  const logout = (): void => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
      <div className="flex min-h-screen bg-slate-100 dark:bg-neutral-950">
        <aside className="w-72 border-r border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
            <p className="text-sm opacity-90">Study Planner SaaS</p>
            <p className="text-xl font-bold">Admin Console</p>
            <p className="text-xs opacity-80">College & system control center</p>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
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
                  <Icon size={17} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
            <input
              className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200"
              placeholder="Search students, exams, degrees..."
            />
            <button className="ml-3 rounded-lg border border-slate-200 p-2 dark:border-neutral-700 dark:text-slate-200">
              <span className="sr-only">Open notifications</span>
              <Bell size={16} />
            </button>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
