'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Cog,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Mail,
  Menu,
  MessageCircle,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  PenSquare,
  Route,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdminStore } from '@/store/admin';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'admin-shell-sidebar-collapsed';

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
      { href: '/admin/progress', label: 'Progress', icon: TrendingUp },
    ],
  },
  {
    title: 'Academic',
    items: [
      { href: '/admin/degrees', label: 'Degrees', icon: GraduationCap },
      { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
      { href: '/admin/topics', label: 'Topics', icon: ScrollText },
      { href: '/admin/exams', label: 'Exams', icon: CalendarDays },
      { href: '/admin/timetable', label: 'Timetable', icon: Route },
      { href: '/admin/study-plans', label: 'Study Plans', icon: Briefcase },
      { href: '/admin/task-manager', label: 'Task Manager', icon: ClipboardList },
    ],
  },
  {
    title: 'Users',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/students', label: 'Students', icon: User },
      { href: '/admin/add-student', label: 'Add Student', icon: UserPlus },
      { href: '/admin/add-degree', label: 'Add Degree', icon: GraduationCap },
    ],
  },
  {
    title: 'Communication',
    items: [
      { href: '/admin/message', label: 'Send Message', icon: Mail },
      { href: '/admin/messages', label: 'Message History', icon: MessageCircle },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: ShieldCheck },
      { href: '/admin/settings', label: 'Settings', icon: Cog },
    ],
  },
];

const miniRailItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/subjects', label: 'Subjects', icon: PenSquare },
  { href: '/admin/exams', label: 'Exams', icon: CalendarDays },
  { href: '/admin/timetable', label: 'Timetable', icon: Route },
  { href: '/admin/progress', label: 'Progress', icon: TrendingUp },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Cog },
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
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const searchQuery = useAdminStore((state) => state.searchQuery);
  const setSearchQuery = useAdminStore((state) => state.setSearchQuery);

  useEffect(() => {
    const persistedValue = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
    if (persistedValue === 'true') {
      setIsDesktopCollapsed(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(isDesktopCollapsed));
  }, [isDesktopCollapsed]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const logout = (): void => {
    localStorage.clear();
    router.replace('/auth/login');
  };

  const sidebarBaseClass =
    'sticky top-0 z-40 flex h-screen flex-shrink-0 flex-col border-r border-[#ebe6df] bg-[#f7f5f2] py-3 shadow-lg transition-all duration-300';

  const renderSidebarNav = (compact: boolean, isVisible: boolean, onNavigate?: () => void): JSX.Element => (
    <nav className="space-y-3">
      {navSections.map((section, sectionIndex) => (
        <div key={section.title}>
          {!compact ? (
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{section.title}</p>
          ) : null}
          <div className="space-y-1.5">
            {section.items.map(({ href, label, icon: Icon }, itemIndex) => {
              const active = isRouteActive(pathname, href);
              const staggerIndex = sectionIndex * 6 + itemIndex;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={`group relative flex items-center rounded-xl font-medium transition-all duration-300 ${
                    compact ? 'justify-center px-2.5 py-2.5' : 'gap-2.5 px-3 py-2 text-[15px]'
                  } ${
                    active
                      ? 'bg-orange-50 text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:translate-x-[2px] hover:bg-white hover:shadow-sm'
                  } motion-safe:duration-300 motion-safe:ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                  }`}
                  style={{ transitionDelay: `${Math.min(staggerIndex * 28, 260)}ms` }}
                  title={compact ? label : undefined}
                  aria-label={label}
                >
                  {active ? <span className="absolute -left-3 h-8 w-1 rounded-r bg-[#ff8c00]" /> : null}
                  <Icon
                    size={16}
                    className={`${active ? 'text-[#ff8c00]' : 'text-slate-500 group-hover:text-slate-700'} transition-transform duration-300 ${
                      compact ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      compact ? 'max-w-0 opacity-0' : 'max-w-[170px] opacity-100'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const renderSidebarBody = (compact: boolean, isVisible: boolean, onNavigate?: () => void): JSX.Element => (
    <>
      <div className={`mb-3 flex items-center ${compact ? 'justify-center px-1' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-300 bg-white">
            <Image src="/brain-logo.png" alt="Lovely Professional University logo" fill sizes="36px" className="object-cover" />
          </div>
          {!compact ? (
            <h1 className="text-[17px] leading-none font-semibold tracking-tight text-slate-800">Study Planner</h1>
          ) : null}
        </div>
      </div>

      <div className="mb-3 border-b border-[#ece7e0]" />

      {!compact ? (
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
      ) : (
        <div className="mb-3 flex justify-center">
          <div className="rounded-full border border-orange-200 bg-orange-50 p-1 text-orange-500">
            <User size={24} />
          </div>
        </div>
      )}

      {renderSidebarNav(compact, isVisible, onNavigate)}

      {!compact ? (
        <div className="mt-5 rounded-xl border border-[#ebe6df] bg-white px-3 py-2 shadow-sm">
          <button className="flex w-full items-center justify-between text-sm font-medium text-[#ff8c00]">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-xs">✨</span>
              Upgrade to Pro
            </span>
            <ChevronDown size={16} className="text-slate-500" />
          </button>
        </div>
      ) : null}

      <div className="mt-auto">
        {!compact ? (
          <div className="rounded-xl bg-gradient-to-r from-[#ff9e27] to-[#ff8c00] p-[1px] shadow-md">
            <button className="flex w-full items-center justify-between rounded-[11px] bg-gradient-to-r from-[#ff9e27] to-[#ff8c00] px-4 py-3 text-base font-semibold text-white">
              <span className="inline-flex items-center gap-2 text-base">
                <span className="text-sm">✨</span>
                Upgrade to Pro
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}

        <div className="mt-3">
          <button
            onClick={logout}
            className={`flex w-full items-center rounded-xl border border-[#eadfdf] bg-white text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 ${
              compact ? 'justify-center gap-0 py-2.5' : 'justify-center gap-2 py-2'
            }`}
            title={compact ? 'Logout' : undefined}
            aria-label="Logout"
          >
            <LogOut size={16} className="text-red-500" />
            {!compact ? 'Logout' : null}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
      <div className="h-screen overflow-hidden bg-[#f7f5f2]">
        <div className="flex h-screen">
          <aside className="sticky top-0 hidden h-screen w-[54px] flex-shrink-0 flex-col items-center bg-gradient-to-b from-[#151c2a] via-[#1d2941] to-[#111827] py-3 shadow-xl lg:flex">
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

          <aside
            className={`${sidebarBaseClass} hidden lg:flex ${isDesktopCollapsed ? 'w-[88px] px-2' : 'w-[260px] px-3'}`}
          >
            {renderSidebarBody(isDesktopCollapsed, true)}
          </aside>

          {isMobileSidebarOpen ? (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} aria-hidden="true" />
          ) : null}

          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[280px] ${sidebarBaseClass} px-3 lg:hidden ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700"
                aria-label="Close menu"
                title="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            {renderSidebarBody(false, isMobileSidebarOpen, () => setIsMobileSidebarOpen(false))}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="sticky top-0 z-30 border-b border-[#e9e4de] bg-[#f7f5f2]/95 px-4 py-3 backdrop-blur-sm md:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
                  title="Open menu"
                  aria-label="Open menu"
                >
                  <Menu size={16} />
                </button>

                <button
                  onClick={() => setIsDesktopCollapsed((current) => !current)}
                  className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-700 lg:inline-flex"
                  title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isDesktopCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>

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
