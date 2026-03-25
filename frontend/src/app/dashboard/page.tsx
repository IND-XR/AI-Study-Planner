// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { apiClient } from '@/api/client';

// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// import { Book, Calendar, Trophy, Zap } from 'lucide-react';
// import router from 'next/dist/shared/lib/router/router';

// interface DashboardStats {
//   totalSubjects: number;
//   upcomingExams: number;
//   activeStudyPlan: boolean;
//   weeklyProgress: number;
// }

// interface ChartData {
//   day: string;
//   hours: number;
//   topics: number;
// }

// const mockWeeklyData: ChartData[] = [
//   { day: 'Mon', hours: 3, topics: 5 },
//   { day: 'Tue', hours: 4, topics: 7 },
//   { day: 'Wed', hours: 3, topics: 6 },
//   { day: 'Thu', hours: 5, topics: 9 },
//   { day: 'Fri', hours: 2, topics: 4 },
//   { day: 'Sat', hours: 6, topics: 10 },
//   { day: 'Sun', hours: 4, topics: 8 },
// ];

// export default function DashboardPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalSubjects: 0,
//     upcomingExams: 0,
//     activeStudyPlan: false,
//     weeklyProgress: 0,
//   });

//   // ✅ AUTH + USER FETCH
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');

//         if (!token) {
//           router.push('/auth/login');
//           return;
//         }

//         const res = await fetch('http://localhost:3000/users/me', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           router.push('/auth/login');
//           return;
//         }

//         setUser(data);

//         // ✅ ROLE CHECK (IMPORTANT)
//         if (data.role !== 'STUDENT') {
//           router.push('/admin');
//         }

//       } catch (error) {
//         console.error('User fetch failed:', error);
//         router.push('/auth/login');
//       }
      
//     };
    

//     fetchUser();
//   }, [router]);
//   useEffect(() => {
//   fetchStats();   ✅ (inside define)
// }, []);

//   // ✅ STATS FETCH
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const subjectsRes = await apiClient.getSubjects();
//         const examsRes = await apiClient.getUpcomingExams();
//         const studyPlanRes = await apiClient.getActiveStudyPlan();

//         setStats({
//           totalSubjects: subjectsRes.data.data.length,
//           upcomingExams: examsRes.data.data.length,
//           activeStudyPlan: !!studyPlanRes.data.data,
//           weeklyProgress: 72,
//         });
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);


// // ✅ YAHAN ADD KARNA HAI
// const logout = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('user');
//     router.push('/auth/login');
// };
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { apiClient } from '@/api/client';

// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// import { Book, Calendar, Trophy, Zap } from 'lucide-react';

// interface DashboardStats {
//   totalSubjects: number;
//   upcomingExams: number;
//   activeStudyPlan: boolean;
//   weeklyProgress: number;
// }

// interface ChartData {
//   day: string;
//   hours: number;
//   topics: number;
// }

// const mockWeeklyData: ChartData[] = [
//   { day: 'Mon', hours: 3, topics: 5 },
//   { day: 'Tue', hours: 4, topics: 7 },
//   { day: 'Wed', hours: 3, topics: 6 },
//   { day: 'Thu', hours: 5, topics: 9 },
//   { day: 'Fri', hours: 2, topics: 4 },
//   { day: 'Sat', hours: 6, topics: 10 },
//   { day: 'Sun', hours: 4, topics: 8 },
// ];

// export default function DashboardPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalSubjects: 0,
//     upcomingExams: 0,
//     activeStudyPlan: false,
//     weeklyProgress: 0,
//   });

//   // ✅ AUTH + USER FETCH
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');

//         if (!token) {
//           router.push('/auth/login');
//           return;
//         }

//         const res = await fetch('http://localhost:3000/users/me', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           router.push('/auth/login');
//           return;
//         }

//         setUser(data);

//         // ✅ ROLE CHECK
//         if (data.role !== 'STUDENT') {
//           router.push('/admin');
//         }

//       } catch (error) {
//         console.error('User fetch failed:', error);
//         router.push('/auth/login');
//       }
//     };

//     fetchUser();
//   }, [router]);

//   // ✅ STATS FETCH (ONLY ONE USEEFFECT)
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const subjectsRes = await apiClient.getSubjects();
//         const examsRes = await apiClient.getUpcomingExams();
//         const studyPlanRes = await apiClient.getActiveStudyPlan();

//         setStats({
//           totalSubjects: subjectsRes.data.data.length,
//           upcomingExams: examsRes.data.data.length,
//           activeStudyPlan: !!studyPlanRes.data.data,
//           weeklyProgress: 72,
//         });
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   // ✅ LOGOUT (PERFECT)
//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     router.push('/auth/login');
//   };

//   return (
//     <ProtectedRoute>
//      <div className="space-y-8">

//         {/* Header + Logout */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900">
//               Welcome {user?.name || 'Student'} 👋
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Your personal AI study companion for LPU exams
//             </p>
//           </div>

//           <button
//             onClick={logout}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">
//                   {stats.totalSubjects}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Book size={24} className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Upcoming Exams</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">
//                   {stats.upcomingExams}
//                 </p>
//               </div>
//               <div className="bg-orange-100 p-3 rounded-lg">
//                 <Calendar size={24} className="text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Study Plan</p>
//                 <p className="text-xl font-bold text-gray-900 mt-2">
//                   {stats.activeStudyPlan ? 'Active' : 'None'}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <Zap size={24} className="text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm font-medium">Weekly Progress</p>
//                 <p className="text-3xl font-bold text-gray-900 mt-2">
//                   {stats.weeklyProgress}%
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <Trophy size={24} className="text-purple-600" />
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//           <div className="bg-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Weekly Study Hours
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={mockWeeklyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="hours" fill="#3b82f6" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Topics Covered Per Day
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={mockWeeklyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="topics" stroke="#10b981" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//         </div>

//       </div>
//     </ProtectedRoute>
//   );
// }

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

  // ✅ AUTH + USER FETCH (IMPROVED)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        // ✅ FAST CHECK (NO API CALL)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (parsedUser?.role !== 'STUDENT') {
            router.push('/admin');
            return;
          }
        }

        // ❌ NO TOKEN
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // ✅ VERIFY WITH BACKEND
        const res = await fetch('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          router.push('/auth/login');
          return;
        }

        // ✅ SAFE RESPONSE HANDLE
        const userData = data?.data || data;

        setUser(userData);

        // ✅ UPDATE LOCAL STORAGE (SYNC)
        localStorage.setItem('user', JSON.stringify(userData));

        // ✅ ROLE CHECK
        if (userData?.role !== 'STUDENT') {
          router.push('/admin');
        }

      } catch (error) {
        console.error('User fetch failed:', error);
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [router]);

  // ✅ STATS FETCH
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const subjectsRes = await apiClient.getSubjects();
        const examsRes = await apiClient.getUpcomingExams();
        const studyPlanRes = await apiClient.getActiveStudyPlan();

        setStats({
          totalSubjects: subjectsRes?.data?.data?.length || 0,
          upcomingExams: examsRes?.data?.data?.length || 0,
          activeStudyPlan: !!studyPlanRes?.data?.data,
          weeklyProgress: 72,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

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
















































// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/auth';
// import { apiClient } from '@/api/client';
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { Book, Calendar, Trophy, Zap } from 'lucide-react';

// interface DashboardStats {
//   totalSubjects: number;
//   upcomingExams: number;
//   activeStudyPlan: boolean;
//   weeklyProgress: number;
// }

// interface ChartData {
//   day: string;
//   hours: number;
//   topics: number;
// }

// const mockWeeklyData: ChartData[] = [
//   { day: 'Mon', hours: 3, topics: 5 },
//   { day: 'Tue', hours: 4, topics: 7 },
//   { day: 'Wed', hours: 3, topics: 6 },
//   { day: 'Thu', hours: 5, topics: 9 },
//   { day: 'Fri', hours: 2, topics: 4 },
//   { day: 'Sat', hours: 6, topics: 10 },
//   { day: 'Sun', hours: 4, topics: 8 },
// ];

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user } = useAuthStore();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalSubjects: 0,
//     upcomingExams: 0,
//     activeStudyPlan: false,
//     weeklyProgress: 0,
//   });

//   // Role-based access control
//   useEffect(() => {
//     if (!user) {
//       router.push('/auth/login');
//     } else if (user.role !== 'student') {
//       router.push('/admin');
//     }
//   }, [user, router]);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const subjectsRes = await apiClient.getSubjects();
//         const examsRes = await apiClient.getUpcomingExams();
//         const studyPlanRes = await apiClient.getActiveStudyPlan();

//         setStats({
//           totalSubjects: subjectsRes.data.data.length,
//           upcomingExams: examsRes.data.data.length,
//           activeStudyPlan: !!studyPlanRes.data.data,
//           weeklyProgress: 72,
//         });
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-4xl font-bold text-gray-900">Welcome to StudyAI</h1>
//         <p className="text-gray-600 mt-2">Your personal AI study companion for LPU exams</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">
//                 {stats.totalSubjects}
//               </p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <Book size={24} className="text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Upcoming Exams</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">
//                 {stats.upcomingExams}
//               </p>
//             </div>
//             <div className="bg-orange-100 p-3 rounded-lg">
//               <Calendar size={24} className="text-orange-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Study Plan</p>
//               <p className="text-xl font-bold text-gray-900 mt-2">
//                 {stats.activeStudyPlan ? 'Active' : 'None'}
//               </p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <Zap size={24} className="text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Weekly Progress</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">
//                 {stats.weeklyProgress}%
//               </p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <Trophy size={24} className="text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Study Hours Chart */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Weekly Study Hours
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={mockWeeklyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Topics Covered Chart */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Topics Covered Per Day
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={mockWeeklyData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="topics"
//                 stroke="#10b981"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Quick Actions
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button className="btn btn-primary text-center py-3">
//             Generate Study Plan
//           </button>
//           <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition">
//             Add New Subject
//           </button>
//           <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition">
//             Schedule Exam
//           </button>
//         </div>
//       </div>

//       {/* LPU Info */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
//         <h3 className="font-semibold text-gray-900 mb-2">
//           LPU Exam Calendar Support
//         </h3>
//         <p className="text-sm text-gray-700">
//           StudyAI supports all LPU exam types: CA-1, CA-2, CA-3, Midterm, Endterm,
//           Quiz, Project, and Practical. Create your study plan tailored to your exam
//           schedule and ace your exams! 🎓
//         </p>
//       </div>
//     </div>
//   );
// }
