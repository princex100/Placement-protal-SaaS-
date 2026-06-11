import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Loader2, Search, Briefcase, IndianRupee } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";



const BranchPlacementDetails = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/placement-records/${branchId}`);
        const data = response.data?.data || response.data;
        if (data && data.branch) {
          setRecord(data);
        }
      } catch (error) {
        console.warn("Backend error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [branchId, user?.activePlacementSeason]);

  if (loading || !record) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
      </div>
    );
  }

  const filteredStudents = record.placedStudents?.filter((s) => 
    s.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/college/dashboard/placement-records")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Overview
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{record.branch?.name} Placements</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">Detailed list of placed students and offers</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Eligible</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{record.eligibleStudents}</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/[0.06]"></div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Placed</p>
              <p className="text-xl font-bold text-emerald-400">{record.placedStudentsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, roll no, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-none bg-slate-100 dark:bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-700 dark:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Roll No</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Package</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-600 dark:text-neutral-500">No placed students found.</td>
                </tr>
              ) : (
                filteredStudents.map((item) => (
                  <tr 
                    key={item._id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.03]"
                    onClick={() => navigate(`/college/dashboard/student-profile/${item.student._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                          {item.student.fullName?.charAt(0) || "?"}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{item.student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-neutral-400">{item.student.rollNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-slate-600 dark:text-neutral-500" />
                        <span className="font-medium text-neutral-300">{item.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-emerald-400">
                        <IndianRupee size={14} />
                        {item.packageDisplay || `${item.package} LPA`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 font-medium text-sm">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchPlacementDetails;
