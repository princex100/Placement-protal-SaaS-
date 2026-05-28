import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../../redux/features/authSlice";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Calendar,
  Building2,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

// ----------------------------------------------------------------------
// STATIC DATA (Navigation)
// ----------------------------------------------------------------------
const SIDEBAR_NAV = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/college/dashboard" },
  { label: "Students", icon: <Users size={20} />, path: "/college/dashboard/students" },
  { label: "Incoming Drives", icon: <Briefcase size={20} />, path: "/college/dashboard/incoming-drives" },
  { label: "Approved Drives", icon: <CheckSquare size={20} />, path: "/college/dashboard/approved-drives" },
  { label: "Reports", icon: <BarChart3 size={20} />, path: "/college/dashboard/reports" },
  { label: "Settings", icon: <Settings size={20} />, path: "/college/dashboard/settings" },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
const CollegeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- STATE ---
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    partnerCompanies: 0,
    placementRate: 0,
  });
  const [incomingDrives, setIncomingDrives] = useState([]);
  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- API FUNCTIONS ---
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/colleges/dashboard/stats");
      
      setDashboardStats(
        response.data?.data || response.data || {
          totalStudents: 0,
          pendingApprovals: 0,
          partnerCompanies: 0,
          placementRate: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      if (error.response?.status === 401) {
        dispatch(clearCredentials());
        navigate("/college/auth");
      }
    }
  };

  const fetchIncomingDrives = async () => {
    try {
      const response = await api.get("/colleges/dashboard/incoming-drives");
      const data = response.data?.data || response.data;
      setIncomingDrives(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching incoming drives:", error);
      setIncomingDrives([]); 
    }
  };

  /* Temporarily removed until backend route is built
  const fetchPlacementProgress = async () => {
    try {
      const response = await axios.get("/api/v1/college/dashboard/placement-progress", {
        withCredentials: true,
      });
      const data = response.data?.data || response.data;
      setDepartmentProgress(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching placement progress:", error);
      setDepartmentProgress([]); 
    }
  };
  */

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await Promise.allSettled([
        fetchDashboardStats(),
        fetchCurrentCollege(),
        fetchIncomingDrives(),
        // fetchPlacementProgress(),
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-8 px-6 py-5 lg:px-8 lg:py-6">
        
        {/* SIDEBAR */}
        <aside className="sticky top-24 hidden h-[calc(100vh-96px)] w-[260px] flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800/60 dark:bg-slate-900 lg:flex">
          <div className="space-y-1.5">
            {SIDEBAR_NAV.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm dark:bg-blue-900/20 dark:text-blue-400"
                      : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          <button className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400">
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            Logout Account
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-8 pb-12">
          {loading ? (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Top Welcome Section */}
              <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Welcome back, {collegeData?.name || "College"} 👋
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Manage placements, approve drives, and monitor campus recruitment.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-3 dark:bg-slate-800/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Current Semester</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {collegeData?.currentSession || "Placement Season"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/college/dashboard/reports')}
                    className="flex h-[64px] items-center justify-center rounded-2xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    View Reports
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Students Registered" 
                  value={dashboardStats?.totalStudents || 0} 
                  icon={<Users size={22} />} 
                  trend="Total enrolled" 
                  progress={dashboardStats?.totalStudents > 0 ? 80 : 0} 
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={dashboardStats?.pendingApprovals || 0} 
                  icon={<Briefcase size={22} />} 
                  trend="Requires attention" 
                  progress={dashboardStats?.totalStudents > 0 ? 80 : 0} 
                  isAlert 
                />
                <StatCard 
                  title="Partner Companies" 
                  value={dashboardStats?.partnerCompanies || 0} 
                  icon={<Building2 size={22} />} 
                  trend="Active partners" 
                  progress={dashboardStats?.totalStudents > 0 ? 80 : 0} 
                />
                <StatCard 
                  title="Placement Rate" 
                  value={`${dashboardStats?.placementRate || 0}%`} 
                  icon={<BarChart3 size={22} />} 
                  trend="Of eligible students" 
                  progress={dashboardStats?.totalStudents > 0 ? 80 : 0} 
                />
              </div>

              {/* Middle Layout */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                
                {/* LEFT CARD: Incoming Drives */}
                <div className="flex flex-col rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800/60 dark:bg-slate-900">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Incoming Placement Drives</h2>
                      <p className="text-sm text-slate-500">Recent company requests awaiting approval</p>
                    </div>
                    <button 
                      onClick={() => navigate('/college/dashboard/incoming-drives')}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    {!Array.isArray(incomingDrives) || incomingDrives.length === 0 ? (
                      <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          No incoming drives at the moment
                        </p>
                      </div>
                    ) : (
                      incomingDrives.map((drive) => (
                        <div key={drive._id || drive.id} className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/20 dark:hover:border-slate-700 dark:hover:bg-slate-800 sm:flex-row sm:items-center">
                          
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-700">
                              <Building2 size={20} className="text-slate-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">
                                {drive.company?.name || "Unknown Company"}
                              </h4>
                              <div className="mt-0.5 flex items-center gap-3 text-sm text-slate-500">
                                <span>{drive.role || "Role not specified"}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span className="rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                                  {drive.approvalStatus || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition hover:text-red-500 dark:bg-slate-700 dark:hover:text-red-400">
                              <X size={18} />
                            </button>
                            <button className="flex h-10 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white">
                              <Check size={16} /> Approve
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* RIGHT CARD: Quick Stats (Future features) */}
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-4">
                    <QuickStatCard title="Interviews Scheduled" value="--" />
                    <QuickStatCard title="Offers Released" value="--" />
                    <QuickStatCard title="Drives Approved" value="--" />
                    <QuickStatCard title="Total Departments" value="--" />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// SUBCOMPONENTS
// ----------------------------------------------------------------------

const StatCard = ({ title, value, icon, trend, progress, isAlert = false }) => (
  <div className="group cursor-pointer rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/60 dark:bg-slate-900">
    <div className="mb-4 flex items-center justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isAlert ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div className={`text-xs font-semibold ${isAlert ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
        {trend}
      </div>
    </div>
    
    <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
    
    <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div 
        className={`h-full rounded-full ${isAlert ? 'bg-amber-500' : 'bg-blue-600 dark:bg-blue-500'}`} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  </div>
);

const QuickStatCard = ({ title, value }) => (
  <div className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-slate-700">
    <h4 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h4>
    <div className="mt-2 flex items-center justify-between">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
    </div>
  </div>
);

export default CollegeDashboard;
