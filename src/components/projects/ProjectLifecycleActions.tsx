'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProjectLifecycleActionsProps = {
  projectId: string;
  status: string;
  isSponsor: boolean;
  isAdmin: boolean;
};

export function ProjectLifecycleActions({
  projectId,
  status,
  isSponsor,
  isAdmin,
}: ProjectLifecycleActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const perform = async (url: string, method: 'POST' | 'PATCH', body?: Record<string, string>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Project workflow action failed.');
      setNotice('Project status updated.');
      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Project workflow action failed.');
    } finally {
      setBusy(false);
    }
  };

  if (!(isSponsor && ['DRAFT', 'REJECTED', 'ADMIN_VERIFIED'].includes(status))
    && !(isAdmin && status === 'SUBMITTED')) return null;

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Project workflow</h2>
      {isSponsor && ['DRAFT', 'REJECTED'].includes(status) && (
        <button
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          disabled={busy}
          onClick={() => void perform(`/api/projects/${projectId}/submit`, 'POST')}
          type="button"
        >
          {busy ? 'Submitting…' : 'Submit for administrator review'}
        </button>
      )}
      {isSponsor && status === 'ADMIN_VERIFIED' && (
        <button
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          disabled={busy}
          onClick={() => void perform(`/api/projects/${projectId}/publish`, 'POST')}
          type="button"
        >
          {busy ? 'Publishing…' : 'Publish project'}
        </button>
      )}
      {isAdmin && status === 'SUBMITTED' && (
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            disabled={busy}
            onClick={() => void perform(`/api/admin/projects/${projectId}/decision`, 'PATCH', { decision: 'APPROVE' })}
            type="button"
          >
            Approve
          </button>
          <button
            className="rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            disabled={busy}
            onClick={() => void perform(`/api/admin/projects/${projectId}/decision`, 'PATCH', { decision: 'REJECT' })}
            type="button"
          >
            Reject
          </button>
        </div>
      )}
      {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
      {notice && <p className="text-sm text-emerald-700" role="status">{notice}</p>}
    </section>
  );
}
