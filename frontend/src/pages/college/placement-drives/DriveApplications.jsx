import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Search, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const DriveApplications = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 25; // As per requirements

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/applications/drive/${driveId}?page=${page}&limit=${limit}`);
        const data = response.data?.data || response.data;
        
        setApplications(data.applications || []);
        setTotalPages(data.totalPages || 1);
        setTotalApplications(data.totalApplications || 0);
        
        // Extract drive metadata from the first application (if populated)
        if (data.applications?.length > 0 && data.applications[0].drive) {
          setDrive(data.applications[0].drive);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        toast.error("Failed to load applications for this drive.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [driveId, page]);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/college/dashboard/placement-drives/${driveId}`)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Drive Details
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Drive Applications
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {drive ? `${drive.companyName} - ${drive.role}` : "Loading drive details..."}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <FileText size={18} />
            <span className="font-semibold">{totalApplications} Total Applications</span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="flex h-[40vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex h-[40vh] flex-col items-center justify-center text-slate-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No applications found for this drive.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 rounded-t-xl">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student Name</th>
                  <th className="px-6 py-4 font-semibold">Roll Number</th>
                  <th className="px-6 py-4 font-semibold">Branch</th>
                  <th className="px-6 py-4 font-semibold">CGPA</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Applied Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/college/dashboard/student-profile/${app.student._id}`)}
                        className="font-medium text-slate-900 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-400"
                      >
                        {app.student.fullName}
                      </button>
                    </td>
                    <td className="px-6 py-4">{app.student.rollNo}</td>
                    <td className="px-6 py-4">{app.student.branch}</td>
                    <td className="px-6 py-4 font-medium">{app.student.cgpa}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        app.status === 'Applied' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                        app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/college/dashboard/applications/${app._id}`)}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Application →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Controls */}
        {!loading && applications.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800/60">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * limit, totalApplications)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalApplications}</span> Entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                // Show at most 5 pages around current
                .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                .map((p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${p}`}>
                        <span className="flex h-9 w-9 items-center justify-center text-slate-500">...</span>
                        <button
                          onClick={() => setPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                            page === p
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        page === p
                          ? "bg-blue-600 text-white border border-blue-600 dark:border-blue-500"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveApplications;
