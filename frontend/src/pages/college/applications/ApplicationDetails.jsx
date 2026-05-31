import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Mail, Phone, BookOpen, GraduationCap, Building2, MapPin, IndianRupee, Briefcase, FileText, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/applications/${applicationId}`);
        const data = response.data?.data || response.data;
        setApplication(data);
      } catch (error) {
        console.error("Failed to fetch application:", error);
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      const response = await api.patch(`/applications/${applicationId}/status`, { status });
      toast.success(`Application marked as ${status}`);
      // Update local state to reflect new status
      setApplication(prev => ({ ...prev, status }));
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update application status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !application) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  const { student, drive } = application;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"><Clock size={16} /> Applied</span>;
      case 'Shortlisted': return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><CheckCircle size={16} /> Shortlisted</span>;
      case 'Interview Scheduled': return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Calendar size={16} /> Interview Scheduled</span>;
      case 'Selected': return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle size={16} /> Selected</span>;
      case 'Rejected': return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle size={16} /> Rejected</span>;
      default: return <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Application Profile
              </h1>
              {getStatusBadge(application.status)}
            </div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Student Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Info</h2>
              <button 
                onClick={() => navigate(`/college/dashboard/student-profile/${student._id}`)}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View Full Profile
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Name</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{student.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Roll Number</p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">CGPA</p>
                  <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">{student.cgpa}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Branch</p>
                  <p className="mt-1 flex items-center gap-2 font-medium text-slate-900 dark:text-white"><BookOpen size={16} className="text-slate-400" /> {student.branch}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Batch</p>
                  <p className="mt-1 flex items-center gap-2 font-medium text-slate-900 dark:text-white"><GraduationCap size={16} className="text-slate-400" /> {student.passingYear}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Contact</p>
                <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail size={16} className="text-slate-400" /> {student.email}
                </p>
              </div>

              {student.skills && student.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {student.skills.map((skill, idx) => (
                      <span key={idx} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drive Details & Resume */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Applied To</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{drive?.companyName}</h3>
                  <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Briefcase size={14} /> {drive?.role}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Package</p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400"><IndianRupee size={16} /> {drive?.package} LPA</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Location</p>
                  <p className="mt-1 flex items-center gap-1 font-medium text-slate-900 dark:text-white"><MapPin size={16} className="text-slate-400" /> {drive?.location || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Resume Snapshot</h2>
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 p-8 dark:border-slate-800">
              <FileText size={48} className="text-blue-500/50" />
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                This is the resume the student submitted at the time of application.
              </p>
              <a 
                href={application.resumeSnapshot} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
