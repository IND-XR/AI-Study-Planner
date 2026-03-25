
'use client';


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'STUDENT';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.replace('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userData);

      // Role check
      if (requiredRole && user.role !== requiredRole) {
        if (user.role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
        return;
      }

      setLoading(false); // ✅ allow render
    } catch (err) {
      localStorage.clear();
      router.replace('/auth/login');
    }
  }, [router, requiredRole]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return <>{children}</>;
}
