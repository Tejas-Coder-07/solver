import { requireAuthenticatedActor, requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function SponsorFundingPage() {
  const { supabase, actor } = await requireAuthenticatedActor();
  requireRole(actor, ['SPONSOR']);

  const { data: ledger, error } = await supabase
    .from('credit_ledger')
    .select('id, project_id, contribution_id, user_id, amount, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(`Credit ledger could not be loaded: ${error.message}`);

  const creditsAwarded = (ledger ?? []).reduce((total, entry) => total + entry.amount, 0);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-800 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Sponsor workspace</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">Credits and funding status</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          This page shows persisted contribution credits visible to your account. Credits are not currency. Real-money escrow, payments, and milestone releases are not connected.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-950 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Credits awarded in the latest 100 visible entries</p>
        <p className="mt-2 text-3xl font-bold text-emerald-300">{creditsAwarded.toLocaleString()}</p>
        <p className="mt-1 text-xs text-slate-500">An empty result means no visible credit awards have been recorded.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Recent credit ledger entries</h2>
        {ledger?.length ? (
          <ul className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {ledger.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">{entry.reason}</p>
                  <p className="mt-1 break-all text-xs text-slate-400">Project {entry.project_id} · Contribution {entry.contribution_id} · Recipient {entry.user_id}</p>
                  <time className="mt-1 block text-xs text-slate-500">{new Date(entry.created_at).toLocaleString()}</time>
                </div>
                <span className="shrink-0 text-sm font-bold text-emerald-300">+{entry.amount.toLocaleString()} credits</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center text-sm text-slate-400">
            No credit awards are visible to this sponsor account.
          </p>
        )}
      </section>
    </main>
  );
}
