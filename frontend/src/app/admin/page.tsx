'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { use } from 'passport';

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, loadUser } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadUser(); // ✅ Ensure user is loaded on mount  
  },[]);

  useEffect(() => {
    // ✅ Wait for user load
    if (user === null) return;

    // ✅ FIX: role uppercase
    if (user.role !== 'ADMIN') {
      router.replace('/dashboard');
      return;
    }

    setIsReady(true);
  }, [user, router]);

  const handleLogout = () => {
    logout();
    setIsReady(false);
    router.replace('/auth/login');
  };

  // ⏳ Prevent flicker
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading Admin Panel...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">  
       logging out // Please log in to access the admin panel.
      </div>
    );
  }


  return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black">

        {/* Header */}
        <header className="bg-black/50 border-b border-orange-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                ⚙️
              </div>
              <h1 className="text-2xl font-bold text-white">
                Admin Dashboard
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 py-8">

          {/* Welcome */}
          <div className="bg-white/10 backdrop-blur-sm border border-orange-500/30 p-8 rounded-2xl mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome,{user?.name}! 👋
            </h2>
            <p className="text-gray-300">
              Admin ID: {user?.enrollmentNumber}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Students */}
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 p-6 rounded-xl hover:border-orange-500/50 transition-all cursor-pointer group">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Manage Students
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Add, edit, or remove students
              </p>
              <button className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors">
                Go to Students
              </button>
            </div>

            {/* Subjects */}
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 p-6 rounded-xl hover:border-orange-500/50 transition-all cursor-pointer group">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Manage Subjects
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Update course subjects
              </p>
              <button className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors">
                Go to Subjects
              </button>
            </div>

            {/* Exams */}
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 p-6 rounded-xl hover:border-orange-500/50 transition-all cursor-pointer group">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Manage Exams
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Schedule and manage exams
              </p>
              <button className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors">
                Go to Exams
              </button>
            </div>

            {/* Analytics */}
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 p-6 rounded-xl hover:border-orange-500/50 transition-all cursor-pointer group">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Analytics
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                View system analytics
              </p>
              <button className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg transition-colors">
                View Analytics
              </button>
            </div>

          </div>

          {/* Info */}
          <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 p-6 rounded-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              ℹ️ Admin Features Coming Soon
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>✅ Student Management</li>
              <li>✅ Subject Management</li>
              <li>✅ Exam Scheduling</li>
              <li>✅ Analytics Dashboard</li>
              <li>✅ Reports</li>
              <li>✅ Settings</li>
            </ul>
          </div>

        </main>
      </div>
  );
}
