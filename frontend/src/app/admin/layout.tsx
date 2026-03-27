'use client';

import { ReactNode } from 'react';
import { AdminShell } from '@/features/admin/components/AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}
