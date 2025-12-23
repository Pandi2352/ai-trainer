import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TraineeDashboard from './pages/dashboard/TraineeDashboard';
import { authService } from './services/auth.service';

function App() {
  const userSession = authService.getCurrentUser();
  const user = userSession?.user;

  const getDashboard = () => {
      if (user?.role === 'admin') return <AdminDashboard />;
      return <TraineeDashboard />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!userSession ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={userSession ? getDashboard() : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
