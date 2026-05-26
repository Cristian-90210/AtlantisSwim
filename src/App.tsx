import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRole } from './types';
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
import { AdminCourses } from './pages/admin/Courses';
import { AdminServices } from './pages/admin/Services';
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
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
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
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="student/profile" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="student/subscription" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentSubscription />
                      </ProtectedRoute>
                    } />
                    <Route path="student/schedule" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentSchedule />
                      </ProtectedRoute>
                    } />
                    <Route path="student/results" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentResults />
                      </ProtectedRoute>
                    } />
                    <Route path="student/settings" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="student/chat" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <StudentChat />
                      </ProtectedRoute>
                    } />
                    <Route path="prezenta" element={
                      <ProtectedRoute allowedRoles={[UserRole.Student]}>
                        <Attendance />
                      </ProtectedRoute>
                    } />
                    <Route path="coach" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/profile" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/schedule" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachTrainingSchedule />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/attendance" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachAttendance />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/results" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachStudentResults />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/chat" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachChat />
                      </ProtectedRoute>
                    } />
                    <Route path="coach/settings" element={
                      <ProtectedRoute allowedRoles={[UserRole.Coach]}>
                        <CoachSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="admin" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <AdminProfile />
                      </ProtectedRoute>
                    } />

                    {/* Admin Management Routes */}
                    <Route path="admin/users" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <UsersManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/reservations" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <Reservations />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/announcements" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <Announcements />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/courses" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <AdminCourses />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/services" element={
                      <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                        <AdminServices />
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
                      <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Coach]}>
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
