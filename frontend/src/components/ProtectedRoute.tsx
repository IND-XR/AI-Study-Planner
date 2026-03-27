'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          router.replace('/auth/login');
          return;
        }

        const user = JSON.parse(userStr);
        const role = user?.role?.toUpperCase();

        const requiredRoles = Array.isArray(requiredRole) ? requiredRole : requiredRole ? [requiredRole] : [];

        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
          router.replace(role === 'ADMIN' ? '/admin' : '/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (e) {
        localStorage.clear();
        router.replace('/auth/login');
      } finally {
        setChecked(true);
      }
    };

    checkAuth();
  }, [router, requiredRole]); // ✅ FIXED

  if (!checked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>;
  };

  return <>{children}</>;
}
