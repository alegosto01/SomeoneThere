import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { analytics } from '@/lib/analytics';
import { setMonitoringUser } from '@/lib/monitoring';
import { unregisterPushToken } from '@/lib/notifications';
import { supabase } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/types';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  initializing: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initializing, setInitializing] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    setProfile(data ?? null);
    if (data) {
      setMonitoringUser(data.id, data.role);
      analytics.identify(data.id, data.role);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadProfile(data.session.user.id).catch(() => setProfile(null));
      }
      setInitializing(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        void loadProfile(nextSession.user.id).catch(() => setProfile(null));
      } else {
        setProfile(null);
        setMonitoringUser(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    // Drop the push token first — otherwise this device keeps receiving
    // notifications for an account that is no longer signed in here.
    await unregisterPushToken();
    await supabase.auth.signOut();
    analytics.reset();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [loadProfile, session?.user]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      profile,
      role: profile?.role ?? null,
      initializing,
      signOut,
      refreshProfile,
    }),
    [session, profile, initializing, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

/** The signed-in user's id, or throws — for hooks that require a session. */
export function useUserId(): string {
  const { session } = useAuth();
  if (!session?.user) throw new Error('no active session');
  return session.user.id;
}
