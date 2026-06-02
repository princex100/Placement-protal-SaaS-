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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
      </div>
    );
  }

  const { student, drive } = application;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-sm font-semibold text-neutral-300"><Clock size={16} /> Applied</span>;
      case 'Shortlisted': return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-400"><CheckCircle size={16} /> Shortlisted</span>;
      case 'Interview Scheduled': return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-400"><Calendar size={16} /> Interview Scheduled</span>;
      case 'Selected': return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-400"><CheckCircle size={16} /> Selected</span>;
      case 'Rejected': return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-sm font-semibold text-red-400"><XCircle size={16} /> Rejected</span>;
      default: return <span className="inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-sm font-semibold text-neutral-300">{status}</span>;
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Application Profile
              </h1>
              {getStatusBadge(application.status)}
            </div>
            <p className="mt-1 text-sm text-neutral-400">
              Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
        {/* Student Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Student Info</h2>
              <button 
                onClick={() => navigate(`/college/dashboard/student-profile/${student._id}`)}
                className="text-sm font-medium text-indigo-400 hover:underline"
              >
                View Full Profile
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">Name</p>
                <p className="mt-1 text-lg font-bold text-white">{student.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Roll Number</p>
                  <p className="mt-1 font-medium text-white">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">CGPA</p>
                  <p className="mt-1 font-bold text-emerald-400">{student.cgpa}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Branch</p>
                  <p className="mt-1 flex items-center gap-2 font-medium text-white"><BookOpen size={16} className="text-neutral-500" /> {student.branch}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Batch</p>
                  <p className="mt-1 flex items-center gap-2 font-medium text-white"><GraduationCap size={16} className="text-neutral-500" /> {student.passingYear}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase">Contact</p>
                <p className="mt-2 flex items-center gap-2 text-neutral-300">
                  <Mail size={16} className="text-neutral-500" /> {student.email}
                </p>
              </div>

              {student.skills && student.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {student.skills.map((skill, idx) => (
                      <span key={idx} className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-300">
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
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-white">Applied To</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-400 border border-indigo-500/10">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{drive?.companyName}</h3>
                  <p className="flex items-center gap-1 text-sm text-neutral-400">
                    <Briefcase size={14} /> {drive?.role}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/[0.04] border border-white/[0.04] p-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Package</p>
                  <p className="mt-1 flex items-center gap-1 font-bold text-emerald-400"><IndianRupee size={16} /> {drive?.package} LPA</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase">Location</p>
                  <p className="mt-1 flex items-center gap-1 font-medium text-white"><MapPin size={16} className="text-neutral-500" /> {drive?.location || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-white">Resume Snapshot</h2>
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] p-8">
              <FileText size={48} className="text-indigo-400/30" />
              <p className="text-center text-sm text-neutral-400">
                This is the resume the student submitted at the time of application.
              </p>
              <a 
                href={application.resumeSnapshot} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-xl hover:shadow-indigo-500/30"
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
