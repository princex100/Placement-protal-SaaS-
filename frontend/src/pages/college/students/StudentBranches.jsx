import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Manage your college branches and students. Import your batch data to get started.
           </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
           whileTap={{ scale: 0.98 }}
          onClick={() => setIsImportModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl hover:shadow-indigo-500/30"
        >
          <Upload size={18} /> Import Students
        </motion.button>
        
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-neutral-500">Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
           <Users size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No students imported yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-neutral-400">
             Import students in bulk using an Excel sheet. Branches will be created automatically.
            </p>
          </div>
           <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsImportModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25"
          >
            <Upload size={18} /> Import Students
          </motion.button>
        </div>
      ) : (
         <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, index) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => navigate(`/college/dashboard/students/${branch._id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6 transition-all hover:border-indigo-500/20 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5"
           >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400 border border-indigo-500/10 transition-colors group-hover:from-indigo-500/30 group-hover:to-violet-500/20">
                  <GitBranch size={24} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-600 transition-all group-hover:bg-indigo-500 group-hover:text-slate-900 dark:group-hover:text-white">
                   <ChevronRight size={18} />
                </div>
               </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400">
                 <Users size={16} />
                 <span>{branch.totalStudents} Students enrolled</span>
                </div>
              </div>
            </motion.div>
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
