'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';

export default function HomePage() {
  const router = useRouter();
  const { currentRole, currentUser, loading } = useRole();

  useEffect(() => {
    if (loading) return;
    if (currentUser.id) {
      router.replace(`/${currentRole.toLowerCase()}/dashboard`);
    } else {
      router.replace('/auth/login');
    }
  }, [currentRole, currentUser.id, loading, router]);

  return <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center text-sm text-slate-400">Opening your workspace…</main>;
}
