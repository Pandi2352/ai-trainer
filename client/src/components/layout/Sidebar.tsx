import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  Bot, 
  LogOut, 
  UserCircle,
  Menu,
  ChevronLeft,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { Tooltip } from 'antd';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    ...(isAdmin ? [
      { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/exams', icon: FileText, label: 'Exam History' },
      { path: '/admin/users', icon: Users, label: 'User Management' },
      { path: '/admin/content', icon: UploadCloud, label: 'Content Upload' },
      { path: '/admin/exams/create', icon: Bot, label: 'Generate Exam' },
    ] : [
      { path: '/trainee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]),
    { path: '/profile', icon: UserCircle, label: 'Profile' }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative h-screen flex flex-col border-r border-primary-200 bg-white z-30 shadow-xl shadow-primary-100/50"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-primary-100 bg-primary-50/30">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
          >
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 shrink-0">
                O
             </div>
             <span className="font-bold text-xl bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">OmniTrain</span>
          </motion.div>
        )}
        {collapsed && (
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
                O
             </div>
        )}
      </div>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-primary-200 rounded-full flex items-center justify-center text-primary-600 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all shadow-sm z-40"
      >
        {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          const LinkContent = (
             <NavLink
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 group relative",
                isActive 
                  ? "bg-primary-50 text-primary-700 font-medium" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {isActive && (
                <motion.div 
                   layoutId="active-pill"
                   className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={22} className={clsx("shrink-0 transition-colors", isActive ? "text-primary-600" : "group-hover:text-gray-700")} />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
            </NavLink>
          );

          if (collapsed) {
              return (
                  <Tooltip key={item.path} title={item.label} placement="right" color="#10b981">
                      <div className="flex justify-center">{LinkContent}</div>
                  </Tooltip>
              )
          }

          return <div key={item.path}>{LinkContent}</div>
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-primary-100 bg-gray-50/50">
         <button 
            onClick={logout}
            className={clsx(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group",
                collapsed && "justify-center"
            )}
         >
            <LogOut size={22} className="group-hover:text-red-500 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap overflow-hidden">Logout</span>}
         </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
