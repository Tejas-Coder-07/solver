import Link from 'next/link';
import { Inbox } from 'lucide-react';
import { findPortalItem } from '@/lib/portal-nav';

export function PortalPlaceholder({ path }: { path: string }) {
  const item = findPortalItem(path);
  const routeLabel = path.split('/').filter(Boolean).at(-1)?.split('-').map((word) => (
    word.toLowerCase() === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1)
  )).join(' ');
  const label = item?.label ?? routeLabel ?? 'This section';
  const Icon = item?.icon ?? Inbox;
  const role = path.split('/')[1] ?? 'student';

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">{label}</h1>
      <p className="mt-1 text-sm text-slate-500">Details for this section will appear here as data is connected.</p>
      <div className="mt-8 flex flex-col items-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <Icon className="size-5 text-slate-500" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">Nothing here yet</h2>
        <p className="mt-1 max-w-sm text-xs text-slate-500">There is no {label.toLowerCase()} data yet. Items will show up here once they are created.</p>
        <Link href={`/${role}/dashboard`} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
