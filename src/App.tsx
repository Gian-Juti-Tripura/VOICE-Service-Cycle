import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import MembersList from './pages/manager/MembersList';
import MemberEdit from './pages/manager/MemberEdit';
import ServicesList from './pages/manager/ServicesList';
import ServiceEdit from './pages/manager/ServiceEdit';
import MemberDashboard from './pages/member/MemberDashboard';

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: ReactNode;
  allowedRole?: 'INTERNAL_MANAGER' | 'MEMBER';
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

  // Very basic role check for Phase 1
  if (allowedRole && role !== allowedRole) {
    // If role is null (e.g. Firestore blocked by adblocker), show error
    if (role === null) {
      return (
        <div className="container flex items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 4rem)', color: 'var(--color-danger)' }}>
          <div>
            <h2 className="mb-4">Access Denied</h2>
            <p>We could not determine your role.</p>
            <p className="mt-2 text-sm">If you are using an ad-blocker (like Brave Shields or uBlock), please disable it for localhost, as it is blocking our database connection.</p>
          </div>
        </div>
      );
    }
    
    // If user is a member but tries to access manager route, redirect them to member dashboard
    if (role === 'MEMBER') {
      return <Navigate to="/member" replace />;
    }
    // If user is manager but tries to access member route, allow it or redirect?
    // Let's redirect managers to their dashboard if they hit the root
    return <Navigate to="/manager" replace />;
  }

  return children;
};

// Default Route component to redirect based on role
const DefaultRoute = () => {
  const { user, role, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  if (role === 'INTERNAL_MANAGER') {
    return <Navigate to="/manager" replace />;
  }
  
  return <Navigate to="/member" replace />;
};


const AppContent = () => {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute allowedRole="INTERNAL_MANAGER">
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/manager/members" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MembersList /></ProtectedRoute>} />
          <Route path="/manager/members/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MemberEdit /></ProtectedRoute>} />
          <Route path="/manager/services" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServicesList /></ProtectedRoute>} />
          <Route path="/manager/services/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServiceEdit /></ProtectedRoute>} />
          
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
