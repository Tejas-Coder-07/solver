'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/cn';
import { getWorkspaceRole, portalNavigation } from '@/lib/portal-nav';

function initialOf(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || '?';
}

function BrandMark({ dark }: { dark: boolean }) {
  const { currentRole } = useRole();
  const pathname = usePathname();
  const workspaceRole = getWorkspaceRole(pathname, currentRole);
  const workspaceLabel = workspaceRole === 'RESEARCHER'
    ? 'Researcher Portal'
    : workspaceRole === 'SPONSOR'
      ? 'Sponsor Portal'
    : workspaceRole === 'MENTOR'
      ? 'Mentor Portal'
    : workspaceRole === 'ADMIN'
      ? 'Admin Portal'
    : workspaceRole === 'STUDENT'
      ? 'Student workspace'
      : 'Workspace';
  return (
    <Link href={`/${workspaceRole.toLowerCase()}/dashboard`} className="flex items-center gap-3 px-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
        <Star className="size-4 fill-current" aria-hidden="true" />
      </span>
      <span>
        <span className={cn('block text-sm font-bold tracking-wide', dark ? 'text-white' : 'text-slate-900')}>GARDENIA</span>
        <span className={cn('block text-[10px]', dark ? 'text-slate-400' : 'text-slate-500')}>{workspaceLabel}</span>
      </span>
    </Link>
  );
}

function NavList({ pathname, dark }: { pathname: string; dark: boolean }) {
  const { currentRole } = useRole();
  const workspaceRole = getWorkspaceRole(pathname, currentRole);
  const dashboard = `/${workspaceRole.toLowerCase()}/dashboard`;
  return (
    <nav aria-label="Role navigation" className="flex flex-col gap-0.5">
      {portalNavigation[workspaceRole].map((item) => {
        const Icon = item.icon;
        const href = item.href;
        const active = href === dashboard
          ? pathname === dashboard
          : !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));
        return (
          <Link
            key={`${href}-${item.label}`}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              active
                ? dark ? 'bg-blue-600/15 text-blue-300' : 'bg-blue-50 text-blue-700'
                : dark ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span className="rounded-full bg-rose-600 px-1.5 text-[10px] font-bold leading-4 text-white">{item.badge}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ProfileCard({ dark }: { dark: boolean }) {
  const { currentRole, currentUser } = useRole();
  const pathname = usePathname();
  const workspaceRole = getWorkspaceRole(pathname, currentRole);
  const displayName = currentUser.name || 'Gardenia member';
  return (
    <Link
      href={`/${workspaceRole.toLowerCase()}/profile`}
      className={cn('mt-auto flex items-center gap-3 rounded-xl border p-3 hover:border-blue-500/40', dark ? 'border-[#1b2638] bg-[#0d1424]' : 'border-slate-200 bg-white')}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white" aria-hidden="true">
        {initialOf(displayName)}
      </span>
      <span className="min-w-0">
        <span className={cn('block truncate text-xs font-semibold', dark ? 'text-white' : 'text-slate-900')}>{displayName}</span>
        <span className={cn('block truncate text-[10px] capitalize', dark ? 'text-slate-400' : 'text-slate-500')}>{workspaceRole.toLowerCase()}</span>
      </span>
    </Link>
  );
}

export function RoleNavigation({ dark }: { dark: boolean }) {
  const pathname = usePathname();
  const { currentRole } = useRole();
  const workspaceRole = getWorkspaceRole(pathname, currentRole);
  const workspaceLabel = workspaceRole === 'RESEARCHER'
    ? 'Researcher Portal'
    : workspaceRole === 'SPONSOR'
      ? 'Sponsor Portal'
    : workspaceRole === 'MENTOR'
      ? 'Mentor Portal'
    : workspaceRole === 'ADMIN'
      ? 'Admin Portal'
    : workspaceRole === 'STUDENT'
      ? 'Student workspace'
      : 'Workspace';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/projects/')) return null;

  return (
    <>
      <aside className={cn('hidden h-dvh w-48 shrink-0 flex-col gap-5 overflow-y-auto border-r px-3 py-4 lg:sticky lg:top-0 lg:flex', dark ? 'border-[#1b2638] bg-[#070b13] text-slate-200' : 'border-slate-200 bg-white text-slate-800')}>
        <BrandMark dark={dark} />
        <NavList pathname={pathname} dark={dark} />
        <ProfileCard dark={dark} />
      </aside>
      <div className={cn('border-b px-4 py-3 lg:hidden', dark ? 'border-[#1b2638] bg-[#070b13] text-slate-200' : 'border-slate-200 bg-white text-slate-800')}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Star className="size-4 fill-current" aria-hidden="true" />
            </span>
            <span>
              <span className={cn('block text-sm font-bold tracking-wide', dark ? 'text-white' : 'text-slate-900')}>GARDENIA</span>
              <span className={cn('block text-[10px]', dark ? 'text-slate-400' : 'text-slate-500')}>{workspaceLabel}</span>
            </span>
          </span>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-role-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={cn('rounded-md border px-2 py-1 text-xs', dark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700')}
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        <div id="mobile-role-navigation" hidden={!mobileMenuOpen} className="max-h-[70dvh] overflow-y-auto pb-2 pt-4">
          <NavList pathname={pathname} dark={dark} />
          <ProfileCard dark={dark} />
        </div>
      </div>
    </>
  );
}
