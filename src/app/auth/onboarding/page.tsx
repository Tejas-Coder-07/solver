'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRole } from '@/context/RoleContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentRole, currentUser, loading, error } = useRole();
  const [requestedRole, setRequestedRole] = useState<string | null>(null);
  const [requestedRoleError, setRequestedRoleError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadRequestedRole = async () => {
      try {
        const { data, error: authError } = await createSupabaseBrowserClient().auth.getUser() as {
          data: { user: User | null };
          error: Error | null;
        };
        if (authError) throw new Error(`Your role request could not be loaded: ${authError.message}`);
        const requested = data.user?.user_metadata?.requested_role;
        if (active && typeof requested === 'string') setRequestedRole(requested);
      } catch (roleLoadError) {
        if (active) setRequestedRoleError(roleLoadError instanceof Error ? roleLoadError.message : 'Your role request could not be loaded.');
      }
    };
    void loadRequestedRole();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <main className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm text-slate-600">Loading your account…</main>;
  if (error) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
        <section className="max-w-md rounded-2xl border border-rose-200 bg-white p-7">
          <h1 className="text-lg font-semibold text-slate-950">Account setup could not be completed</h1>
          <p className="mt-2 text-sm text-rose-700" role="alert">{error}</p>
          <Link href="/auth/login" className="mt-5 inline-block text-sm font-semibold text-teal-800">Return to sign in</Link>
        </section>
      </main>
    );
  }
  if (!currentUser.id) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-7">
          <h1 className="text-lg font-semibold text-slate-950">Sign in to continue</h1>
          <p className="mt-2 text-sm text-slate-600">Your account must be authenticated before workspace setup.</p>
          <Link href="/auth/login" className="mt-5 inline-block text-sm font-semibold text-teal-800">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-semibold uppercase text-teal-800">Workspace setup</p>
        <h1 className="text-balance mt-2 text-3xl font-bold text-slate-950">Your account is ready, {currentUser.name}</h1>
        <p className="text-pretty mt-3 text-sm leading-6 text-slate-600">
          Your current platform role is <strong>{currentRole}</strong>.
          {requestedRole && requestedRole !== currentRole && <> Your request for <strong>{requestedRole.toLowerCase()}</strong> access has been recorded. New accounts start with student-level access until an administrator approves elevated permissions.</>}
          {' '}Roles and administrative access are assigned securely by platform administrators.
        </p>
        {requestedRoleError && <p className="mt-3 text-xs text-rose-700" role="alert">{requestedRoleError}</p>}
        <button
          className="mt-6 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={() => router.replace(`/${currentRole.toLowerCase()}/dashboard`)}
          type="button"
        >
          Open my workspace
        </button>
      </section>
    </main>
  );
}
