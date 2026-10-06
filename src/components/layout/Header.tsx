'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bell, ChevronDown, LogOut, MessageSquare, Search, Sun, UsersRound } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/cn';
import { getWorkspaceRole, portalNavigation } from '@/lib/portal-nav';
import type { UserRole } from '@/types';
import { demoPeople, demoProjects, demoStudentTasks } from '@/lib/mock-data';

type HeaderProps = {
  dark: boolean;
  onToggleTheme: () => void;
};

export function Header({ dark, onToggleTheme }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole, currentUser, isDemo, signOut, switchDemoRole, notify } = useRole();
  const inputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [searchNote, setSearchNote] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ kind: string; label: string; href: string }[]>([]);
  const [searchBusy, setSearchBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationError, setNotificationError] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const workspaceRole = getWorkspaceRole(pathname, currentRole);
  const roleHome = `/${workspaceRole.toLowerCase()}`;
  const displayName = currentUser.name || `${workspaceRole.toLowerCase()} account`;

  useEffect(() => {
    let active = true;
    const loadUnread = async () => {
      if (isDemo) {
        setUnreadCount(3);
        setNotificationError(false);
        return;
      }
      try {
        const response = await fetch('/api/notifications?countOnly=1');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? 'Unread notifications could not be loaded.');
        if (active) {
          setUnreadCount(result.unreadCount ?? 0);
          setNotificationError(false);
        }
      } catch {
        if (active) setNotificationError(true);
      }
    };
    void loadUnread();
    window.addEventListener('gardenia:notifications-updated', loadUnread);
    return () => {
      active = false;
      window.removeEventListener('gardenia:notifications-updated', loadUnread);
    };
  }, [pathname, workspaceRole, isDemo]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        accountMenuRef.current?.querySelector('button')?.focus();
      }
    };
    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (event.target instanceof Node && !accountMenuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  const submitSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;
    const match = portalNavigation[workspaceRole].find((item) => item.label.toLowerCase().includes(term));
    if (match) {
      setQuery('');
      setSearchNote(null);
      setSearchResults([]);
      router.push(match.href);
      return;
    }

    if (isDemo) {
      const term = query.trim().toLowerCase();
      const results = [
        ...demoProjects.filter((project) => `${project.title} ${project.domain} ${project.sponsor}`.toLowerCase().includes(term).map((project) => ({
          kind: 'project',
          label: project.title,
          href: `/projects/${project.id}`,
        })),
        ...demoPeople.filter((person) => `${person.name} ${person.role} ${person.skills.join(' ')}`.toLowerCase().includes(term).map((person) => ({
          kind: person.role.toLowerCase(),
          label: person.name,
          href: `/${workspaceRole.toLowerCase()}/team`,
        })),
        ...demoStudentTasks.filter((task) => `${task.title} ${task.project}`.toLowerCase().includes(term).map((task) => ({
          kind: 'task',
          label: task.title,
          href: '/student/my-work',
        })),
      ];
      setSearchResults(results.slice(0, 10));
      setSearchNote(results.length ? null : `No demo results found for "${query.trim()}".`);
      return;
    }

    if (term.length < 2) {
      setSearchNote('Enter at least two characters to search projects, people, and tasks.');
      return;
    }
    setSearchBusy(true);
    setSearchNote(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&workspace=${workspaceRole}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Search could not be completed.');
      setSearchResults(result.results ?? []);
      setSearchNote(result.results?.length ? null : `No authorized results found for "${query.trim()}".`);
    } catch (searchError) {
      setSearchResults([]);
      setSearchNote(searchError instanceof Error ? searchError.message : 'Search could not be completed.');
    } finally {
      setSearchBusy(false);
    }
  };

  const signOutToLogin = async () => {
    setSignOutError(null);
    setMenuOpen(false);
    try {
      await signOut();
      if (isDemo) notify('Demo session ended.');
      router.replace('/auth/login');
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.');
      setMenuOpen(true);
    }
  };

  const shell = dark ? 'border-[#1b2638] bg-[#0a0f1a]/95 text-slate-200' : 'border-slate-200 bg-white text-slate-700';
  const field = dark ? 'border-[#1f2b42] bg-[#0f1729] placeholder:text-slate-500' : 'border-slate-200 bg-slate-50 placeholder:text-slate-400';
  const iconButton = cn(
    'relative flex size-9 items-center justify-center rounded-lg',
    dark ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100' : 'text-slate-500 hover:bg-slate-100',
  );
  const menuPanel = dark ? 'border-[#1f2b42] bg-[#0f1729] text-slate-200' : 'border-slate-200 bg-white text-slate-800';
  const menuItem = 'block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-white/5';

  return (
    <header className={cn('sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur sm:px-6 lg:px-6', shell)}>
      <form role="search" onSubmit={submitSearch} className={cn('relative hidden w-full max-w-md flex-1 items-center gap-2 rounded-lg border px-3 py-2 md:flex', field)}>
        <Search className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
        <input
          ref={inputRef}
          aria-label="Search pages"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchNote(null);
            setSearchResults([]);
          }}
          placeholder={workspaceRole === 'ADMIN' ? 'Search users, projects, organizations, requests...' : workspaceRole === 'SPONSOR' ? 'Search projects, researchers, proposals...' : workspaceRole === 'RESEARCHER' ? 'Search projects, researchers, skills...' : workspaceRole === 'MENTOR' ? 'Search projects, students, skills, contributions...' : 'Search projects, tasks, skills, mentors...'}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
        />
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">Ctrl K</kbd>
        {(searchNote || searchResults.length > 0 || searchBusy) && (
          <div className={cn('absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border p-1 shadow-xl', menuPanel)}>
            {searchBusy && <p className="px-3 py-2 text-xs text-slate-400">Searching authorized data…</p>}
            {searchNote && <p role="status" className="px-3 py-2 text-xs text-amber-400">{searchNote}</p>}
            {searchResults.map((result, index) => (
              <Link
                key={`${result.kind}-${result.href}-${index}`}
                href={result.href}
                onClick={() => {
                  setSearchResults([]);
                  setQuery('');
                }}
                className={menuItem}
              >
                <span className="block text-xs">{result.label}</span>
                <span className="mt-0.5 block text-[9px] uppercase text-slate-500">{result.kind}</span>
              </Link>
            ))}
          </div>
        )}
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        {isDemo && (
          <span className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 sm:inline-flex">
            Demo Mode · Local changes
          </span>
        )}
        <button
          type="button"
          aria-label={`Notifications${notificationError ? ', count unavailable' : unreadCount ? `, ${unreadCount} unread` : ''}`}
          title={notificationError ? 'Unread notification count unavailable' : undefined}
          onClick={() => router.push('/notifications')}
          className={iconButton}
        >
          <Bell className="size-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-600 px-1 text-center text-[9px] font-bold leading-4 text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <Link href={`${roleHome}/messages`} aria-label="Messages" className={iconButton}>
          <MessageSquare className="size-4" aria-hidden="true" />
        </Link>
        <button type="button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme} className={iconButton}>
          <Sun className="size-4" aria-hidden="true" />
        </button>
        <div className="relative z-50" ref={accountMenuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="account-menu"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full p-1 text-left hover:bg-white/5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {displayName.trim().slice(0, 1).toUpperCase() || '?'}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-28 truncate text-[10px] font-semibold text-slate-100">{displayName}</span>
              <span className="block text-[9px] capitalize text-slate-400">{workspaceRole.toLowerCase()}</span>
            </span>
            <ChevronDown className="hidden size-3 text-slate-400 sm:block" aria-hidden="true" />
          </button>
          <div id="account-menu" role="menu" aria-label="Account options" hidden={!menuOpen} className={cn('absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border p-1 shadow-2xl ring-1 ring-black/20', menuPanel)}>
              <p className="px-3 py-2 text-[11px] opacity-70">{displayName} · {workspaceRole.toLowerCase()}</p>
              {isDemo && (
                <div className="border-y border-white/10 py-2">
                  <p className="px-3 pb-1 text-[9px] font-semibold uppercase tracking-wide text-amber-300">Switch demo workspace</p>
                  {(['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      role="menuitem"
                      disabled={role === currentRole}
                      onClick={async () => {
                        try {
                          await switchDemoRole(role);
                          setMenuOpen(false);
                          router.replace(`/${role.toLowerCase()}/dashboard`);
                          router.refresh();
                        } catch (switchError) {
                          notify(switchError instanceof Error ? switchError.message : 'Could not switch workspaces.', 'error');
                        }
                      }}
                      className={cn(menuItem, 'flex items-center justify-between disabled:opacity-50')}
                    >
                      <span className="flex items-center gap-2"><UsersRound className="size-3" aria-hidden="true" />{role[0] + role.slice(1).toLowerCase()}</span>
                      {role === currentRole && <span className="text-[9px] text-emerald-400">Current</span>}
                    </button>
                  ))}
                </div>
              )}
              <Link role="menuitem" tabIndex={0} href={`${roleHome}/profile`} onClick={() => setMenuOpen(false)} className={menuItem}>Profile</Link>
              <Link role="menuitem" tabIndex={0} href={`${roleHome}/settings`} onClick={() => setMenuOpen(false)} className={menuItem}>Settings</Link>
              <button role="menuitem" tabIndex={0} type="button" onClick={() => void signOutToLogin()} className={cn(menuItem, 'flex items-center gap-2 text-rose-400')}>
                <LogOut className="size-3.5" aria-hidden="true" />
                Sign out
              </button>
              {signOutError && <p role="alert" className="px-3 py-2 text-[11px] text-rose-400">{signOutError}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
