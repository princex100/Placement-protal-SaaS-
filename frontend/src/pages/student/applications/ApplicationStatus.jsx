import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, Building2 } from "lucide-react";
import api from "../../../api/axios";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/applications/student/me');
        setApplications(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'applied': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shortlisted': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'interview_scheduled': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'selected': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'rejected': return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Application Status</h1>
          <p className="mt-1 text-sm text-slate-500">Track the progress of your placement applications.</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Applications Yet</h3>
            <p className="text-sm text-slate-500 mt-1">Apply for placement drives to see them here.</p>
            <button onClick={() => navigate('/student/dashboard/drives')} className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-slate-900 dark:text-white hover:bg-blue-700">
              Browse Drives
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {applications.map((app, index) => (
              <div 
                key={app._id}
                onClick={() => navigate(`/student/dashboard/applications/${app._id}`)}
                className={`group flex cursor-pointer items-center justify-between p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${index !== applications.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/60' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 dark:border-slate-700 dark:bg-slate-800">
                    <Building2 size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{app.drive?.companyName || "Company Name"}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                      <span>{app.drive?.role || "Role"}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(app.applicationStatus)}`}>
                    {app.applicationStatus?.replace("_", " ") || "APPLIED"}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-slate-900 dark:group-hover:text-white dark:bg-slate-800">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
