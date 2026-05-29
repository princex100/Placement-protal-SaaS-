import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, MapPin, IndianRupee, Users, ArrowRight, Loader2, Calendar } from "lucide-react";
import api from "../../../api/axios";

const DUMMY_DRIVES = [
  {
    _id: "dummy1",
    companyName: "Google",
    role: "Software Engineer",
    package: 24,
    location: "Bangalore",
    applicationDeadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    appliedStudentsCount: 156,
    status: "open",
  },
  {
    _id: "dummy2",
    companyName: "Microsoft",
    role: "Frontend Developer",
    package: 18,
    location: "Hyderabad",
    applicationDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    appliedStudentsCount: 92,
    status: "open",
  },
];

const PlacementDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await api.get("/drives/college");
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setDrives(data);
        } else {
          setDrives(DUMMY_DRIVES);
        }
      } catch (error) {
        console.warn("Backend error fetching drives, using dummy data:", error);
        setDrives(DUMMY_DRIVES);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
        <p className="text-sm font-medium text-slate-500">Loading placement drives...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Drives</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your college's active and past placement drives.
          </p>
        </div>
        <button 
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
          onClick={() => navigate('/college/dashboard/placement-drives/create')}
        >
          <Briefcase size={20} /> Create New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {drives.map((drive) => (
          <motion.div
            key={drive._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex cursor-pointer flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-blue-500/30"
            onClick={() => navigate(`/college/dashboard/placement-drives/${drive._id}`)}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{drive.companyName}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{drive.role}</p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <IndianRupee size={16} /> Package
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{drive.package} LPA</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin size={16} /> Location
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{drive.location || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar size={16} /> Deadline
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(drive.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <Users size={18} />
                {drive.appliedStudentsCount || 0} Applied
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                drive.status === 'open' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {drive.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlacementDrives;
