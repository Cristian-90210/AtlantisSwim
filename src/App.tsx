import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CartToast } from './components/CartToast';
import { NotificationsProvider } from './context/NotificationsContext';

// Layout
import { MainLayout } from './layout/MainLayout';

// Pages
import { Landing } from './pages/Landing';
import { Courses } from './pages/Courses';
import { Coaches } from './pages/Coaches';
import { Students } from './pages/Students';
import { StudentDashboard } from './pages/StudentDashboard';
import { FAQPage } from './pages/FAQPage';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentSubscription } from './pages/student/StudentSubscription';
import { StudentSchedule } from './pages/student/StudentSchedule';
import { StudentResults } from './pages/student/StudentResults';
import { StudentSettings } from './pages/student/StudentSettings';
import { StudentChat } from './pages/student/StudentChat';
import { CoachDashboard } from './pages/CoachDashboard';
import { CoachProfile } from './pages/coach/CoachProfile';
import { CoachTrainingSchedule } from './pages/coach/CoachTrainingSchedule';
import { CoachAttendance } from './pages/coach/CoachAttendance';
import { CoachStudentResults } from './pages/coach/CoachStudentResults';
import { CoachChat } from './pages/coach/CoachChat';
import { CoachSettings } from './pages/coach/CoachSettings';
import { AdminProfile } from './pages/AdminProfile';
import { UsersManagement } from './pages/admin/Users';
import { Reservations } from './pages/admin/Reservations';
import { Announcements } from './pages/admin/Announcements';
import { Login } from './pages/Login';
import { CartPage } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';
import { Unauthorized } from './pages/Unauthorized';
import { Forbidden } from './pages/Forbidden';
import { InternalServerError } from './pages/InternalServerError';
import { ServerStatus } from './pages/ServerStatus';
import { Attendance } from './pages/Attendance';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
      <ThemeProvider>
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
              <NotificationsProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/401" element={<Unauthorized />} />
                  <Route path="/403" element={<Forbidden />} />
                  <Route path="/500" element={<InternalServerError />} />

                  {/* Public Landing Page */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Landing />} />

                    <Route path="student" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="student/profile" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="student/subscription" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentSubscription />
                      </ProtectedRoute>
                    } />
                    <Route path="student/schedule" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentSchedule />
                      </ProtectedRoute>
                    } />
                    <Route path="student/results" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentResults />
                      </ProtectedRoute>
                    } />
                    <Route path="student/settings" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="student/chat" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentChat />
                      </ProtectedRoute>
                    } />
                    <Route path="prezenta" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <Attendance />
                      </ProtectedRoute>
                    } />
                    <Route path="coach" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/profile" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/schedule" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachTrainingSchedule />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/attendance" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachAttendance />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/results" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachStudentResults />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/chat" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachChat />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/settings" element={
                      <ProtectedRoute allowedRoles={['coach']}>
                        <CoachSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminProfile />
                      </ProtectedRoute>
                    } />

                    {/* Admin Management Routes */}
                    <Route path="admin/users" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UsersManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/reservations" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Reservations />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/announcements" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Announcements />
                      </ProtectedRoute>
                    } />

                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:id" element={<Navigate to="/courses" replace />} />
                    <Route path="server-status" element={<ServerStatus />} />
                    <Route path="coaches" element={<Coaches />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<Checkout />} />

                    {/* Admin Only Routes */}
                    <Route path="students" element={
                      <ProtectedRoute allowedRoles={['admin', 'coach']}>
                        <Students />
                      </ProtectedRoute>
                    } />
                  </Route>

                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <CartToast />
              </NotificationsProvider>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </ThemeProvider>
  );
}

export default App;
