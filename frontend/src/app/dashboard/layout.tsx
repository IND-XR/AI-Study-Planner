'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Home, Book, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">StudyAI</h1>
          <p className="text-xs text-gray-500 mt-1">For LPU Students</p>
        </div>

        <nav className="p-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/subjects"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
          >
            <Book size={20} />
            <span>Subjects</span>
          </Link>

          <Link
            href="/dashboard/exams"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
          >
            <Calendar size={20} />
            <span>Exams</span>
          </Link>

          <Link
            href="/dashboard/study-plans"
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
          >
            <TrendingUp size={20} />
            <span>Study Plans</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 w-64 bg-white">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-2">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
