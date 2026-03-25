'use client';

import { Suspense, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
      <Toaster position="top-right" />
    </Suspense>
  );
}
