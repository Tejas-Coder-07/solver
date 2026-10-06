'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface SessionProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institution: string;
  bio: string;
}

interface ProfileUpdate {
  full_name: string;
  institution: string | null;
  bio: string | null;
}

interface RoleContextValue {
  currentRole: UserRole;
  currentUser: SessionProfile;
  isDemo: boolean;
  toast: { id: number; message: string; kind: 'success' | 'error' } | null;
  loading: boolean;
  error: string | null;
  notify: (message: string, kind?: 'success' | 'error') => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  saveProfile: (profile: ProfileUpdate) => Promise<void>;
  signOut: () => Promise<void>;
}

const EMPTY_PROFILE: SessionProfile = {
  id: '',
  name: '',
  email: '',
  role: 'STUDENT',
  avatar: '',
  institution: '',
  bio: '',
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SessionProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<RoleContextValue['toast']>(null);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, kind });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const switchDemoRole = useCallback(async (role: UserRole) => {
    if (!currentUser.id.startsWith('demo:')) throw new Error('Role switching is available only in a demo session.');
    const response = await fetch('/api/demo/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email, role }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Could not switch demo workspace.');
    setCurrentUser((previous) => ({ ...previous, role }));
    notify(`Switched to the ${role.toLowerCase()} demo workspace.`);
  }, [currentUser.email, currentUser.id, notify]);

  const loadProfile = useCallback(async (user: { id: string; email?: string } | null) => {
    if (!user) {
      setCurrentUser(EMPTY_PROFILE);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role, institution, bio, avatar_path')
        .eq('id', user.id)
        .maybeSingle();
      if (profileError) throw new Error(`Your account profile could not be loaded: ${profileError.message}`);
      if (!data) throw new Error('Your account profile is missing. Contact an administrator.');

      setCurrentUser({
        id: data.id,
        name: data.full_name,
        email: user.email ?? '',
        role: data.role,
        avatar: data.avatar_path ?? '',
        institution: data.institution ?? '',
        bio: data.bio ?? '',
      });
      setError(null);
    } catch (profileLoadError) {
      setError(profileLoadError instanceof Error ? profileLoadError.message : 'Your account profile could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      const initialize = async () => {
        try {
          if (process.env.NODE_ENV === 'development') {
            const demoResponse = await fetch('/api/demo/session', { cache: 'no-store' });
            const demoResult = await demoResponse.json();
            if (!demoResponse.ok) throw new Error(demoResult.error ?? 'Unable to load the demo session.');
            const demoSession = demoResult.session as { email: string; role: UserRole } | null;
            if (active && demoSession) {
              let savedProfile: Partial<SessionProfile> = {};
              try {
                const saved = window.localStorage.getItem(`gardenia-demo:profile:${demoSession.email}`);
                if (saved) savedProfile = JSON.parse(saved) as Partial<SessionProfile>;
              } catch (storageError) {
                throw new Error(`Demo profile could not be restored: ${storageError instanceof Error ? storageError.message : 'browser storage is unavailable.'}`);
              }
              setCurrentUser({
                id: `demo:${demoSession.email}`,
                name: savedProfile.name ?? demoSession.email.split('@')[0],
                email: demoSession.email,
                role: demoSession.role,
                avatar: savedProfile.avatar ?? '',
                institution: savedProfile.institution ?? '',
                bio: savedProfile.bio ?? 'Demo preview account. Actions do not change protected database records.',
              });
              setError(null);
              setLoading(false);
              return;
            }
          }
          const { data, error: authError } = await supabase.auth.getUser();
          if (authError && authError.name !== 'AuthSessionMissingError') {
            throw new Error(`Unable to validate your session: ${authError.message}`);
          }
          if (active) await loadProfile(data.user ? { id: data.user.id, email: data.user.email } : null);
        } catch (initializationError) {
          if (active) {
            setError(initializationError instanceof Error ? initializationError.message : 'Unable to load your account.');
            setLoading(false);
          }
        }
      };
      void initialize();
      const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        window.setTimeout(async () => {
          if (!active) return;
          if (process.env.NODE_ENV === 'development' && !session?.user) {
            const response = await fetch('/api/demo/session', { cache: 'no-store' });
            const result = await response.json();
            if (!response.ok) {
              setError(result.error ?? 'Unable to validate the demo session.');
              setLoading(false);
              return;
            }
            if (result.session) return;
          }
          await loadProfile(session?.user ? { id: session.user.id, email: session.user.email } : null);
        }, 0);
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    } catch (initializationError) {
      setError(initializationError instanceof Error ? initializationError.message : 'Unable to load your account.');
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [loadProfile]);

  const saveProfile = useCallback(async (profile: ProfileUpdate) => {
    if (!currentUser.id) throw new Error('Sign in before updating your profile.');
    if (currentUser.id.startsWith('demo:')) {
      const nextProfile = {
        ...currentUser,
        name: profile.full_name,
        institution: profile.institution ?? '',
        bio: profile.bio ?? '',
      };
      try {
        window.localStorage.setItem(`gardenia-demo:profile:${currentUser.email}`, JSON.stringify(nextProfile));
      } catch (storageError) {
        throw new Error(`Demo profile could not be saved locally: ${storageError instanceof Error ? storageError.message : 'browser storage is unavailable.'}`);
      }
      setCurrentUser(nextProfile);
      notify('Changes saved in this demo session.');
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        institution: profile.institution,
        bio: profile.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.id)
      .select('id, full_name, role, institution, bio, avatar_path')
      .single();
    if (updateError) throw new Error(`Your profile could not be saved: ${updateError.message}`);

    setCurrentUser((previous) => ({
      ...previous,
      name: data.full_name,
      role: data.role,
      institution: data.institution ?? '',
      bio: data.bio ?? '',
      avatar: data.avatar_path ?? '',
    }));
  }, [currentUser, notify]);

  const signOut = useCallback(async () => {
    if (currentUser.id.startsWith('demo:')) {
      const response = await fetch('/api/demo/session', { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to end the demo session.');
      setCurrentUser(EMPTY_PROFILE);
      setError(null);
      return;
    }
    const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
    if (signOutError) throw new Error(`Unable to sign out: ${signOutError.message}`);
  }, [currentUser.id]);

  const value = useMemo<RoleContextValue>(() => ({
    currentRole: currentUser.role,
    currentUser,
    isDemo: currentUser.id.startsWith('demo:'),
    toast,
    loading,
    error,
    notify,
    switchDemoRole,
    saveProfile,
    signOut,
  }), [currentUser, toast, loading, error, notify, switchDemoRole, saveProfile, signOut]);

  return (
    <RoleContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role={toast.kind === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
            toast.kind === 'error'
              ? 'border-rose-800 bg-rose-950 text-rose-100'
              : 'border-emerald-800 bg-emerald-950 text-emerald-100'
          }`}
        >
          {toast.kind === 'success' ? '✓ ' : ''}{toast.message}
        </div>
      )}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
}
