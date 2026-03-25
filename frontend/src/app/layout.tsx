import { useEffect, type ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'AI Study Planner',
  description: 'Smart study planning for LPU and college students',
};

type RootLayoutProps = {
  children: ReactNode;
};



export default function RootLayout({ 
  children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
