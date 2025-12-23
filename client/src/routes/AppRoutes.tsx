import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TraineeDashboard from '../pages/dashboard/TraineeDashboard';
import UserManagement from '../pages/admin/UserManagement';
import Profile from '../pages/common/Profile';
import LandingPage from '../pages/LandingPage';
import ContentUpload from '../pages/admin/ContentUpload';
import { authService } from '../services/auth.service';

const AppRoutes = () => {
  const userSession = authService.getCurrentUser();
  const user = userSession?.user;

  const getDashboard = () => {
    if (user?.role === 'admin') return <AdminDashboard />;
    return <TraineeDashboard />;
  };

  return (
    <Routes>
      <Route path="/" element={!userSession ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!userSession ? <Login /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={userSession ? getDashboard() : <Navigate to="/login" />} />
      <Route path="/profile" element={userSession ? <Profile /> : <Navigate to="/login" />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/users" 
        element={userSession?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/admin/content" 
        element={userSession?.role === 'admin' ? <ContentUpload /> : <Navigate to="/dashboard" />} 
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
