import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StudentSidebar from "./components/StudentSidebar";
import api from "../../api/axios";
import { setCredentials, clearCredentials } from "../../redux/features/authSlice";

const StudentDashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Fetch current student profile on mount to ensure freshness
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get("/students/current");
        const data = response.data?.data || response.data;
        if (data) {
          dispatch(setCredentials({ user: data, role: data.role || "student" }));
        }
      } catch (error) {
        console.error("Error fetching current student:", error);
        if (error.response?.status === 401) {
          dispatch(clearCredentials());
          navigate("/student/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-8 px-6 py-5 lg:px-8 lg:py-6">
        
        {/* SIDEBAR */}
        <StudentSidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 space-y-8 pb-12">
          {loading ? (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your workspace...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
