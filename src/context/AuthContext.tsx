import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


export type UserRole = 'INTERNAL_MANAGER' | 'MEMBER' | null;

interface FakeUser {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: FakeUser | null;
  role: UserRole;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for an existing session
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.email === 'gianjuti.csecu@gmail.com') {
        setRole('INTERNAL_MANAGER');
      } else {
        setRole('MEMBER');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    const fakeUser = { uid: `fake_uid_${Date.now()}`, email };
    setUser(fakeUser);
    localStorage.setItem('demo_user', JSON.stringify(fakeUser));
    
    if (email === 'gianjuti.csecu@gmail.com') {
      setRole('INTERNAL_MANAGER');
    } else {
      setRole('MEMBER');
    }
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
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
