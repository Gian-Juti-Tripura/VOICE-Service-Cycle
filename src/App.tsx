import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy, type ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import FloatingActionBar from './components/layout/FloatingActionBar';
import { Toaster } from 'react-hot-toast';
import { initializeOneSignal } from './utils/onesignal';
import { scheduleDailyNotifications } from './utils/notificationScheduler';

// Lazy Loaded Modules (Instant First Paint & Ultra-Small Initial Bundle)
const HubHome = lazy(() => import('./pages/HubHome'));
const SyllabusExplorer = lazy(() => import('./pages/syllabus/SyllabusExplorer'));
const SadhanaTracker = lazy(() => import('./pages/sadhana/SadhanaTracker'));
const AdvaitaOrgPage = lazy(() => import('./pages/management/AdvaitaOrgPage'));
const PreachersToolkit = lazy(() => import('./pages/preaching/PreachersToolkit'));
const VaishnavaCalendarPage = lazy(() => import('./pages/calendar/VaishnavaCalendarPage'));
const CoursesPage = lazy(() => import('./pages/camps/CoursesPage'));
const CampsPage = lazy(() => import('./pages/camps/CampsPage'));
const SebanandaLibrary = lazy(() => import('./pages/library/SebanandaLibrary'));
const AnnouncementsPage = lazy(() => import('./pages/announcements/AnnouncementsPage'));
const CounselorDesk = lazy(() => import('./pages/counselor/CounselorDesk'));
const DevoteeProfilesPage = lazy(() => import('./pages/profiles/DevoteeProfilesPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));
const MembersList = lazy(() => import('./pages/manager/MembersList'));
const MemberEdit = lazy(() => import('./pages/manager/MemberEdit'));
const ServicesList = lazy(() => import('./pages/manager/ServicesList'));
const ServiceEdit = lazy(() => import('./pages/manager/ServiceEdit'));
const SettingsDashboard = lazy(() => import('./pages/manager/SettingsDashboard'));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 animate-pulse">
      Loading Advaita VOICE Module...
    </span>
  </div>
);

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
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rolesToCheck = allowedRoles || (allowedRole ? [allowedRole] : undefined);

  if (rolesToCheck && !rolesToCheck.includes(role as any)) {
    if (role === 'ADMIN' && rolesToCheck.includes('INTERNAL_MANAGER')) {
      return <>{children}</>;
    }
    
    if (role === 'MEMBER') {
      return <Navigate to="/member" replace />;
    }
    if (role === 'INTERNAL_MANAGER' || role === 'ADMIN') {
      return <Navigate to="/manager" replace />;
    }
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      scheduleDailyNotifications(user.id);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <FloatingActionBar />
      <main className="flex-1">
        <Toaster position="top-center" />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Hub Landing Cards (Open to all visitors & members) */}
            <Route path="/" element={<HubHome />} />
            <Route path="/syllabus" element={<SyllabusExplorer />} />
            <Route path="/management" element={<AdvaitaOrgPage />} />
            <Route path="/preaching" element={<PreachersToolkit />} />
            <Route path="/calendar" element={<VaishnavaCalendarPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/camps" element={<CampsPage />} />
                        <Route path="/library" element={<SebanandaLibrary />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/profiles" element={<DevoteeProfilesPage />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            
            {/* Sadhana Module */}
            <Route path="/sadhana" element={<SadhanaTracker />} />
            <Route path="/counselor" element={<CounselorDesk />} />

            {/* Service Cycle Seva Roster */}
            <Route 
              path="/service-cycle" 
              element={
                <ProtectedRoute allowedRoles={['INTERNAL_MANAGER', 'MEMBER', 'ADMIN']}>
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Member Personal Dashboard */}
            <Route 
              path="/member" 
              element={
                <ProtectedRoute allowedRoles={['MEMBER', 'INTERNAL_MANAGER', 'ADMIN']}>
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Manager & Admin Routes */}
            <Route 
              path="/manager" 
              element={
                <ProtectedRoute allowedRoles={['INTERNAL_MANAGER', 'ADMIN', 'MEMBER']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/manager/members" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MembersList /></ProtectedRoute>} />
            <Route path="/manager/members/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><MemberEdit /></ProtectedRoute>} />
            <Route path="/manager/services" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServicesList /></ProtectedRoute>} />
            <Route path="/manager/services/:id" element={<ProtectedRoute allowedRole="INTERNAL_MANAGER"><ServiceEdit /></ProtectedRoute>} />
            <Route path="/manager/settings" element={<ProtectedRoute allowedRole="ADMIN"><SettingsDashboard /></ProtectedRoute>} />

            {/* Catch-all redirect to Hub */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  useEffect(() => {
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
