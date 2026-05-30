import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Loader2, GitBranch, ChevronRight, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../../../api/axios";
import ImportStudentsModal from "./ImportStudentsModal";

const StudentBranches = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/branches");
      const data = response.data?.data || response.data;
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error(error.response?.data?.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [user?.activePlacementSeason]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Management</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your college branches and students. Import your batch data to get started.
          </p>
        </div>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Upload size={18} /> Import Students
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
            <Users size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No students imported yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Import students in bulk using an Excel sheet. Branches will be created automatically.
            </p>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Upload size={18} /> Import Students
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => navigate(`/college/dashboard/students/${branch._id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500/50 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-blue-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                  <GitBranch size={24} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Users size={16} />
                  <span>{branch.totalStudents} Students enrolled</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImportStudentsModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onSuccess={fetchBranches}
      />
    </div>
  );
};

export default StudentBranches;
