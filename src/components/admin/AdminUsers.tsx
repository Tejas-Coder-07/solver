'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlatformUser {
  id: string;
  full_name: string;
  role: string;
  institution: string | null;
  created_at: string;
}

interface RoleAccessRequest {
  id: string;
  user_id: string;
  requested_role: string;
  requested_at: string;
  profile: { full_name: string; institution: string | null } | { full_name: string; institution: string | null }[] | null;
}

const roles = ['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'] as const;

export function AdminUsers({ users, roleRequests }: { users: PlatformUser[]; roleRequests: RoleAccessRequest[] }) {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, (typeof roles)[number]>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [requestBusyId, setRequestBusyId] = useState<string | null>(null);

  const assignRole = async (userId: string, currentRole: string) => {
    const role = selectedRoles[userId] ?? currentRole as (typeof roles)[number];
    setBusyId(userId);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Role update failed.');
      setMessage('Role change recorded in the audit trail.');
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Role update failed.');
    } finally {
      setBusyId(null);
    }
  };

  const decideRequest = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    setRequestBusyId(requestId);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/role-requests/${requestId}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Role access decision failed.');
      setMessage(`Role access request ${decision.toLowerCase()}.`);
      router.refresh();
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : 'Role access decision failed.');
    } finally {
      setRequestBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}
      {message && <p className="text-sm text-emerald-300" role="status">{message}</p>}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-white">Pending role access requests</h2>
          <p className="mt-1 text-xs text-slate-400">Approvals update the profile role and record an audit event.</p>
        </div>
        {roleRequests.length ? (
          <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950">
            {roleRequests.map((request) => {
              const profile = Array.isArray(request.profile) ? request.profile[0] : request.profile;
              return (
                <li key={request.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">{profile?.full_name ?? request.user_id}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Requested {request.requested_role} · {profile?.institution ?? 'No institution'} · {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      disabled={requestBusyId === request.id}
                      onClick={() => void decideRequest(request.id, 'APPROVED')}
                      type="button"
                    >
                      Approve
                    </button>
                    <button
                      className="rounded bg-rose-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      disabled={requestBusyId === request.id}
                      onClick={() => void decideRequest(request.id, 'REJECTED')}
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">There are no pending role requests.</p>
        )}
      </section>
      <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950">
        {users.map((user) => (
          <li className="flex flex-wrap items-center justify-between gap-4 px-4 py-4" key={user.id}>
            <div>
              <p className="text-sm font-medium text-white">{user.full_name}</p>
              <p className="mt-1 text-xs text-slate-500">{user.institution ?? 'No institution'} · {user.id}</p>
              <p className="mt-1 text-xs text-slate-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.full_name}</label>
              <select className="rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white" id={`role-${user.id}`} value={selectedRoles[user.id] ?? user.role} onChange={(event) => setSelectedRoles((current) => ({ ...current, [user.id]: event.target.value as (typeof roles)[number] }))}>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
              <button className="rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50" disabled={busyId === user.id || (selectedRoles[user.id] ?? user.role) === user.role} onClick={() => void assignRole(user.id, user.role)}>Save</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
