

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient } from '@/api/client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Book, Calendar, Trophy, Zap } from 'lucide-react';

interface DashboardStats {
  totalSubjects: number;
  upcomingExams: number;
  activeStudyPlan: boolean;
  weeklyProgress: number;
}

interface ChartData {
  day: string;
  hours: number;
  topics: number;
}

const mockWeeklyData: ChartData[] = [
  { day: 'Mon', hours: 3, topics: 5 },
  { day: 'Tue', hours: 4, topics: 7 },
  { day: 'Wed', hours: 3, topics: 6 },
  { day: 'Thu', hours: 5, topics: 9 },
  { day: 'Fri', hours: 2, topics: 4 },
  { day: 'Sat', hours: 6, topics: 10 },
  { day: 'Sun', hours: 4, topics: 8 },
];

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    upcomingExams: 0,
    activeStudyPlan: false,
    weeklyProgress: 0,
  });





  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <ProtectedRoute requiredRole="STUDENT">

      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome {user?.name || 'Student'} 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Your personal AI study companion for LPU exams
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalSubjects}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Book size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Exams</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.upcomingExams}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Study Plan</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {stats.activeStudyPlan ? 'Active' : 'None'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Zap size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Weekly Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.weeklyProgress}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Trophy size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Charts (UNCHANGED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Study Hours
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Topics Covered Per Day
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="topics" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </ProtectedRoute >
  );
}

