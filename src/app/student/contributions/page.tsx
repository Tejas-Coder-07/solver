import Link from 'next/link';
import { requireAuthenticatedActor, requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudentContributionsPage() {
  const { supabase, actor } = await requireAuthenticatedActor();
  requireRole(actor, ['STUDENT']);
  const { data: contributions, error } = await supabase
    .from('contributions')
    .select('id, project_id, title, summary, status, credits_awarded, submitted_at, projects(title)')
    .eq('author_id', actor.id)
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(`Contributions could not be loaded: ${error.message}`);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Student workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Your contributions</h1>
        <p className="mt-2 text-sm text-slate-600">Submissions and review outcomes recorded for your account.</p>
      </header>
      {contributions?.length ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {contributions.map((contribution) => (
            (() => {
              const project = Array.isArray(contribution.projects) ? contribution.projects[0] : contribution.projects;
              return (
                <li key={contribution.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">{contribution.title}</h2>
                      <Link href={`/projects/${contribution.project_id}`} className="mt-1 block text-xs text-teal-800 hover:underline">
                        {project?.title ?? 'Open project'}
                      </Link>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {contribution.status.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{contribution.summary}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Submitted {new Date(contribution.submitted_at).toLocaleDateString()}
                    {contribution.credits_awarded ? ` · ${contribution.credits_awarded.toLocaleString()} credits awarded` : ''}
                  </p>
                </li>
              );
            })()
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-600">
          No contributions have been submitted from this account.
        </p>
      )}
    </main>
  );
}
