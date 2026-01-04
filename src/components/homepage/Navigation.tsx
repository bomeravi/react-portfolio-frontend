import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, logout as apiLogout } from '../../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

// Define types for the user profile
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  last_login?: string;
}

export default function Navigation() {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const sections: string[] = ['About', 'Skills', 'Experience', 'Projects', 'Portfolio', 'Blogs', 'Contact'];

  // Fetch profile using React Query with proper typing
  const { data: user, isLoading: userLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    sections.forEach(item => {
      const id = item.toLowerCase().replace(' ', '-');
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const hero = document.getElementById('hero');
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Close user menu on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent): void => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = async (): Promise<void> => {
    await apiLogout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const formatLastLogin = (value?: string): string => {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  // Get user initials safely
  const getUserInitials = (user: UserProfile): string => {
    if (!user.name) return 'U';
    return user.name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Hide navigation when at the top of the page
  if (!isScrolled) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Home Button and Navigation Items */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Home Button */}
              <button
                onClick={() => scrollToSection('hero')}
                className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                Home
              </button>

              {/* Desktop Navigation Items */}
              <div className="hidden md:flex items-center space-x-1">
                {sections.map(item => {
                  const id = item.toLowerCase().replace(' ', '-');
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        if (location.pathname !== '/') {
                          navigate('/');
                          setTimeout(() => {
                            const element = document.getElementById(id);
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          scrollToSection(id);
                        }
                      }}
                      className={`relative px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-medium whitespace-nowrap ${
                        isActive && location.pathname === '/' ? 'text-slate-900 dark:text-white font-semibold' : ''
                      }`}
                    >
                      {item}
                      {isActive && location.pathname === '/' && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}

                {user && (
                  <button
                    onClick={() => navigate('/diaries')}
                    className={`relative px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 font-medium whitespace-nowrap ${
                      location.pathname.startsWith('/diaries') ? 'text-slate-900 dark:text-white font-semibold' : ''
                    }`}
                  >
                    Diaries
                    {location.pathname.startsWith('/diaries') && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Theme Toggle and Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Avatar dropdown shown before theme toggle */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 p-1 rounded-full hover:scale-105 transition-transform"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-slate-200 dark:border-slate-700">
                        {getUserInitials(user)}
                      </div>
                    )}
                  </button>
                ) : (
                  !userLoading && (
                    <button
                      onClick={() => navigate('/login')}
                      className="px-3 py-1 text-sm rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-sm"
                    >
                      Sign in
                    </button>
                  )
                )}

                {/* Dropdown */}
                {isUserMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                            {getUserInitials(user)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 dark:text-white truncate">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Role: {user.role ?? 'User'}
                          </div>
                          {user.last_login && (
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              Last login: {formatLastLogin(user.last_login)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-slate-100 dark:border-slate-700 pt-3">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/admin/profile');
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/admin/settings');
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-slate-900 dark:text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-900 dark:text-white" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-900 dark:text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Slide-in */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="md:hidden fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto z-40"
          >
            <div className="p-4 space-y-2">
              {sections.map((item, index) => {
                const id = item.toLowerCase().replace(' ', '-');
                const isActive = activeSection === id;
                return (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(id)}
                    className={`block w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium ${
                      isActive ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm' : ''
                    }`}
                  >
                    {item}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}