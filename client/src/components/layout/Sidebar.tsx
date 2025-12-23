import { Layout, Menu } from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  DashboardOutlined, 
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const adminItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: '/admin/content',
      icon: <UploadOutlined />,
      label: 'Content Upload',
    },
    // Future Question Engine Item
    // {
    //   key: '/admin/questions',
    //   icon: <QuestionCircleOutlined />,
    //   label: 'Questions',
    // },
  ];

  const traineeItems = [
    {
      key: '/trainee/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    // Future Trainee Items
    // {
    //   key: '/my-tests',
    //   icon: <FileProtectOutlined />,
    //   label: 'My Tests',
    // },
  ];

  const commonItems = [
    {
      key: '/profile',
      icon: <ProfileOutlined />,
      label: 'Profile',
    },
    {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true,
    }
  ];

  const menuItems = [
      ...(isAdmin ? adminItems : traineeItems),
      ...commonItems
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
      if (key === 'logout') {
          logout();
      } else {
          navigate(key);
      }
  };

  return (
    <Sider theme="light" collapsible breakpoint="lg">
      <div className="h-16 flex items-center justify-center border-b">
        <h2 className="text-lg font-bold text-primary">OmniTrain</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="h-full border-r-0"
      />
    </Sider>
  );
};

export default Sidebar;
