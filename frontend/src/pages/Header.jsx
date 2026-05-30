import React, { useState, useEffect } from 'react';
import { ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials, updateUser } from '../redux/features/authSlice';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  const currentYear = new Date().getFullYear();
  const availableSeasons = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleSeasonChange = async (e) => {
    const selectedSeason = e.target.value;
    try {
      const res = await api.patch('/colleges/placement-season', { placementSeasonYear: selectedSeason });
      if (res.data.success) {
        dispatch(updateUser({ activePlacementSeason: Number(selectedSeason) }));
        toast.success(`Switched to season ${selectedSeason}`);
      }
    } catch (error) {
      console.error("Failed to update season", error);
    }
  };

  // Use Redux state instead of localStorage
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  // Smooth scroll handler
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    // Optionally call backend logout endpoint here
    dispatch(clearCredentials());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" onClick={(e) => scrollToSection(e, 'top')} className="flex items-center gap-2 text-blue-600 dark:text-blue-500 transition-transform duration-200 active:scale-95">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Placement<span className="text-blue-600 dark:text-blue-500">Portal</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/" onClick={(e) => scrollToSection(e, 'top')} className="inline-block text-sm font-medium text-slate-600 transition-all duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:-translate-y-0.5 active:scale-95">Home</a>
          <a href="/#features" onClick={(e) => scrollToSection(e, 'features')} className="inline-block text-sm font-medium text-slate-600 transition-all duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:-translate-y-0.5 active:scale-95">Features</a>
          <a href="/#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="inline-block text-sm font-medium text-slate-600 transition-all duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:-translate-y-0.5 active:scale-95">How It Works</a>
          <a href="/#contact" onClick={(e) => scrollToSection(e, 'contact')} className="inline-block text-sm font-medium text-slate-600 transition-all duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:-translate-y-0.5 active:scale-95">Contact</a>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Premium Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="relative flex h-8 w-14 items-center rounded-full bg-slate-200 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            aria-label="Toggle Theme"
          >
            <div className="flex w-full justify-between px-1">
              <Sun size={14} className="text-amber-500" />
              <Moon size={14} className="text-blue-400" />
            </div>
            <motion.div
              className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-shadow dark:bg-slate-950"
              animate={{ x: isDark ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {isDark ? <Moon size={12} className="text-blue-400" /> : <Sun size={12} className="text-amber-500" />}
            </motion.div>
          </button>

          {isAuthenticated && role === 'college-admin' && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">Season:</span>
              <select
                value={user?.activePlacementSeason || currentYear}
                onChange={handleSeasonChange}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                {availableSeasons.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {isAuthenticated ? (
            <div className="relative">

              <button
                onClick={() =>
                  setShowProfileMenu(!showProfileMenu)
                }
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                  <User size={18} />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition duration-300 ${showProfileMenu
                      ? "rotate-180"
                      : ""
                    }`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

                  <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">

                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(user?.role === 'student' ? '/student/dashboard' : (user?.role === 'college-admin' ? '/college/dashboard' : '/'))}
                    className="flex w-full items-center gap-3 px-5 py-3 text-sm text-slate-700 transition-all hover:bg-slate-50 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800">

                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 transition-all hover:bg-red-50 active:scale-95 dark:hover:bg-red-500/10">

                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Login Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  onBlur={() => setTimeout(() => setShowLoginMenu(false), 200)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Login
                  <ChevronDown size={16} className={`transition-transform duration-200 ${showLoginMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLoginMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 z-50">
                    <button
                      onMouseDown={() => navigate('/college/auth')}
                      className="flex w-full items-center px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Login for College
                    </button>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
                    <button
                      onMouseDown={() => navigate('/student/auth')}
                      className="flex w-full items-center px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Login for Student
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => scrollToSection(e, 'portalSelection')}
                className="hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95 sm:block"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
