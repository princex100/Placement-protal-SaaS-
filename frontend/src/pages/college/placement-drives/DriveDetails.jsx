import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Building2, MapPin, IndianRupee, Users, Calendar, Briefcase, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const DUMMY_DRIVE = {
  _id: "dummy1",
  companyName: "Google",
  role: "Software Engineer",
  package: 24,
  location: "Bangalore",
  mode: "hybrid",
  jobType: "fulltime",
  minimumCgpa: 8.0,
  eligibleBranches: ["Computer Science", "Information Technology"],
  skillsRequired: ["React", "Node.js", "System Design"],
  description: "Join Google as a Software Engineer and help build the future of the web. You will be working on highly scalable systems and core infrastructure.",
  responsibilities: "Write clean code, design architecture, participate in code reviews, and mentor junior developers.",
  applicationDeadline: new Date(Date.now() + 86400000 * 5).toISOString(),
  driveDate: new Date(Date.now() + 86400000 * 15).toISOString(),
  appliedStudentsCount: 156,
  status: "open",
};

const DriveDetails = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const response = await api.get(`/drives/${driveId}`);
        const data = response.data?.data || response.data;
        if (data && data.companyName) {
          setDrive(data);
        } else {
          setDrive(DUMMY_DRIVE);
        }
      } catch (error) {
        console.warn("Backend error fetching drive details, using dummy data:", error);
        setDrive(DUMMY_DRIVE);
      } finally {
        setLoading(false);
      }
    };
    fetchDrive();
  }, [driveId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this drive? All associated student applications will also be deleted. This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await api.delete(`/drives/${driveId}`);
      toast.success("Drive deleted successfully");
      navigate("/college/dashboard/placement-drives");
    } catch (error) {
      console.error("Failed to delete drive:", error);
      // Even if API fails, if it's a dummy drive, just navigate back
      if (driveId.startsWith("dummy")) {
        toast.success("Dummy drive deleted");
        navigate("/college/dashboard/placement-drives");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading || !drive) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/college/dashboard/placement-drives")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Drives
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/10">
              <Building2 size={32} className="hidden sm:block" />
              <Building2 size={24} className="sm:hidden" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{drive.companyName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                  <Briefcase size={16} /> {drive.role}
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-600"></span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                  <MapPin size={16} /> {drive.location || "Location TBD"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate(`/college/dashboard/placement-drives/${drive._id}/applications`)}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-5 py-2.5 text-sm font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20"
            >
              <CheckCircle2 size={18} /> Applications ({drive.appliedStudentsCount})
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20"
            >
              {deleteLoading ? <Loader2 size={18} className="animate-spin" /> : <><Trash2 size={18} /> Remove Drive</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
        {/* Main Content (Left) */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Package</p>
              <p className="mt-2 flex items-center gap-1 text-xl font-bold text-emerald-400">
                <IndianRupee size={18} /> {drive.package} LPA
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Job Type</p>
              <p className="mt-2 text-lg font-bold capitalize text-slate-900 dark:text-white">{drive.jobType}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Work Mode</p>
              <p className="mt-2 text-lg font-bold capitalize text-slate-900 dark:text-white">{drive.mode}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Status</p>
              <p className={`mt-2 text-lg font-bold capitalize ${drive.status === 'open' ? 'text-emerald-400' : 'text-slate-600 dark:text-neutral-500'}`}>{drive.status}</p>
            </div>
          </div>

          {/* Description & Responsibilities */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 md:p-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Job Description</h2>
            <p className="whitespace-pre-wrap text-neutral-300 leading-relaxed">
              {drive.description || "No description provided."}
            </p>

            {drive.responsibilities && (
              <>
                <h2 className="mb-4 mt-8 text-xl font-bold text-slate-900 dark:text-white">Key Responsibilities</h2>
                <p className="whitespace-pre-wrap text-neutral-300 leading-relaxed">
                  {drive.responsibilities}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="flex flex-col gap-6">
          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Application Deadline</p>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">
                    {new Date(drive.applicationDeadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Interview Date</p>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">
                    {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "To be decided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Eligibility Criteria</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 size={18} className="mt-0.5 text-indigo-400 shrink-0" />
                <span><span className="font-semibold text-slate-900 dark:text-white">Min CGPA:</span> {drive.minimumCgpa}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-300">
                <CheckCircle2 size={18} className="mt-0.5 text-indigo-400 shrink-0" />
                <span><span className="font-semibold text-slate-900 dark:text-white">Allowed Branches:</span> {drive.eligibleBranches?.length > 0 ? drive.eligibleBranches.join(', ') : 'All Branches'}</span>
              </li>
              {drive.passingYearsAllowed?.length > 0 && (
                <li className="flex items-start gap-2 text-sm text-neutral-300">
                  <CheckCircle2 size={18} className="mt-0.5 text-indigo-400 shrink-0" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">Batch:</span> {drive.passingYearsAllowed.join(', ')}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Required Skills */}
          {drive.skillsRequired?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {drive.skillsRequired.map((skill, idx) => (
                  <span key={idx} className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Eligible Students List */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-5 sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Eligible Students <span className="ml-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-sm text-indigo-400">{drive.students?.length || 0}</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Roll No</th>
                <th className="px-6 py-4 font-semibold">Branch</th>
                <th className="px-6 py-4 font-semibold">CGPA</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {drive.students && drive.students.length > 0 ? (
                drive.students.map((item) => {
                  if (!item.student) return null;
                  return (
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
                      <td className="px-6 py-4 text-slate-500 dark:text-neutral-400">{item.student.branch}</td>
                      <td className="px-6 py-4 font-semibold text-neutral-300">{item.student.cgpa}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 font-medium text-sm">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-600 dark:text-neutral-500">
                    No eligible students have applied to this drive yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
