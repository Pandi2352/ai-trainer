import { Card } from 'antd';
import { authService } from '../../services/auth.service';

const AdminDashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
            <span>Welcome, {user?.user?.name} (Admin)</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Assignments" className="shadow-sm">
          <p className="text-gray-500">No active assignments yet.</p>
        </Card>
        <Card title="Pending Grading" className="shadow-sm">
           <p className="text-gray-500">No submissions to grade.</p>
        </Card>
        <Card title="System Performance" className="shadow-sm">
           <p className="text-green-600 font-semibold">System Optimal</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
