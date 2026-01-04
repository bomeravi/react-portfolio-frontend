import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, BellIcon, MoonIcon, SunIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

interface AdminTopBarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Dummy notifications
  const notifications = [
    { id: 1, message: 'New blog comment', read: false },
    { id: 2, message: 'User signup', read: false },
    { id: 3, message: 'System update', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout function which returns message from API
      const result = await logout();
      
      // Navigate to login
      navigate('/login');
    } catch (err: any) {
      // Catch any unexpected errors
      addToast('Logout failed', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center justify-between h-16 sticky top-0 z-30">
      {/* Left - Menu Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSidebar}
        className="inline-flex items-center justify-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
      >
        <MenuIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
      </motion.button>

      {/* Right - Controls */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* Language Selector - Hidden on Mobile */}
        <select className="hidden sm:block text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded px-3 py-2 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors cursor-pointer">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {isNotifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 z-50"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Mark all as read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="p-3 border-b border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      <p
                        className={`text-sm ${
                          notif.read
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white font-medium'
                        }`}
                      >
                        {notif.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No notifications
                  </div>
                )}
              </div>

              <button className="w-full p-3 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-t border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium">
                View all notifications
              </button>
            </motion.div>
          )}
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <SunIcon className="w-6 h-6 text-yellow-500" />
          ) : (
            <MoonIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          )}
        </motion.button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map(s => s[0])
                      .slice(0, 2)
                      .join('')
                  : 'U'}
              </div>
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white hidden lg:inline whitespace-nowrap">
              {user?.name}
            </span>
          </motion.button>

          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 z-50"
            >
              <div className="p-3 border-b border-slate-200 dark:border-slate-600">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{user?.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Role: <span className="text-blue-600 dark:text-blue-400 font-medium">{user?.role ?? 'User'}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate('/admin/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate('/admin/settings');
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-slate-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOutIcon className="w-4 h-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}