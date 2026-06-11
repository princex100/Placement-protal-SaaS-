import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import api from "../../../api/axios";

const StudentApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/${applicationId}`);
        setApplication(response.data?.data);
      } catch (error) {
        console.error("Failed to fetch application details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Not Found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const drive = application.drive || {};
  const currentStatus = application.applicationStatus || 'applied';

  const statusTimeline = [
    { id: 'applied', label: 'Applied', icon: <FileText size={16} /> },
    { id: 'shortlisted', label: 'Shortlisted', icon: <CheckCircle2 size={16} /> },
    { id: 'interview_scheduled', label: 'Interview Scheduled', icon: <Clock size={16} /> },
    { id: 'selected', label: 'Selected', icon: <CheckCircle2 size={16} /> },
  ];

  const getStatusIndex = (status) => {
    const idx = statusTimeline.findIndex(s => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Applications
      </button>

      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{drive.companyName || "Company Name"}</h1>
            <p className="mt-1 text-lg font-medium text-slate-500 dark:text-slate-400">{drive.role || "Role"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Timeline */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Application Timeline</h3>
            
            <div className="relative border-l-2 border-slate-100 pl-6 dark:border-slate-800 ml-4 space-y-8">
              {isRejected ? (
                <>
                  <TimelineItem 
                    icon={<FileText size={16} />} 
                    title="Applied" 
                    date={new Date(application.createdAt).toLocaleDateString()} 
                    isActive={false} 
                    isCompleted={true} 
                  />
                  <TimelineItem 
                    icon={<XCircle size={16} />} 
                    title="Rejected" 
                    date={new Date(application.updatedAt).toLocaleDateString()} 
                    isActive={true} 
                    isCompleted={false}
                    isError={true}
                  />
                </>
              ) : (
                statusTimeline.map((step, index) => (
                  <TimelineItem 
                    key={step.id}
                    icon={step.icon}
                    title={step.label}
                    date={index === 0 ? new Date(application.createdAt).toLocaleDateString() : (index <= currentIndex ? new Date(application.updatedAt).toLocaleDateString() : null)}
                    isActive={index === currentIndex}
                    isCompleted={index < currentIndex}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Drive Info</h3>
            <div className="space-y-4">
              <InfoRow label="Package" value={`${drive.package || "N/A"} LPA`} />
              <InfoRow label="Location" value={drive.location || "N/A"} />
              <InfoRow label="Date" value={drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : "N/A"} />
            </div>
            <button 
              onClick={() => navigate(`/student/dashboard/drives/${drive._id}`)}
              className="mt-6 w-full rounded-xl border border-blue-100 bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
            >
              View Drive Details
            </button>
          </div>
          
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Applied With</h3>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Resume.pdf</p>
                  <p className="text-xs text-slate-500">Submitted version</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, title, date, isActive, isCompleted, isError }) => {
  let iconBg = 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500';
  let titleColor = 'text-slate-500 dark:text-slate-400';
  
  if (isCompleted) {
    iconBg = 'bg-blue-600 text-slate-900 dark:text-white shadow-md shadow-blue-500/20';
    titleColor = 'text-slate-900 dark:text-white';
  } else if (isActive) {
    iconBg = isError 
      ? 'bg-red-500 text-slate-900 dark:text-white shadow-md shadow-red-500/20'
      : 'bg-blue-500 text-slate-900 dark:text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-900/20';
    titleColor = isError ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';
  }

  return (
    <div className="relative">
      <div className={`absolute -left-[40px] flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h4 className={`font-bold ${titleColor}`}>{title}</h4>
        {date && <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{date}</p>}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-sm font-bold text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default StudentApplicationDetails;
