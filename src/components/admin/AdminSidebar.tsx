import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  TagIcon,
  SettingsIcon,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/admin' },
    { icon: FileTextIcon, label: 'Blogs', path: '/admin/blogs' },
    { icon: TagIcon, label: 'Categories', path: '/admin/categories' },
    { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: isOpen ? 256 : 0, 
        opacity: isOpen ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-hidden z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 px-3 py-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          // make /admin match only exactly, other routes match exact or as parent (prefix)
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}