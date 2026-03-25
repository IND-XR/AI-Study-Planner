'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requiredRole }) {
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

        if (requiredRole && role !== requiredRole) {
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
    return <div>  Loading </div>;
  };
  if (!isAuthorized){
    return <div> Unauthorized </div>;
  };

  return <>{children}</>;
}
