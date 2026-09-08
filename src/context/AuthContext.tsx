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
  setDirectDevoteeSession: (devoteeUser: any, userRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check active Supabase sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id, session.user.email);
        return;
      }

      // 2. Check direct verified devotee session fallback
      const directSessionStr = localStorage.getItem('voice_direct_devotee_session');
      if (directSessionStr) {
        try {
          const directData = JSON.parse(directSessionStr);
          if (directData && directData.user) {
            setUser(directData.user as User);
            setRole(directData.role as UserRole);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse direct devotee session:", e);
        }
      }

      setUser(null);
      setRole(null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id, session.user.email);
      } else {
        const directSessionStr = localStorage.getItem('voice_direct_devotee_session');
        if (!directSessionStr) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string, userEmail?: string) => {
    try {
      // 1. Direct Admin Grant for Master Admin emails
      const normalizedEmail = userEmail?.trim().toLowerCase();
      if (normalizedEmail && (
        normalizedEmail === 'gianjuti.csecu@gmail.com' ||
        normalizedEmail === 'gianjyoti.cse.cu@gmail.com' ||
        normalizedEmail === 'rasvihari.voice@gmail.com'
      )) {
        setRole('ADMIN');
        localStorage.setItem('voice_auth_role', 'ADMIN');
        setLoading(false);
        return;
      }

      // 2. Try querying members table by user_id or email
      let query = supabase.from('members').select('role');
      if (normalizedEmail) {
        query = query.or(`user_id.eq.${userId},email.eq.${normalizedEmail}`);
      } else {
        query = query.eq('user_id', userId);
      }
      
      const { data: memberData } = await query.maybeSingle();

      if (memberData?.role) {
        setRole(memberData.role as UserRole);
        localStorage.setItem('voice_auth_role', memberData.role);
        setLoading(false);
        return;
      }

      // 3. Try querying profiles table by id
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
    localStorage.removeItem('voice_direct_devotee_session');
    localStorage.removeItem('voice_auth_role');
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const setDirectDevoteeSession = (devoteeUser: any, userRole: UserRole) => {
    setUser(devoteeUser as User);
    setRole(userRole);
    localStorage.setItem('voice_direct_devotee_session', JSON.stringify({
      user: devoteeUser,
      role: userRole
    }));
    localStorage.setItem('voice_auth_role', userRole || 'MEMBER');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, setDirectDevoteeSession }}>
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
