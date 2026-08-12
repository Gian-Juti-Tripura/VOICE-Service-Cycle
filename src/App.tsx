import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import MembersList from './pages/manager/MembersList';
import MemberEdit from './pages/manager/MemberEdit';
import ServicesList from './pages/manager/ServicesList';
import ServiceEdit from './pages/manager/ServiceEdit';
import SettingsDashboard from './pages/manager/SettingsDashboard';
import MemberDashboard from './pages/member/MemberDashboard';
import { initializeOneSignal } from './utils/onesignal';
import { scheduleDailyNotifications } from './utils/notificationScheduler';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  allowedRole,
  allowedRoles
}: { 
  children: ReactNode;
  allowedRole?: 'INTERNAL_MANAGER' | 'MEMBER' | 'ADMIN';
  allowedRoles?: Array<'INTERNAL_MANAGER' | 'MEMBER' | 'ADMIN'>;
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rolesToCheck = allowedRoles || (allowedRole ? [allowedRole] : undefined);

  if (rolesToCheck && !rolesToCheck.includes(role as any)) {
    // If user is ADMIN, allow them everywhere INTERNAL_MANAGER is allowed
    if (role === 'ADMIN' && rolesToCheck.includes('INTERNAL_MANAGER')) {
      return <>{children}</>;
    }
    
    // If role is null (e.g. Firestore blocked by adblocker), show error
    if (role === null) {
      return (
        <div className="container flex items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 4rem)', color: 'var(--color-danger)' }}>
          <div className="glass-card p-8 border-rose-200 bg-rose-50/50">
            <h2 className="text-2xl font-bold mb-4 text-rose-700">Authentication Error</h2>
            <p className="text-rose-600">Could not determine your access level. Please check your connection or disable adblockers.</p>
          </div>
        </div>
      );
    }
    
    // Redirect logic that prevents infinite loops
    if (role === 'MEMBER') {
      return <Navigate to="/member" replace />;
    }
    if (role === 'INTERNAL_MANAGER' || role === 'ADMIN') {
      return <Navigate to="/manager" replace />;
    }
    
    // Fallback for unknown roles to prevent infinite redirect blank screens
    return (
      <div className="container flex items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="glass-card p-8 border-amber-200 bg-amber-50/50">
          <h2 className="text-2xl font-bold mb-4 text-amber-700">Access Denied</h2>
          <p className="text-amber-600">Your current role ({String(role)}) does not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Default Route component to redirect based on role
const DefaultRoute = () => {
  const { user, role, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  if (role === 'INTERNAL_MANAGER' || role === 'ADMIN') {
    return <Navigate to="/manager" replace />;
  }
  
  return <Navigate to="/member" replace />;
};


const AppContent = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      scheduleDailyNotifications(user.id);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute allowedRoles={['INTERNAL_MANAGER', 'MEMBER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/manager/members" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MembersList /></ProtectedRoute>} />
          <Route path="/manager/members/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MemberEdit /></ProtectedRoute>} />
          <Route path="/manager/services" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServicesList /></ProtectedRoute>} />
          <Route path="/manager/services/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServiceEdit /></ProtectedRoute>} />
          <Route path="/manager/settings" element={<ProtectedRoute allowedRole="ADMIN"><SettingsDashboard /></ProtectedRoute>} />
          
          <Route 
            path="/member" 
            element={
              <ProtectedRoute allowedRole="MEMBER">
                <MemberDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<DefaultRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  useEffect(() => {
    // Wait a brief moment for Capacitor's native bridge to fully inject before initializing
    setTimeout(() => {
      initializeOneSignal();
    }, 500);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
