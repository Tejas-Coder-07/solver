'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { RoleNavigation } from '@/components/layout/RoleNavigation';
import { cn } from '@/lib/cn';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(window.localStorage.getItem('gardenia-theme') !== 'light');
  }, []);

  const toggleTheme = () => {
    setDark((current) => {
      const next = !current;
      window.localStorage.setItem('gardenia-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  if (pathname.startsWith('/auth')) return <>{children}</>;
  if (pathname.startsWith('/projects/')) return <main>{children}</main>;

  return (
    <div className={cn('min-h-dvh lg:flex', dark ? 'gardenia-dark bg-[#0a0f1a] text-slate-200' : 'bg-slate-50 text-slate-900')}>
      <RoleNavigation dark={dark} />
      <div className="min-w-0 flex-1">
        <Header dark={dark} onToggleTheme={toggleTheme} />
        <main className="min-h-[calc(100dvh-4rem)] px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
