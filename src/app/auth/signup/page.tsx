'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Handshake, Microscope } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const roleOptions = [
  { value: 'STUDENT', label: 'Student', description: 'Learn, join projects, and build skills.', icon: GraduationCap },
  { value: 'RESEARCHER', label: 'Researcher', description: 'Lead research and collaborate with teams.', icon: Microscope },
  { value: 'MENTOR', label: 'Mentor', description: 'Guide contributors and review their work.', icon: BookOpen },
  { value: 'SPONSOR', label: 'Sponsor', description: 'Fund projects and support research.', icon: Handshake },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState<(typeof roleOptions)[number]['value']>('STUDENT');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim(), requested_role: requestedRole },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/onboarding`,
        },
      });
      if (signUpError) throw new Error(signUpError.message);
      if (data.session) router.replace('/auth/onboarding');
      else router.replace(`/auth/verification?email=${encodeURIComponent(email.trim())}`);
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : 'Unable to create your account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <Link href="/auth/login" className="text-xs font-bold tracking-wide text-teal-800">GARDENIA</Link>
        <p className="mt-7 text-xs font-semibold uppercase text-teal-800">Create your account</p>
        <h1 className="text-balance mt-2 text-3xl font-bold text-slate-950">Join the research community</h1>
        <p className="text-pretty mt-2 text-sm leading-6 text-slate-600">Choose the workspace that best describes you. Student access is available immediately; other roles need administrator approval.</p>
        <form className="mt-6 space-y-4" onSubmit={signUp}>
          <label className="block text-xs font-semibold text-slate-700">Full name
            <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" autoComplete="name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Email
            <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Password
            <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
            <span className="mt-1 block text-[10px] text-slate-500">Use at least 8 characters.</span>
          </label>
          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-slate-700">I’m joining as</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {roleOptions.map(({ value, label, description, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                    requestedRole === value ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="requestedRole"
                    value={value}
                    checked={requestedRole === value}
                    onChange={() => setRequestedRole(value)}
                  />
                  <Icon className="mt-0.5 size-4 shrink-0 text-teal-800" aria-hidden="true" />
                  <span>
                    <span className="block text-xs font-semibold text-slate-900">{label}</span>
                    <span className="mt-1 block text-[10px] leading-4 text-slate-500">{description}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Requested roles are reviewed before access is granted. All new accounts start with student-level access.
            </p>
          </fieldset>
          {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60" disabled={busy} type="submit">
            {busy ? 'Creating account…' : 'Create account'} <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-600">Already have an account? <Link className="font-semibold text-teal-800" href="/auth/login">Sign in</Link></p>
      </section>
    </main>
  );
}
