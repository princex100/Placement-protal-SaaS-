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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border-b-2 border-blue-500 bg-transparent px-1 py-1 text-3xl font-bold outline-none focus:bg-blue-50/50 dark:focus:bg-blue-900/20"
                  />
                ) : (
                  student.fullName
                )}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <User size={16} /> 
                  {isEditing ? (
                    <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} className="w-24 rounded border border-slate-300 px-1 dark:border-slate-700 dark:bg-slate-800" />
                  ) : student.rollNo}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <GraduationCap size={16} /> 
                  {isEditing ? (
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-32 rounded border border-slate-300 px-1 dark:border-slate-700 dark:bg-slate-800" />
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
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={updateLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  {updateLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Edit size={18} /> Edit Student
              </button>
            )}
            
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
                {isEditing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                ) : (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{student.email || "Not provided"}</span>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <LinkIcon size={18} className="text-slate-400" />
                {isEditing ? (
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                ) : (
                  <a href={student.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">LinkedIn Profile</a>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <FileText size={18} className="text-slate-400" />
                {isEditing ? (
                  <input type="text" name="resume" value={formData.resume} onChange={handleChange} placeholder="Resume URL" className="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                ) : (
                  <a href={student.resume} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View Resume</a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Technical Skills</h2>
            
            {isEditing && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
                  placeholder="Add a skill..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-blue-100 px-4 font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {(isEditing ? formData.skills : student.skills)?.length > 0 ? (
                (isEditing ? formData.skills : student.skills).map((skill, idx) => (
                  <span key={idx} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    )}
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
                {isEditing ? (
                  <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xl font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{student.cgpa || "N/A"}</p>
                )}
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Passing Year</p>
                {isEditing ? (
                  <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-base font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                ) : (
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{student.passingYear || "N/A"}</p>
                )}
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase">Placement Status</p>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('unplaced')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'unplaced' 
                        ? 'bg-slate-600 text-white ring-2 ring-slate-400 ring-offset-2 dark:ring-offset-slate-900' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    Unplaced
                  </button>
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('placed')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'placed' 
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    Placed
                  </button>
                  <button 
                    disabled={statusLoading || student.placementBlocked}
                    onClick={() => handleStatusUpdate('internship')}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                      student.placementStatus === 'internship' 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    Internship
                  </button>
                </div>
              </div>
              {student.placementBlocked && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                  <p className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                    <Ban size={16} /> Placement is currently Blocked
                  </p>
                  <p className="mt-1 text-xs text-red-500">Status updates disabled.</p>
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
