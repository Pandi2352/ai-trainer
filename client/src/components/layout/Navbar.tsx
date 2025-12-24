import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Dropdown, Avatar, Input } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
        const response = await axiosInstance.get('/notifications');
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.isRead).length);
        }
    } catch (error) {
        console.error('Failed to fetch notifications', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
        try {
            await axiosInstance.patch(`/notifications/${notification._id}/read`);
            setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    }
    if (notification.link) {
        navigate(notification.link);
    }
  };

  const userMenu = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ];

  const notificationMenu = {
    items: notifications.length > 0 ? notifications.map((n) => ({
        key: n._id,
        label: (
            <div 
                className={`flex gap-3 p-2 max-w-sm ${!n.isRead ? 'bg-blue-50/50 -mx-2 px-4' : ''}`}
                onClick={() => handleNotificationClick(n)}
            >
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                    <p className={`text-sm mb-0.5 ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                        {n.message}
                    </p>
                    <span className="text-xs text-gray-400">{dayjs(n.createdAt).fromNow()}</span>
                </div>
            </div>
        )
    })) : [{ key: 'empty', label: <div className="text-center p-4 text-gray-500">No new notifications</div> }]
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-primary-200 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-full max-w-md hidden md:block">
             <Input 
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                placeholder="Search..." 
                className="bg-gray-50 border-gray-200 hover:bg-white hover:border-primary-400 focus:border-primary-500 transition-all rounded-full"
                variant="filled"
             />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']} arrow={{ pointAtCenter: true }}>
            <div className="relative cursor-pointer">
                <Button 
                    type="text" 
                    shape="circle" 
                    icon={<Bell className="w-5 h-5 text-gray-600" />} 
                    className="hover:bg-primary-50 hover:text-primary-600 transition-colors"
                />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </div>
        </Dropdown>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-primary-100">
            <Avatar 
                src={user?.avatar} 
                className="bg-primary-100 text-primary-700 font-semibold border-2 border-primary-200"
            >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <div className="hidden md:block text-sm">
                <p className="font-semibold text-gray-700 leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-primary-600 font-medium">{user?.role || 'Trainee'}</p>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
