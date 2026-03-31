'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Crown,
  GraduationCap,
  Home,
  LineChart,
  LogOut,
  Settings,
  Sparkles,
  ListChecks,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: Home },
  { label: 'Subjects', href: '/student/subjects', icon: BookOpen },
  { label: 'Exams', href: '/student/exams', icon: CalendarDays },
  { label: 'Study Plans', href: '/student/study-plans', icon: Sparkles },
  { label: 'Analytics', href: '/student/analytics', icon: LineChart },
  { label: 'Notifications', href: '/student/notifications', icon: Bell },
  { label: 'Settings', href: '/student/settings', icon: Settings },
  { label: 'Task Manager', href: '/student/task-manager', icon: ListChecks },
  { label: 'Degree', href: '/student/degree', icon: GraduationCap },
  { label: 'Subscription', href: '/student/subscription', icon: Crown },
] as const;

const railItems = [
  { href: '/student/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/student/subjects', icon: BookOpen, label: 'Subjects' },
  { href: '/student/exams', icon: CalendarDays, label: 'Exams' },
  { href: '/student/analytics', icon: LineChart, label: 'Analytics' },
  { href: '/student/subscription', icon: Crown, label: 'Subscription' },
] as const;

const isRouteActive = (pathname: string, href: string): boolean => {
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function StudentSidebar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const onLogout = (): void => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <div className="flex h-screen flex-shrink-0">
      <aside className="hidden h-screen w-[54px] flex-col items-center bg-gradient-to-b from-[#151c2a] via-[#1d2941] to-[#111827] py-3 shadow-xl lg:flex">
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/40 bg-white">
          <Image src="/brain-logo.png" alt="Study Planner" fill sizes="36px" className="object-cover" />
        </div>
        <nav className="mt-8 flex flex-1 flex-col items-center gap-5">
          {railItems.map(({ href, icon: Icon, label }) => {
            const active = isRouteActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`rounded-lg p-1.5 transition ${
                  active ? 'bg-orange-500/20 text-orange-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </nav>
      </aside>

      <aside className="relative h-screen w-[260px] border-r border-[#e9e4df] bg-[#f7f5f2] px-3 py-3">
        <div className="mb-4 flex items-center gap-2 border-b border-[#e6e0da] pb-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#d5d0ca] bg-white">
            <Image src="/brain-logo.png" alt="Study Planner" fill sizes="28px" className="object-cover" />
          </div>
          <p className="text-2xl leading-none font-semibold text-slate-800">Study Planner</p>
        </div>

        <div className="mb-4 rounded-xl border border-[#ddd7d0] bg-[#f6f3ef] p-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Student'}</p>
              <p className="text-xs text-slate-500">{user?.enrollmentNumber || '1259155056'}</p>
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
                className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-base transition-all duration-300 ${
                  active
                    ? 'bg-[#fff7ef] text-slate-900'
                    : 'text-slate-600 hover:bg-white hover:shadow-sm hover:shadow-orange-100'
                }`}
              >
                {active ? <span className="absolute -left-3 h-7 w-1 rounded-full bg-[#ff8c00]" /> : null}
                <Icon size={16} className={active ? 'text-[#ff8c00]' : 'text-slate-500'} />
                <span className="text-base leading-none font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 rounded-xl border border-[#e3ddd7] bg-[#f2efeb] p-2.5 text-sm text-slate-600 shadow-sm">
          <p className="text-[#ff8c00]">Need Help?</p>
          <p className="mt-1 text-xs">support@studyplanner.com</p>
          <p className="text-xs">+91 98765 43210</p>
        </div>

        <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#ff9f2f] to-[#ff8c00] px-4 py-3 text-lg leading-none font-semibold text-white shadow-md shadow-orange-200/70 transition hover:brightness-110">
          Upgrade to Pro
        </button>

        <button
          onClick={onLogout}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          <LogOut size={15} /> Logout
        </button>
      </aside>
    </div>
  );
}
