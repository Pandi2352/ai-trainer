import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const TraineeDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trainee Dashboard</h1>
        <div className="flex items-center gap-4">
            <span>Welcome, {user?.user?.name} (Trainee)</span>
            <Button onClick={() => navigate('/profile')}>Profile</Button>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="To Do Assignments" className="shadow-sm">
          <p className="text-gray-500">You have no pending assignments.</p>
        </Card>
        <Card title="Completed" className="shadow-sm">
           <p className="text-gray-500">No completed history.</p>
        </Card>
      </div>
    </div>
  );
};

export default TraineeDashboard;
