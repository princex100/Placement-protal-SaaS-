import React from "react";
import { LayoutDashboard, User, Briefcase, FileText, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../../redux/features/authSlice";

const SIDEBAR_NAV = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/student/dashboard" },
  { label: "Profile", icon: <User size={20} />, path: "/student/dashboard/profile" },
  { label: "Placement Drives", icon: <Briefcase size={20} />, path: "/student/dashboard/drives" },
  { label: "Application Status", icon: <FileText size={20} />, path: "/student/dashboard/applications" },
];

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-96px)] w-[260px] flex-col justify-between rounded-[32px] border border-blue-100/50 bg-white/80 backdrop-blur-md p-5 shadow-[0_8px_30px_rgb(37,99,235,0.04)] dark:border-slate-800/60 dark:bg-slate-900 lg:flex">
      <div className="space-y-1.5">
        {SIDEBAR_NAV.map((item) => {
          // Exact match for dashboard, startswith for others
          const isActive = item.path === "/student/dashboard" 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
            
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-50/80 to-transparent border-l-2 border-blue-500 text-blue-600 font-semibold dark:from-blue-900/20 dark:to-transparent dark:text-blue-400"
                  : "font-medium text-slate-500 hover:bg-blue-50/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <button 
        onClick={handleLogout}
        className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      >
        <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
        Logout Account
      </button>
    </aside>
  );
};

export default StudentSidebar;
