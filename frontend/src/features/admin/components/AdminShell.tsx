'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Circle,
  GraduationCap,
  LayoutGrid,
  Library,
  LogOut,
  FileText,
  MessageSquare,
  PenSquare,
  ScrollText,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdminStore } from '@/store/admin';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/subjects', label: 'Subjects', icon: PenSquare },
  { href: '/admin/exams', label: 'Exams', icon: FileText },
  { href: '/admin/topics', label: 'Topics', icon: ScrollText },
  { href: '/admin/study-plans', label: 'Study Plan', icon: Briefcase },
  { href: '/admin/progress', label: 'Progress', icon: Library },
  { href: '/admin/add-student', label: 'Add Student', icon: User },
  { href: '/admin/add-degree', label: 'Add Degree', icon: GraduationCap },
  { href: '/admin/message', label: 'Send Message', icon: MessageSquare },
  { href: '/admin/messages', label: 'Message History', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

const miniRailItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/subjects', label: 'Subjects', icon: PenSquare },
  { href: '/admin/exams', label: 'Exams', icon: CalendarDays },
  { href: '/admin/progress', label: 'Progress', icon: TrendingUp },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

const isRouteActive = (pathname: string, href: string): boolean => {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const AdminShell = ({ children }: { children: ReactNode }): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  const searchQuery = useAdminStore((state) => state.searchQuery);
  const setSearchQuery = useAdminStore((state) => state.setSearchQuery);

  const logout = (): void => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
      <div className="h-screen overflow-hidden bg-[#f7f5f2]">
        <div className="flex h-screen">
          <aside className="sticky top-0 flex h-screen w-[54px] flex-shrink-0 flex-col items-center bg-gradient-to-b from-[#151c2a] via-[#1d2941] to-[#111827] py-3 shadow-xl">
            <div className="relative mb-8 h-9 w-9 overflow-hidden rounded-full border border-white/35 bg-white">
              <Image src="/brain-logo.png" alt="Lovely Professional University logo" fill sizes="36px" className="object-cover" />
            </div>

            <nav className="flex flex-1 flex-col items-center gap-7">
              {miniRailItems.map(({ href, label, icon: Icon }) => {
                const active = isRouteActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative rounded-lg p-1.5 transition ${
                      active ? 'text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="pointer-events-none absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <aside className="sticky top-0 flex h-screen w-[260px] flex-shrink-0 flex-col border-r border-[#ebe6df] bg-[#f7f5f2] px-3 py-3 shadow-lg">
            <div className="mb-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-300 bg-white">
                  <Image src="/brain-logo.png" alt="Lovely Professional University logo" fill sizes="36px" className="object-cover" />
                </div>
                <h1 className="text-[17px] leading-none font-semibold tracking-tight text-slate-800">Study Planner</h1>
              </div>
              <Circle size={4} className="text-transparent" aria-hidden="true" />
            </div>

            <div className="mb-3 border-b border-[#ece7e0]" />

            <div className="mb-3 rounded-xl border border-[#e5dfd7] bg-white/95 px-2.5 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-orange-200 bg-orange-50 p-1 text-orange-500">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-base font-semibold leading-none text-slate-800">Admin</p>
                  <p className="mt-1 text-xs text-slate-500">1259155056</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isRouteActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-base font-medium transition-all duration-300 ${
                      active
                        ? 'bg-orange-50 text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:translate-x-[2px] hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {active && label === 'Study Plan' ? (
                      <span className="absolute -left-3 h-9 w-1 rounded-r bg-[#ff8c00]" />
                    ) : null}
                    <Icon size={16} className={active ? 'text-[#ff8c00]' : 'text-slate-500 group-hover:text-slate-700'} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 rounded-xl border border-[#ebe6df] bg-white px-3 py-2 shadow-sm">
              <button className="flex w-full items-center justify-between text-sm font-medium text-[#ff8c00]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-xs">✨</span>
                  Upgrade to Pro
                </span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>
            </div>

            <div className="mt-auto rounded-xl bg-gradient-to-r from-[#ff9e27] to-[#ff8c00] p-[1px] shadow-md">
              <button className="flex w-full items-center justify-between rounded-[11px] bg-gradient-to-r from-[#ff9e27] to-[#ff8c00] px-4 py-3 text-base font-semibold text-white">
                <span className="inline-flex items-center gap-2 text-base">
                  <span className="text-sm">✨</span>
                  Upgrade to Pro
                </span>
                <span aria-hidden="true">›</span>
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadfdf] bg-white py-2 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <LogOut size={16} className="text-red-500" />
                Logout
              </button>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="sticky top-0 z-30 border-b border-[#e9e4de] bg-[#f7f5f2]/95 px-4 py-3 backdrop-blur-sm md:px-6">
              <div className="flex items-center gap-3">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search students, exams, subjects..."
                  className="w-full max-w-2xl rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-[#ff8c00]"
                />

                <button
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600"
                  title="Open notifications"
                  aria-label="Open notifications"
                >
                  <Bell size={16} />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
