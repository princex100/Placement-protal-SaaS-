import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, Mail, GraduationCap, Link as LinkIcon, FileText, Ban, CheckCircle, Edit, Save, X, Plus } from "lucide-react";
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
  
  // UI Action States
  const [actionLoading, setActionLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    email: "",
    phoneNumber: "",
    branch: "",
    cgpa: "",
    passingYear: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
    skills: [],
  });

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/placement-records/student/${studentId}`);
      const data = response.data?.data || response.data;
      if (data && data.fullName) {
        setStudent(data);
        // Pre-fill form data
        setFormData({
          fullName: data.fullName || "",
          rollNo: data.rollNo || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          branch: data.branch || "",
          cgpa: data.cgpa || "",
          passingYear: data.passingYear || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          portfolio: data.portfolio || "",
          resume: data.resume || "",
          skills: data.skills || [],
        });
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

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  // Form Handlers
  const handleEditToggle = () => {
    if (isEditing) {
      // Re-populate from current DB state if cancelling
      setFormData({
        fullName: student.fullName || "",
        rollNo: student.rollNo || "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || "",
        branch: student.branch || "",
        cgpa: student.cgpa || "",
        passingYear: student.passingYear || "",
        linkedin: student.linkedin || "",
        github: student.github || "",
        portfolio: student.portfolio || "",
        resume: student.resume || "",
        skills: student.skills || [],
      });
      setSkillInput("");
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Submission Handlers
  const handleUpdateSubmit = async () => {
    setUpdateLoading(true);
    try {
      const payload = {
        ...formData,
        cgpa: Number(formData.cgpa),
        passingYear: Number(formData.passingYear),
      };
      
      await api.patch(`/placement-records/student/${studentId}/update`, payload);
      toast.success("Student details updated successfully");
      setIsEditing(false);
      await fetchStudent(); // Refetch to ensure sync
    } catch (error) {
      console.error("Failed to update student", error);
      toast.error(error.response?.data?.message || "Failed to update student details");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (student.placementStatus === newStatus) return;
    setStatusLoading(true);
    try {
      await api.patch(`/placement-records/student/${studentId}/placement-status`, {
        placementStatus: newStatus
      });
      toast.success(`Placement status updated to ${newStatus}`);
      await fetchStudent(); // Refetch to ensure sync
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Failed to update placement status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    // Optimistic UI update
    const previousStatus = student.placementBlocked;
    setStudent({ ...student, placementBlocked: !previousStatus });
    setActionLoading(true);

    try {
      const response = await api.patch(`/placement-records/student/${studentId}/toggle-block`);
      toast.success(response.data?.message || `Student placement ${!previousStatus ? 'blocked' : 'unblocked'} successfully.`);
      await fetchStudent(); // Guarantee DB sync
    } catch (error) {
      setStudent({ ...student, placementBlocked: previousStatus });
      console.error("Failed to toggle block status", error);
      toast.error("Failed to change block status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-2xl sm:text-3xl font-bold text-indigo-400 border border-indigo-500/10">
              {student.fullName?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-b-2 border-indigo-500 bg-transparent px-1 py-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white outline-none"
                  />
                ) : (
                  student.fullName
                )}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                  <User size={16} /> 
                  {isEditing ? (
                    <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} className="w-24 rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-1 text-slate-900 dark:text-white" />
                  ) : student.rollNo}
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-600"></span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                  <GraduationCap size={16} /> 
                  {isEditing ? (
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-32 rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-1 text-slate-900 dark:text-white" />
                  ) : student.branch}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEditToggle}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={updateLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25"
                >
                  {updateLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-neutral-300 transition-all hover:bg-slate-200 dark:hover:bg-white/[0.06]"
              >
                <Edit size={18} /> Edit Student
              </button>
            )}
            
            <button
              onClick={handleToggleBlock}
              disabled={actionLoading}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                student.placementBlocked
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
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

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
        {/* Left Column - Details */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
          {/* Contact Details */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.04] p-3">
                <Mail size={18} className="text-slate-600 dark:text-neutral-500" />
                {isEditing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-2 py-1 text-sm text-slate-900 dark:text-white" />
                ) : (
                  <span className="text-sm font-medium text-neutral-300">{student.email || "Not provided"}</span>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.04] p-3">
                <LinkIcon size={18} className="text-slate-600 dark:text-neutral-500" />
                {isEditing ? (
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-2 py-1 text-sm text-slate-900 dark:text-white" />
                ) : (
                  <a href={student.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-400 hover:underline">LinkedIn Profile</a>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.04] p-3">
                <FileText size={18} className="text-slate-600 dark:text-neutral-500" />
                {isEditing ? (
                  <input type="text" name="resume" value={formData.resume} onChange={handleChange} placeholder="Resume URL" className="w-full rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-2 py-1 text-sm text-slate-900 dark:text-white" />
                ) : (
                  <a href={student.resume} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-400 hover:underline">View Resume</a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Technical Skills</h2>
            
            {isEditing && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
                  placeholder="Add a skill..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.04] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-700 dark:text-neutral-600 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-indigo-500/10 px-4 font-semibold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {(isEditing ? formData.skills : student.skills)?.length > 0 ? (
                (isEditing ? formData.skills : student.skills).map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300">
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} className="ml-1 text-indigo-400 hover:text-red-400 transition">
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-neutral-500">No skills listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Academic Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">CGPA</p>
                {isEditing ? (
                  <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="mt-1 w-full rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-2 py-1 text-xl font-bold text-slate-900 dark:text-white" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{student.cgpa || "N/A"}</p>
                )}
              </div>
              <div className="h-px w-full bg-slate-200 dark:bg-white/[0.06]"></div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Passing Year</p>
                {isEditing ? (
                  <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className="mt-1 w-full rounded border border-white/[0.1] bg-slate-100 dark:bg-white/[0.04] px-2 py-1 text-base font-semibold text-slate-900 dark:text-white" />
                ) : (
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{student.passingYear || "N/A"}</p>
                )}
              </div>
              <div className="h-px w-full bg-slate-200 dark:bg-white/[0.06]"></div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Placement Status</p>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('unplaced')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'unplaced' 
                        ? 'bg-neutral-500 text-slate-900 dark:text-white ring-2 ring-neutral-400 ring-offset-2 ring-offset-[#0a0a12]' 
                        : 'bg-slate-200 dark:bg-white/[0.06] text-slate-500 dark:text-neutral-400 hover:bg-white/[0.1]'
                    }`}
                  >
                    Unplaced
                  </button>
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('placed')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'placed' 
                        ? 'bg-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0a0a12]' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    Placed
                  </button>
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('internship')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'internship' 
                        ? 'bg-blue-500 text-slate-900 dark:text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a0a12]' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                    }`}
                  >
                    Internship
                  </button>
                </div>
              </div>
              {student.placementBlocked && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-red-400">
                    <Ban size={16} /> Placement is currently Blocked
                  </p>
                  <p className="mt-1 text-xs text-red-400/70">Status updates disabled.</p>
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
