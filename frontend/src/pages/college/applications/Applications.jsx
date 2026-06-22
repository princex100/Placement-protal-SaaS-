import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Building2, 
  User, 
  GraduationCap,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const Applications = () => {
  const navigate = useNavigate();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
     try {
       const response = await api.get(`/applications/college/all?page=${page}&limit=${limit}`);
     const data = response.data?.data || response.data;
      
      setApplications(data.applications || []);
      setTotalPages(data.totalPages || 1);
      setTotalApplications(data.totalApplications || 0);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(error.response?.data?.message || "Failed to fetch applications");
      
      if (!applications.length) {
        setApplications([
          {
            _id: "app1",
            applicationStatus: "applied",
            appliedAt: new Date().toISOString(),
            student: { _id: "stu1", fullName: "John Doe", rollNo: "CS2101", branch: "CSE", cgpa: 8.5 },
            drive: { _id: "drv1", companyName: "Google", role: "Software Engineer" }
          },
          {
            _id: "app2",
            applicationStatus: "selected",
           appliedAt: new Date(Date.now() - 86400000).toISOString(),
            student: { _id: "stu2", fullName: "Jane Smith", rollNo: "IT2104", branch: "IT", cgpa: 9.1 },
            drive: { _id: "drv2", companyName: "Microsoft", role: "Frontend Developer" }
          }
        ]);
        setTotalPages(1);
        setTotalApplications(2);
      }
    } finally {
     setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "shortlisted":
      case "interview_scheduled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "withdrawn":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
      default: // applied
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await api.patch(`/applications/${applicationId}/status`, { applicationStatus: newStatus });
      toast.success("Application status updated!");
      
      setApplications(prevApps => 
        prevApps.map(app => 
          app._id === applicationId 
           ? { ...app, applicationStatus: newStatus } 
            : app
        )
      );
   } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
       <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Applications Management</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
             View and manage all student applications across placement drives. ({totalApplications} total)
          </p>
        </div>
        
        {/* Placeholder for future Search/Filter implementation */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800/60 dark:bg-slate-900 dark:text-white md:w-[250px]"
            />
          </div>
         <button className="flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Main Content Area */}
       <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800">
              <FileText size={32} />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No applications found</p>
           <p className="text-sm text-slate-500 dark:text-slate-400">There are currently no student applications to display.</p>
          </div>
        ) : (
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800/60 dark:bg-slate-800/50 dark:text-slate-300">
                 <tr>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Student</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Drive & Company</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Applied Date</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Status</th>
                 <th className="whitespace-nowrap px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app._id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    {/* Student Info */}
                     <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                         <User size={18} />
                        </div>
                        <div>
                         <p className="font-semibold text-slate-900 dark:text-white">{app.student?.fullName || "N/A"}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{app.student?.rollNo || "N/A"}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                           <span>{app.student?.branch || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Drive Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                           <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{app.drive?.companyName || "N/A"}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{app.drive?.role || "N/A"}</p>
                        </div>
                       </div>
                    </td>

                    {/* Date */}
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar size={14} className="text-slate-400" />
                       <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                       </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus?.replace("_", " ")}
                      </span>
                   </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleStatusUpdate(app._id, "shortlisted")} className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">Shortlist</button>
                          <button onClick={() => handleStatusUpdate(app._id, "interview_scheduled")} className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">Interview</button>
                          <button onClick={() => handleStatusUpdate(app._id, "selected")} className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Select</button>
                          <button onClick={() => handleStatusUpdate(app._id, "rejected")} className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">Reject</button>
                        </div>
                        <button 
                         onClick={() => navigate(`/college/dashboard/student-profile/${app.student?._id}`)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          View Student <ChevronRight size={14} />
                        </button>
                     </div>
                    </td>
                  </tr>
               ))}
               </tbody>
             </table>
          </div>
        )}

         {/* Pagination Controls */}
        {!loading && applications.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing page <span className="font-medium text-slate-900 dark:text-white">{page}</span> of <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span>
           </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                 <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
       </div>
    </div>
  );
};

export default Applications;
