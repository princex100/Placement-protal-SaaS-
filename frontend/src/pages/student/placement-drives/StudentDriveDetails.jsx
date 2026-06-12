import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Building2, MapPin, Briefcase, Calendar, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../../api/axios";
import { useSelector } from "react-redux";

const StudentDriveDetails = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchDriveDetails = async () => {
      try {
        setLoading(true);
        const [driveRes, appRes] = await Promise.all([
          api.get(`/drives/${driveId}`),
          api.get(`/applications/student/me`)
        ]);
        
        setDrive(driveRes.data?.data);
        const myApps = appRes.data?.data || [];
        const hasAppliedToThis = myApps.some(app => app.drive._id === driveId || app.drive === driveId);
        setHasApplied(hasAppliedToThis);
      } catch (error) {
        console.error("Failed to fetch drive details", error);
        toast.error("Failed to load drive details");
      } finally {
        setLoading(false);
      }
    };
    fetchDriveDetails();
  }, [driveId]);

  const handleApply = () => {
    navigate(`/student/dashboard/drives/${driveId}/apply`);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Drive Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Drives
      </button>

      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{drive.companyName}</h1>
            <p className="mt-1 text-lg font-medium text-slate-500 dark:text-slate-400">{drive.role}</p>
          </div>
        </div>

        <div>
          {hasApplied ? (
            <button disabled className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-8 py-3.5 font-bold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 cursor-not-allowed">
              <CheckCircle2 size={20} /> Applied
            </button>
          ) : drive.status === 'closed' || new Date(drive.applicationDeadline) < new Date() ? (
            <button disabled className="flex items-center gap-2 rounded-2xl bg-red-50 px-8 py-3.5 font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400 cursor-not-allowed">
              Closed
            </button>
          ) : (
            <button 
              onClick={handleApply}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">About the Role</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {drive.description || "No description provided."}
            </p>
          </div>

          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {drive.skillsRequired && drive.skillsRequired.length > 0 ? (
                 drive.skillsRequired.map((skill, index) => (
                   <span key={index} className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/30">
                     {skill}
                   </span>
                 ))
              ) : (
                <p className="text-sm text-slate-500">No specific skills listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="flex flex-col gap-4">
          <DetailCard icon={<Briefcase />} label="Package" value={`${drive.package} LPA`} />
          <DetailCard icon={<MapPin />} label="Location" value={drive.location || "Not specified"} />
          <DetailCard icon={<Calendar />} label="Drive Date" value={drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : "TBD"} />
          <DetailCard icon={<Calendar />} label="Deadline" value={drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "TBD"} />
          <DetailCard icon={<GraduationCap />} label="Min CGPA" value={drive.minimumCgpa || "No limit"} />
          
          <div className="mt-4 rounded-3xl border border-blue-50 bg-blue-50/50 p-6 dark:border-blue-900/20 dark:bg-blue-900/10">
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Allowed Branches</h4>
            <div className="flex flex-wrap gap-2">
              {drive.eligibleBranches && drive.eligibleBranches.length > 0 ? (
                drive.eligibleBranches.map((branch, index) => (
                  <span key={index} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    {branch.name || branch}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Open to all branches</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default StudentDriveDetails;
