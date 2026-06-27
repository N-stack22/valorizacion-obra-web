import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { AppRole, GlobalRole, ProfileRow } from "@/lib/domain";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  roles: AppRole[];
  globalRoles: GlobalRole[];
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(userId: string) {
  const [{ data: profile }, { data: roleRows }, { data: globalRoleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("user_global_roles").select("role").eq("user_id", userId),
  ]);

  return {
    profile: profile ?? null,
    roles: (roleRows ?? []).map((row) => row.role),
    globalRoles: (globalRoleRows ?? []).map((row) => row.role),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [globalRoles, setGlobalRoles] = useState<GlobalRole[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user?.id) return;
    const result = await loadProfile(user.id);
    setProfile(result.profile);
    setRoles(result.roles);
    setGlobalRoles(result.globalRoles);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((nextEvent, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        queueMicrotask(async () => {
          const result = await loadProfile(nextSession.user.id);
          setProfile(result.profile);
          setRoles(result.roles);
          setGlobalRoles(result.globalRoles);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setRoles([]);
        setGlobalRoles([]);
        setLoading(false);
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const result = await loadProfile(data.session.user.id);
        setProfile(result.profile);
        setRoles(result.roles);
        setGlobalRoles(result.globalRoles);
      }
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      roles,
      globalRoles,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin:
        roles.includes("admin") ||
        globalRoles.some((role) => role === "super_admin" || role === "admin_empresa"),
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      refreshProfile,
    }),
    [globalRoles, loading, profile, roles, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
