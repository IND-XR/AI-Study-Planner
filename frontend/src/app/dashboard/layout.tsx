'use client';

import { ReactNode } from 'react';
import { AppShell } from '@/features/dashboard/components/AppShell';
import { useDashboardBoot } from '@/features/dashboard/hooks';

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  useDashboardBoot();

  return <AppShell>{children}</AppShell>;
}
