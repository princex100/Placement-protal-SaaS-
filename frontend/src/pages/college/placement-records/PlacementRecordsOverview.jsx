import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Users, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";


const PlacementRecordsOverview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get("/placement-records");
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setRecords(data);
        }
      } catch (error) {
        console.warn("Backend not ready or failed:", error);
      } finally {
         setLoading(false);
      }
    };

    fetchRecords();
  }, [user?.activePlacementSeason]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
         </div>
        <p className="text-sm font-medium text-slate-600 dark:text-neutral-500">Loading placement records...</p>
      </div>
    );
   }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Records</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Overview of branch-wise placement statistics and student placement details.
         </p>
         </div>
      </div>

      {records.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No placement records yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Create academic branches in the Students section first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record, index) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.02, y: -4 }}
             className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6 transition-all hover:border-indigo-500/20 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5"
              onClick={() => navigate(`/college/dashboard/placement-records/${record._id}`)}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400 border border-indigo-500/10">
                  <Building2 size={24} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-600 transition-all group-hover:bg-indigo-500 group-hover:text-slate-900 dark:group-hover:text-white">
                  <ArrowRight size={16} />
                </div>
             </div>

              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{record.branchName}</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-neutral-400">
                    <Users size={16} /> Total Students
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{record.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-neutral-400">
                    <GraduationCap size={16} /> Eligible
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{record.eligibleStudents}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-neutral-400">
                    <Building2 size={16} /> Placed
                  </span>
                  <span className="font-bold text-emerald-400">{record.placedStudents}</span>
                </div>
              </div>

              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${record.eligibleStudents ? (record.placedStudents / record.eligibleStudents) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementRecordsOverview;
