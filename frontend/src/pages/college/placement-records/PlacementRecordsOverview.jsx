import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, Users, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import api from "../../../api/axios";


const PlacementRecordsOverview = () => {
  const navigate = useNavigate();
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
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
        <p className="text-sm font-medium text-slate-500">Loading placement records...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Records</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Overview of branch-wise placement statistics and student placement details.
          </p>
        </div>
      </div>

      {records.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800">
            <Building2 size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No placement records yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create academic branches in the Students section first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex cursor-pointer flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-blue-500/30"
              onClick={() => navigate(`/college/dashboard/placement-records/${record._id}`)}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Building2 size={24} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
                  <ArrowRight size={16} />
                </div>
              </div>

              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{record.branchName}</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Users size={16} /> Total Students
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{record.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <GraduationCap size={16} /> Eligible
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{record.eligibleStudents}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} /> Placed
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{record.placedStudents}</span>
                </div>
              </div>

              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${record.eligibleStudents ? (record.placedStudents / record.eligibleStudents) * 100 : 0}%` }} 
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
