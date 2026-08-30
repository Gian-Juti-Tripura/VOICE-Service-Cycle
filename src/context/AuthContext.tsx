import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase/supabaseClient';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'INTERNAL_MANAGER' | 'MEMBER' | 'ADMIN' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      // 1. Try querying members table by user_id
      const { data: memberData } = await supabase
        .from('members')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (memberData?.role) {
        setRole(memberData.role as UserRole);
        localStorage.setItem('voice_auth_role', memberData.role);
        setLoading(false);
        return;
      }

      // 2. Try querying profiles table by id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileData?.role) {
        setRole(profileData.role as UserRole);
        localStorage.setItem('voice_auth_role', profileData.role);
      } else {
        const cachedRole = localStorage.getItem('voice_auth_role') as UserRole;
        setRole(cachedRole || 'MEMBER');
      }
    } catch (err) {
      console.error("Supabase fetchRole error:", err);
      const cachedRole = localStorage.getItem('voice_auth_role') as UserRole;
      setRole(cachedRole || 'MEMBER');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
