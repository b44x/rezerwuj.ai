import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Home, Search, Map, Users as UsersIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  variant?: 'dashboard' | 'profile';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'dashboard' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl font-black tracking-tighter text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition">
            REZERWUJ<span className="text-blue-600 dark:text-blue-500">.AI</span>
          </Link>

          {/* Main Navigation - only show when logged in */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/hotels"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/hotels')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Search className="w-4 h-4" />
                Wyszukiwanie
              </Link>
              <Link
                to="/travel-groups"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/travel-groups')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <UsersIcon className="w-4 h-4" />
                Grupy
              </Link>
              <Link
                to="/map"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/map')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Map className="w-4 h-4" />
                Mapa
              </Link>
            </nav>
          )}

          {/* Theme Toggle + Public Links */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-slate-400 dark:text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Public Links */}
            <nav className="flex items-center gap-1">
            <Link
              to="/blog"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/blog')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Blog
            </Link>
            <Link
              to="/faq"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/faq')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              FAQ
            </Link>
            </nav>
          </div>

          {/* User Menu - only show when logged in */}
          {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 border-2 border-slate-200 dark:border-white/20 flex items-center justify-center font-bold text-sm text-white">
                {user ? getInitials(user.name) : 'U'}
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-b border-slate-200 dark:border-white/10 py-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/hotels"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    <Search className="w-4 h-4" />
                    Wyszukiwanie
                  </Link>
                  <Link
                    to="/travel-groups"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    <UsersIcon className="w-4 h-4" />
                    Grupy Podróżne
                  </Link>
                  <Link
                    to="/map"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    onClick={() => setShowMenu(false)}
                  >
                    <Map className="w-4 h-4" />
                    Mapa
                  </Link>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  onClick={() => setShowMenu(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  Profil i Ustawienia
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj się
                </button>
              </div>
            )}
          </div>
          ) : (
            /* Login button for non-authenticated users */
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition"
            >
              Zaloguj się
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
