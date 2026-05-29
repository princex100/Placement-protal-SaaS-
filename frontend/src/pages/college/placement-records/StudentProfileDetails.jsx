import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, Mail, GraduationCap, Link as LinkIcon, FileText, Ban, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const DUMMY_STUDENT = {
  _id: "u1",
  fullName: "Rahul Sharma",
  rollNo: "CSE001",
  email: "rahul.cse@college.edu",
  phoneNumber: "+91 9876543210",
  branch: "Computer Science",
  cgpa: 8.9,
  passingYear: 2024,
  skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
  github: "https://github.com/rahul",
  linkedin: "https://linkedin.com/in/rahul",
  placementStatus: "placed",
  placementBlocked: false,
};

const StudentProfileDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/placement-records/student/${studentId}`);
        const data = response.data?.data || response.data;
        if (data && data.fullName) {
          setStudent(data);
        } else {
          setStudent(DUMMY_STUDENT);
        }
      } catch (error) {
        console.warn("Using dummy student due to backend error:", error);
        setStudent(DUMMY_STUDENT);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleToggleBlock = async () => {
    // Optimistic UI update
    const previousStatus = student.placementBlocked;
    setStudent({ ...student, placementBlocked: !previousStatus });
    setActionLoading(true);

    try {
      const response = await api.patch(`/placement-records/student/${studentId}/toggle-block`);
      toast.success(response.data?.message || `Student placement ${!previousStatus ? 'blocked' : 'unblocked'} successfully.`);
    } catch (error) {
      // Rollback on failure
      setStudent({ ...student, placementBlocked: previousStatus });
      console.error("Failed to toggle block status", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {student.fullName?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{student.fullName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <User size={16} /> {student.rollNo}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <GraduationCap size={16} /> {student.branch}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleToggleBlock}
              disabled={actionLoading}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                student.placementBlocked
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                  : "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              }`}
            >
              {actionLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : student.placementBlocked ? (
                <><CheckCircle size={18} /> Unblock Placement</>
              ) : (
                <><Ban size={18} /> Block Placement</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
          {/* Contact Details */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <Mail size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{student.email || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <LinkIcon size={18} className="text-slate-400" />
                <a href={student.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <FileText size={18} className="text-slate-400" />
                <a href={student.resume} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  View Resume
                </a>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills?.length > 0 ? (
                student.skills.map((skill, idx) => (
                  <span key={idx} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No skills listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Academic Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">CGPA</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{student.cgpa || "N/A"}</p>
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Passing Year</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{student.passingYear || "N/A"}</p>
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Placement Status</p>
                <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  student.placementStatus === 'placed' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : student.placementStatus === 'internship'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {student.placementStatus}
                </span>
              </div>
              {student.placementBlocked && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                  <p className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                    <Ban size={16} /> Placement is currently Blocked
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDetails;
