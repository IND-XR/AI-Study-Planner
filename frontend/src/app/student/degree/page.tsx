'use client';

import { useAuthStore } from '@/store/auth';

export default function StudentDegreePage(): JSX.Element {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Degree Information</h1>
      <p className="mt-2 text-sm text-slate-600">View your enrolled program and semester details.</p>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">Program: <span className="font-semibold">{user?.course || 'N/A'}</span></p>
        <p className="mt-1 text-sm text-slate-700">Semester: <span className="font-semibold">{user?.semester || 'N/A'}</span></p>
      </div>
    </div>
  );
}
