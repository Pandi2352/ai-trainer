import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Dropdown, Avatar, Input } from 'antd';

const Navbar = () => {
  const { user, logout } = useAuth();

  const userMenu = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      key: 'logout',
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ];

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
        <Button 
            type="text" 
            shape="circle" 
            icon={<Bell className="w-5 h-5 text-gray-600" />} 
            className="hover:bg-primary-50 hover:text-primary-600 transition-colors"
        />
        
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
