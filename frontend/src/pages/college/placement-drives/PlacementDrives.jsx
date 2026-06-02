import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Briefcase, Building2, MapPin, IndianRupee, Users, ArrowRight, Loader2, Calendar } from "lucide-react";
import api from "../../../api/axios";



const PlacementDrives = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await api.get("/drives/college");
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setDrives(data);
        } else {
          setDrives([]);
        }
      } catch (error) {
        console.warn("Backend error fetching drives:", error);
        setDrives([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, [user?.activePlacementSeason]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
        </div>
        <p className="text-sm font-medium text-neutral-500">Loading placement drives...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Placement Drives</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your college's active and past placement drives.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl hover:shadow-indigo-500/30"
          onClick={() => navigate('/college/dashboard/placement-drives/create')}
        >
          <Briefcase size={20} /> Create New Drive
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {drives.length === 0 ? (
          <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
            <p className="text-neutral-500">No placement drives found.</p>
          </div>
        ) : drives.map((drive, index) => (
          <motion.div
            key={drive._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 transition-all hover:border-indigo-500/20 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5"
            onClick={() => navigate(`/college/dashboard/placement-drives/${drive._id}`)}
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400 border border-indigo-500/10">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{drive.companyName}</h3>
                  <p className="text-sm font-medium text-neutral-400">{drive.role}</p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-neutral-600 transition-all group-hover:bg-indigo-500 group-hover:text-white">
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-400">
                  <IndianRupee size={16} /> Package
                </span>
                <span className="font-semibold text-emerald-400">{drive.package} LPA</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-400">
                  <MapPin size={16} /> Location
                </span>
                <span className="font-semibold text-white">{drive.location || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-400">
                  <Calendar size={16} /> Deadline
                </span>
                <span className="font-semibold text-white">
                  {new Date(drive.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-400">
                <Users size={18} />
                {drive.appliedStudentsCount || 0} Applied
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                drive.status === 'open' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
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
