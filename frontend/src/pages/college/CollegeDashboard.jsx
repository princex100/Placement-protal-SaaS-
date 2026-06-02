import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Calendar,
  ChevronRight,
  FileText,
  PlusSquare,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  Target,
  Award,
  GraduationCap,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../../redux/features/authSlice";
import api from "../../api/axios";

// Import placement record pages
import PlacementRecordsOverview from "./placement-records/PlacementRecordsOverview";
import BranchPlacementDetails from "./placement-records/BranchPlacementDetails";
import StudentProfileDetails from "./placement-records/StudentProfileDetails";

import DriveApplications from "./placement-drives/DriveApplications";
import ApplicationDetails from "./applications/ApplicationDetails";
import StudentBranches from "./students/StudentBranches";
import BranchStudents from "./students/BranchStudents";

import PlacementDrives from "./placement-drives/PlacementDrives";
import CreatePlacementDrive from "./placement-drives/CreatePlacementDrive";
import DriveDetails from "./placement-drives/DriveDetails";
import DriveStudents from "./placement-drives/DriveStudents";

// ----------------------------------------------------------------------
// STATIC DATA (Navigation)
// ----------------------------------------------------------------------
const SIDEBAR_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/college/dashboard" },
  { label: "Students", icon: Users, path: "/college/dashboard/students" },
  { label: "Placement Records", icon: FileText, path: "/college/dashboard/placement-records" },
  { label: "Placement Drives", icon: Briefcase, path: "/college/dashboard/placement-drives" },
  { label: "Add Drive", icon: PlusSquare, path: "/college/dashboard/placement-drives/create" },
  { label: "Settings", icon: Settings, path: "/college/dashboard/settings" },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
const CollegeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- STATE ---
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    eligibleStudents: 0,
    placedStudents: 0,
    placementRate: 0,
    totalApplications: 0,
    activeDrives: 0,
    latestDrives: [],
  });
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- API FUNCTIONS ---
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/colleges/dashboard/stats");
      
      setDashboardStats(
        response.data?.data || response.data || {
          totalStudents: 0,
          eligibleStudents: 0,
          placedStudents: 0,
          placementRate: 0,
          totalApplications: 0,
          activeDrives: 0,
          latestDrives: []
        }
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
      setDashboardStats({
        totalStudents: 0,
        eligibleStudents: 0,
        placedStudents: 0,
        placementRate: 0,
        totalApplications: 0,
        activeDrives: 0,
        latestDrives: []
      });
    }
  };

  const fetchCurrentCollege = async () => {
    try {
      const response = await api.get("/colleges/current");
      const data = response.data?.data || response.data;
      setCollegeData(data || null);
      if (data) {
        dispatch(setCredentials({ user: data, role: data.role || "college" }));
      }
    } catch (error) {
      console.error("Error fetching current college:", error);
      setCollegeData(null);
      // Optional: if unauthorized, dispatch clearCredentials and redirect
      if (error?.response?.status === 401) {
        dispatch(clearCredentials());
        navigate("/college/auth");
      }
    }
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await Promise.allSettled([
        fetchDashboardStats(),
        fetchCurrentCollege(),
      ]);

      setLoading(false);
    };

    fetchData();
  }, [user?.activePlacementSeason]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/college/auth");
  };

  const actionColorClasses = {
    indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-neutral-100">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-violet-500/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-500/3 rounded-full blur-[150px] sm:blur-[200px]" />
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex justify-center items-center shadow-lg shadow-indigo-500/25">
              <GraduationCap className="size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-white">Placement</span>
              <span className="text-neutral-500 text-[10px] font-medium">Portal</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="size-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 h-full w-[280px] bg-[#0a0a12] border-r border-white/[0.06] p-5 lg:hidden"
            >
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 px-3 mb-8">
                <div className="size-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex justify-center items-center shadow-lg shadow-indigo-500/25">
                  <GraduationCap className="size-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm tracking-tight text-white">Placement</span>
                  <span className="text-neutral-500 text-xs font-medium">Portal</span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1">
                {SIDEBAR_NAV.map((item) => {
                  const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/college/dashboard" && !(item.path === "/college/dashboard/placement-drives" && location.pathname.startsWith("/college/dashboard/placement-drives/create")));
                  const isDashboardActive = item.path === "/college/dashboard" && location.pathname === "/college/dashboard";
                  const isItemActive = item.path === "/college/dashboard" ? isDashboardActive : isActive;
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                        isItemActive
                          ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 text-white font-medium shadow-lg shadow-indigo-500/5"
                          : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon size={18} className={isItemActive ? "text-indigo-400" : ""} />
                      {item.label}
                      {isItemActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="ml-auto size-1.5 rounded-full bg-indigo-400"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile Logout */}
              <div className="absolute bottom-5 left-5 right-5">
                <motion.button
                  onClick={handleLogout}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={18} />
                  Logout Account
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative mx-auto flex max-w-[1600px] gap-6 px-3 sm:px-4 py-4 lg:px-6 lg:py-5">
        {/* SIDEBAR - Desktop only */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-5 hidden h-[calc(100vh-40px)] w-[280px] flex-col justify-between rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 lg:flex"
        >
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 px-3 mb-8">
              <div className="size-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex justify-center items-center shadow-lg shadow-indigo-500/25">
                <GraduationCap className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-white">Placement</span>
                <span className="text-neutral-500 text-xs font-medium">Portal</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
              {SIDEBAR_NAV.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/college/dashboard" && !(item.path === "/college/dashboard/placement-drives" && location.pathname.startsWith("/college/dashboard/placement-drives/create")));
                const isDashboardActive = item.path === "/college/dashboard" && location.pathname === "/college/dashboard";
                const isItemActive = item.path === "/college/dashboard" ? isDashboardActive : isActive;
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                      isItemActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 text-white font-medium shadow-lg shadow-indigo-500/5"
                        : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={18} className={isItemActive ? "text-indigo-400" : ""} />
                    {item.label}
                    {isItemActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto size-1.5 rounded-full bg-indigo-400"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
            Logout Account
          </motion.button>
        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 pb-12">
          <Routes>
            <Route path="/" element={
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[60vh] flex-col items-center justify-center gap-4"
                  >
                    <div className="relative">
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
                      <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-indigo-500/20" />
                    </div>
                    <p className="text-sm font-medium text-neutral-500">Loading dashboard...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Top Welcome Section */}
                    <motion.div
                      variants={fadeInUp}
                      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-4 sm:p-6 lg:p-8"
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-1/4 w-16 sm:w-32 h-16 sm:h-32 bg-blue-500/10 rounded-full blur-2xl" />

                      <div className="relative flex flex-col gap-4 sm:gap-6">
                        <div className="flex-1">
                          <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3 sm:mb-4"
                          >
                            <Sparkles className="size-3 sm:size-3.5 text-indigo-400" />
                            <span className="text-[10px] sm:text-xs font-medium text-indigo-300">Dashboard Overview</span>
                          </motion.div>
                          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 sm:mb-3">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{collegeData?.name || "College"}</span>
                          </h1>
                          <p className="text-neutral-400 text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed">
                            Manage students, track active placement drives, and monitor campus recruitment analytics.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 sm:px-5 py-3 sm:py-3.5 backdrop-blur-sm"
                          >
                            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400">
                              <Calendar size={16} className="sm:hidden" />
                              <Calendar size={18} className="hidden sm:block" />
                            </div>
                            <div>
                              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-neutral-500">Current Session</p>
                              <p className="text-xs sm:text-sm font-bold text-white">
                                {user?.activePlacementSeason || collegeData?.currentSession || "Placement Season"}
                              </p>
                            </div>
                          </motion.div>

                          <motion.button
                            onClick={() => navigate('/college/dashboard/placement-drives/create')}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex h-12 sm:h-[60px] items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 sm:px-6 font-semibold text-white text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl hover:shadow-indigo-500/30"
                          >
                            <PlusSquare size={16} className="sm:hidden" />
                            <PlusSquare size={18} className="hidden sm:block" />
                            Add Drive
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                      <StatCard
                        title="Total Students"
                        value={dashboardStats?.totalStudents || 0}
                        icon={Users}
                        trend="Total enrolled"
                        progress={dashboardStats?.totalStudents > 0 ? 100 : 0}
                        color="blue"
                        delay={0}
                      />
                      <StatCard
                        title="Eligible Students"
                        value={dashboardStats?.eligibleStudents || 0}
                        icon={CheckSquare}
                        trend="Ready for placement"
                        progress={dashboardStats?.totalStudents > 0 ? (dashboardStats.eligibleStudents / dashboardStats.totalStudents) * 100 : 0}
                        color="emerald"
                        delay={0.1}
                      />
                      <StatCard
                        title="Active Drives"
                        value={dashboardStats?.activeDrives || 0}
                        icon={Target}
                        trend="Currently open"
                        progress={dashboardStats?.activeDrives > 0 ? 100 : 0}
                        color="violet"
                        delay={0.2}
                      />
                      <StatCard
                        title="Placement Rate"
                        value={`${dashboardStats?.placementRate || 0}%`}
                        icon={TrendingUp}
                        trend="Of eligible students"
                        progress={dashboardStats?.placementRate || 0}
                        color="amber"
                        delay={0.3}
                      />
                    </motion.div>

                    {/* Middle Layout */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                      {/* Latest Placement Drives */}
                      <motion.div
                        variants={fadeInUp}
                        className="flex flex-col rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 lg:col-span-2"
                      >
                        <div className="mb-4 sm:mb-6 flex items-center justify-between">
                          <div>
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Latest Placement Drives</h2>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">Recently created job opportunities</p>
                          </div>
                          <motion.button
                            onClick={() => navigate('/college/dashboard/placement-drives')}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            View All
                            <ArrowUpRight size={12} className="sm:hidden" />
                            <ArrowUpRight size={14} className="hidden sm:block" />
                          </motion.button>
                        </div>

                        <div className="flex-1 space-y-2 sm:space-y-3">
                          {!Array.isArray(dashboardStats?.latestDrives) || dashboardStats.latestDrives.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl sm:rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.01]">
                              <p className="text-sm font-medium text-neutral-500">
                                No placement drives yet
                              </p>
                              <button 
                                onClick={() => navigate('/college/dashboard/placement-drives/create')}
                                className="rounded-xl bg-white/[0.04] px-4 py-2 text-sm font-semibold text-indigo-400 transition hover:bg-white/[0.06]"
                              >
                                Create First Drive
                              </button>
                            </div>
                          ) : (
                            dashboardStats.latestDrives.map((drive, index) => (
                              <motion.div
                                key={drive._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/college/dashboard/placement-drives/${drive._id}`)}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="group relative flex cursor-pointer flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 sm:p-4 lg:p-5 transition-all hover:border-indigo-500/20 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-base sm:text-lg lg:text-xl font-bold text-indigo-300 border border-indigo-500/10 shrink-0">
                                    {drive.logo || <Building2 size={24} className="text-indigo-400" />}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors truncate">
                                      {drive.companyName || "Unknown Company"}
                                    </h4>
                                    <div className="mt-0.5 sm:mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-500">
                                      <span className="truncate">{drive.role || "Role not specified"}</span>
                                      <span className="h-1 w-1 rounded-full bg-neutral-700 hidden sm:block" />
                                      <span className="font-semibold text-emerald-400">{drive.package} LPA</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                  <div className="flex flex-col sm:items-end">
                                    <span
                                      className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                                        drive.status === "open"
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : "bg-neutral-800 text-neutral-400"
                                      }`}
                                    >
                                      {drive.status}
                                    </span>
                                    <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-neutral-500">
                                      {drive.appliedStudentsCount} Applied
                                    </span>
                                  </div>
                                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/[0.04] text-neutral-500 transition-all group-hover:bg-indigo-500 group-hover:text-white">
                                    <ChevronRight size={16} className="sm:hidden" />
                                    <ChevronRight size={18} className="hidden sm:block" />
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </motion.div>

                      {/* Right Column */}
                      <motion.div variants={staggerContainer} className="flex flex-col gap-3 sm:gap-4 lg:col-span-1">
                        {/* Secondary Stats */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <QuickStatCard
                            title="Placed Students"
                            value={dashboardStats?.placedStudents || 0}
                            icon={Award}
                            color="emerald"
                          />
                          <QuickStatCard
                            title="Applications"
                            value={dashboardStats?.totalApplications || 0}
                            icon={FileText}
                            color="violet"
                            onClick={() => navigate('/college/dashboard/placement-drives')}
                          />
                        </div>

                        {/* Quick Actions */}
                        <motion.div
                          variants={fadeInUp}
                          className="flex flex-col rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-4 sm:p-5"
                        >
                          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-white">Quick Actions</h3>
                          <div className="space-y-2">
                            {[
                              { icon: Briefcase, label: "Add Placement Drive", color: "indigo", path: '/college/dashboard/placement-drives/create' },
                              { icon: Users, label: "Manage Students", color: "blue", path: '/college/dashboard/students' },
                              { icon: FileText, label: "Placement Records", color: "violet", path: '/college/dashboard/placement-records' },
                              { icon: BarChart3, label: "View Analytics", color: "emerald", path: '/college/dashboard/reports' },
                            ].map((action, index) => (
                              <motion.button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex w-full items-center justify-between rounded-lg sm:rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 sm:p-4 transition-all hover:border-indigo-500/20 hover:bg-white/[0.04] group"
                              >
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className={`size-7 sm:size-9 rounded-md sm:rounded-lg ${actionColorClasses[action.color].bg} flex items-center justify-center`}>
                                    <action.icon size={14} className={`${actionColorClasses[action.color].text} sm:hidden`} />
                                    <action.icon size={16} className={`${actionColorClasses[action.color].text} hidden sm:block`} />
                                  </div>
                                  <span className="font-medium text-xs sm:text-sm text-neutral-300 group-hover:text-white transition-colors">
                                    {action.label}
                                  </span>
                                </div>
                                <ChevronRight size={14} className="text-neutral-600 group-hover:text-neutral-400 transition-colors sm:hidden" />
                                <ChevronRight size={16} className="text-neutral-600 group-hover:text-neutral-400 transition-colors hidden sm:block" />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>


                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            } />
            <Route path="students" element={<StudentBranches />} />
            <Route path="students/:branchId" element={<BranchStudents />} />
            <Route path="placement-records" element={<PlacementRecordsOverview />} />
            <Route path="placement-records/:branchId" element={<BranchPlacementDetails />} />
            <Route path="student-profile/:studentId" element={<StudentProfileDetails />} />
            <Route path="placement-drives" element={<PlacementDrives />} />
            <Route path="placement-drives/create" element={<CreatePlacementDrive />} />
            <Route path="placement-drives/:driveId" element={<DriveDetails />} />
            <Route path="placement-drives/:driveId/students" element={<DriveStudents />} />
            <Route path="placement-drives/:driveId/applications" element={<DriveApplications />} />
            <Route path="applications/:applicationId" element={<ApplicationDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// SUBCOMPONENTS
// ----------------------------------------------------------------------

const colorClasses = {
  blue: {
    bg: "from-blue-500/20 to-blue-500/5",
    icon: "text-blue-400",
    progress: "from-blue-500 to-blue-400",
    border: "border-blue-500/20",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-500/5",
    icon: "text-emerald-400",
    progress: "from-emerald-500 to-emerald-400",
    border: "border-emerald-500/20",
  },
  violet: {
    bg: "from-violet-500/20 to-violet-500/5",
    icon: "text-violet-400",
    progress: "from-violet-500 to-violet-400",
    border: "border-violet-500/20",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-500/5",
    icon: "text-amber-400",
    progress: "from-amber-500 to-amber-400",
    border: "border-amber-500/20",
  },
  indigo: {
    bg: "from-indigo-500/20 to-indigo-500/5",
    icon: "text-indigo-400",
    progress: "from-indigo-500 to-indigo-400",
    border: "border-indigo-500/20",
  }
};

const StatCard = ({ title, value, icon: Icon, trend, progress, color, delay = 0 }) => {
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-3 sm:p-4 lg:p-6 transition-shadow hover:shadow-lg hover:shadow-${color}-500/5`}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />

      <div className="relative">
        <div className="mb-2 sm:mb-3 lg:mb-4 flex items-center justify-between">
          <div
            className={`flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.icon} border ${colors.border}`}
          >
            <Icon size={16} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block lg:hidden" />
            <Icon size={22} className="hidden lg:block" />
          </div>
          <span className={`text-[9px] sm:text-[10px] lg:text-xs font-semibold ${colors.icon} hidden sm:block`}>{trend}</span>
        </div>

        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-white">{value}</h3>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm font-medium text-neutral-500 truncate">{title}</p>

        <div className="mt-2 sm:mt-3 lg:mt-5 h-1 sm:h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${colors.progress}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const QuickStatCard = ({ title, value, icon: Icon, color, onClick }) => {
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-3 sm:p-4 lg:p-5 transition-all hover:border-indigo-500/20 ${onClick ? 'hover:shadow-md hover:shadow-indigo-500/10' : ''}`}
    >
      <div className={`size-8 sm:size-9 lg:size-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon size={14} className={`${colors.icon} sm:hidden`} />
        <Icon size={16} className={`${colors.icon} hidden sm:block lg:hidden`} />
        <Icon size={18} className={`${colors.icon} hidden lg:block`} />
      </div>
      <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{value.toLocaleString()}</h4>
      <div className="mt-0.5 sm:mt-1 flex items-center justify-between">
        <p className="text-[10px] sm:text-xs font-medium text-neutral-500 truncate">{title}</p>
        <ChevronRight size={12} className="text-neutral-700 sm:hidden shrink-0" />
        <ChevronRight size={14} className="text-neutral-700 hidden sm:block shrink-0" />
      </div>
    </motion.div>
  );
};

export default CollegeDashboard;
