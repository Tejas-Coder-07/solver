'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Handshake, Microscope } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const demoRoles = [
  { value: 'STUDENT', label: 'Student', icon: GraduationCap },
  { value: 'RESEARCHER', label: 'Researcher', icon: Microscope },
  { value: 'MENTOR', label: 'Mentor', icon: BookOpen },
  { value: 'SPONSOR', label: 'Sponsor', icon: Handshake },
  { value: 'ADMIN', label: 'Admin', icon: BookOpen },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<(typeof demoRoles)[number]['value']>('STUDENT');
  const [password, setPassword] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'confirmation_failed') {
      setError('That confirmation link is invalid or expired. Sign in again or request a new confirmation email.');
    }
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw new Error(signInError.message);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profileError) throw new Error(`Unable to load your workspace role: ${profileError.message}`);
      router.replace(`/${profile.role.toLowerCase()}/dashboard`);
      router.refresh();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  const enterDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to open the demo workspace.');
      router.replace(`/${role.toLowerCase()}/dashboard`);
      router.refresh();
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : 'Unable to open the demo workspace.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.85fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-teal-400 font-extrabold text-slate-950">G</span><span className="text-sm font-bold tracking-wide">GARDENIA</span></Link>
        <div className="relative z-10 max-w-lg">
          <span className="flex size-12 items-center justify-center rounded-xl bg-slate-800 text-teal-300"><Microscope className="size-6" aria-hidden="true" /></span>
          <h1 className="text-balance mt-6 text-4xl font-bold leading-tight">Great research grows through collaboration.</h1>
          <p className="text-pretty mt-4 max-w-md text-sm leading-6 text-slate-300">Connect sponsors, researchers, mentors, and contributors around meaningful projects and shared evidence.</p>
        </div>
        <p className="text-xs text-slate-500">Secure research collaboration workspace</p>
        <div className="absolute bottom-0 right-0 size-80 translate-x-1/3 translate-y-1/3 rounded-full border border-slate-800" aria-hidden="true" />
      </aside>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Link href="/" className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-teal-700 font-extrabold text-white">G</span><span className="text-sm font-bold tracking-wide text-slate-900">GARDENIA</span></Link></div>
          <p className="text-xs font-semibold uppercase text-teal-800">Welcome to Gardenia</p>
          <h2 className="text-balance mt-2 text-3xl font-bold text-slate-950">Explore a workspace</h2>
          <p className="text-pretty mt-2 text-sm text-slate-600">Enter your email and choose a role. Demo access opens immediately and does not require email verification.</p>
          <form className="mt-7 space-y-4" onSubmit={enterDemo}>
            <label className="block text-xs font-semibold text-slate-700">Email
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-slate-700">Choose a demo workspace</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {demoRoles.map(({ value, label, icon: Icon }) => (
                  <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold ${role === value ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-300 text-slate-700'}`}>
                    <input className="sr-only" type="radio" name="demoRole" value={value} checked={role === value} onChange={() => setRole(value)} />
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60" disabled={busy} type="submit">
              {busy ? 'Opening workspace…' : 'Enter demo workspace'} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">Demo preview only. Changes to protected records require a verified Gardenia account.</p>
          <button className="mt-5 w-full text-center text-xs font-semibold text-teal-800 hover:underline" type="button" onClick={() => { setShowPasswordLogin((visible) => !visible); setError(null); }}>
            {showPasswordLogin ? 'Hide account sign in' : 'Already have an account? Sign in'}
          </button>
          {showPasswordLogin && (
            <form className="mt-4 space-y-3 border-t border-slate-200 pt-4" onSubmit={signIn}>
              <label className="block text-xs font-semibold text-slate-700">Password
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60" disabled={busy} type="submit">
                {busy ? 'Signing in…' : 'Sign in with password'}
              </button>
              <p className="text-right text-xs"><Link className="font-semibold text-teal-800 hover:underline" href="/auth/forgot-password">Forgot password?</Link></p>
            </form>
          )}
          <p className="mt-6 text-center text-xs text-slate-600">New to Gardenia? <Link className="font-semibold text-teal-800 hover:underline" href="/auth/signup">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
