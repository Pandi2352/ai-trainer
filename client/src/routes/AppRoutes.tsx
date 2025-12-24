import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TraineeDashboard from '../pages/dashboard/TraineeDashboard';
import UserManagement from '../pages/admin/UserManagement';
import Profile from '../pages/common/Profile';
import LandingPage from '../pages/LandingPage';
import ContentUpload from '../pages/admin/ContentUpload';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import ExamGenerator from '../pages/admin/ExamGenerator';
import ExamDetails from '../pages/admin/ExamDetails';
import GeneratedExamsList from '../pages/admin/GeneratedExamsList';
import TraineeExamInterface from '../pages/trainee/TraineeExamInterface';
import ExamResult from '../pages/trainee/ExamResult';

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();




  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes (Wrapped in DashboardLayout) */}
      {/* Protected Routes (Wrapped in DashboardLayout) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={
            user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/trainee/dashboard" />
        } />
        <Route path="/admin/dashboard" element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />
        } />
        <Route path="/trainee/dashboard" element={
             <TraineeDashboard />
        } />

        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/users" 
          element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/admin/content" 
          element={user?.role === 'admin' ? <ContentUpload /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/admin/exams" 
          element={user?.role === 'admin' ? <GeneratedExamsList /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/admin/exams/create" 
          element={user?.role === 'admin' ? <ExamGenerator /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/admin/exams/:id" 
          element={user?.role === 'admin' ? <ExamDetails /> : <Navigate to="/dashboard" />} 
        />

        {/* Trainee Routes */}
        <Route 
          path="/trainee/exam/:assignmentId" 
          element={user?.role === 'trainee' ? <TraineeExamInterface /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/trainee/exam/:assignmentId/result" 
          element={<ExamResult />} 
        />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
