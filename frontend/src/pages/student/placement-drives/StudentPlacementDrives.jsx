import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Search, MapPin, Briefcase, Calendar, Filter, ChevronRight } from "lucide-react";
import api from "../../../api/axios";

const StudentPlacementDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await api.get('/drives/student/eligible');
        setDrives(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch placement drives", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const filteredDrives = drives.filter(drive => 
    drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    drive.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Placement Drives</h1>
          <p className="mt-1 text-sm text-slate-500">Discover and apply for upcoming recruitment drives.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search company or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
        </div>
      ) : filteredDrives.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 py-20 dark:border-slate-800">
           <Briefcase className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">No drives found</h3>
           <p className="text-sm text-slate-500">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredDrives.map((drive) => (
            <div 
              key={drive._id}
              onClick={() => navigate(`/student/dashboard/drives/${drive._id}`)}
              className="group flex cursor-pointer flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgb(37,99,235,0.03)] transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{drive.companyName}</h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{drive.role}</p>
                  </div>
                </div>
                {/* Status Badge Mock */}
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  drive.status === 'closed' || new Date(drive.applicationDeadline) < new Date() 
                  ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" 
                  : drive.isApplied 
                  ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400" 
                  : "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                }`}>
                  {drive.status === 'closed' || new Date(drive.applicationDeadline) < new Date() 
                    ? "Closed" 
                    : drive.isApplied 
                    ? "Applied" 
                    : "Open"
                  }
                </span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{drive.package} LPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{drive.location || "On-campus"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(drive.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Min CGPA: {drive.minCgpa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPlacementDrives;
