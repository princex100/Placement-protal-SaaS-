import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { 
  Building2, Calendar, MapPin, Briefcase, GraduationCap, ArrowLeft, 
  User, Mail, Phone, BookOpen, CheckCircle2, Edit2, Code, FileText, Link as LinkIcon, Plus, Trash2, X
} from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import api from "../../../api/axios";
import { setCredentials } from "../../../redux/features/authSlice";

const StudentApplyDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Try to use redux user first, but we will also fetch fresh data to be safe
  const { user: reduxUser } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const [drive, setDrive] = useState(null);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState(null);
  
  // Track which professional field is currently being edited
  const [editingField, setEditingField] = useState(null);
  
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        setLoading(true);
        // Fetch drive details and fresh student profile concurrently
        const [driveRes, studentRes] = await Promise.all([
          api.get(`/drives/${driveId}`),
          api.get(`/students/current`)
        ]);
        
        setDrive(driveRes.data?.data);
        
        const freshStudent = studentRes.data?.data;
        setStudent(freshStudent);
        
        // Initialize form data for editable fields
        setFormData({
          skills: freshStudent.skills || [],
          projects: freshStudent.projects || [],
          resume: freshStudent.resume || "",
          github: freshStudent.github || "",
          linkedin: freshStudent.linkedin || "",
          portfolio: freshStudent.portfolio || "",
        });
        
      } catch (error) {
        console.error("Failed to fetch application data", error);
        toast.error("Could not load application details. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplyData();
  }, [driveId, navigate]);

  // Handle generic input change for professional details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Inline Save Logic ---
  const handleInlineSave = async (fieldName) => {
    try {
      const updatePayload = {
        [fieldName]: formData[fieldName]
      };
      
      const response = await api.patch("/students/profile", updatePayload);
      const updatedUser = response.data?.data;
      
      if (updatedUser) {
        setStudent(updatedUser);
        dispatch(setCredentials({ user: updatedUser, role: "student" }));
        toast.success(`${fieldName} updated successfully`);
        setEditingField(null); // Close edit mode
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${fieldName}`);
    }
  };

  // --- Skills Specific Handlers ---
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // --- Projects Specific Handlers ---
  const handleAddProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", link: "" }]
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const handleRemoveProject = (index) => {
    setFormData(prev => {
      const newProjects = [...prev.projects];
      newProjects.splice(index, 1);
      return { ...prev, projects: newProjects };
    });
  };

  // --- Submit Application Logic ---
  const handleSubmitApplication = async () => {
    // 1. Validate required fields
    if (!student.resume && !resumeFile) {
      toast.error("Please upload your resume before applying.");
      return;
    }
    if (!student.skills || student.skills.length === 0) {
      toast.error("Please add at least one technical skill before applying.");
      return;
    }
    
    // Optional validations
    if (!student.linkedin && !student.github) {
      toast.success("Tip: Adding LinkedIn or GitHub improves your chances!", { icon: '💡' });
    }

    try {
      setApplying(true);
      const applyData = new FormData();
      if (resumeFile) {
        applyData.append("resume", resumeFile);
      }
      
      await api.post(`/applications/${driveId}/apply`, applyData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Application submitted successfully 🚀");
      navigate("/student/dashboard/applications"); // Redirect to application status page
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Cancel & Go Back
      </button>

      {/* Top Section: Drive Summary */}
      <div className="rounded-[32px] border border-blue-100/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-md p-8 shadow-sm dark:border-blue-900/30 dark:from-blue-900/10 dark:to-indigo-900/10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Applying for</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Building2 className="text-blue-500" /> {drive?.companyName}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-lg font-medium text-slate-700 dark:text-slate-300">
              {drive?.role} • {drive?.package} LPA
            </p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Application Review 🚀</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Make sure your resume, projects, and links are updated.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: Basic Details (READ ONLY) */}
        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="text-blue-500" /> Basic Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">Institutional records (Read Only)</p>
          </div>
          
          <div className="space-y-4">
            <ReadOnlyField label="Full Name" value={student?.fullName} />
            <ReadOnlyField label="Roll Number" value={student?.rollNo} />
            <ReadOnlyField label="College" value={student?.college?.name || "College not linked"} />
            <ReadOnlyField label="Email" value={student?.email} placeholder="Not available yet" />
            <ReadOnlyField label="Phone Number" value={student?.phoneNumber} placeholder="Phone number unavailable" />
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <ReadOnlyField label="CGPA" value={student?.cgpa} placeholder="Unavailable" />
              <ReadOnlyField label="Passing Year" value={student?.passingYear} placeholder="Unavailable" />
              <ReadOnlyField label="Active Backlogs" value={student?.backlogCount !== undefined ? student.backlogCount : "Unavailable"} />
            </div>
          </div>
        </div>

        {/* SECTION 2: Professional Details (EDITABLE) */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="text-blue-500" /> Professional Details
            </h3>

            <div className="space-y-6">
              {/* Resume Field */}
              <div className="flex flex-col gap-2 rounded-2xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <FileText size={16} /> Resume File (PDF)
                  </span>
                  {!editingField && (
                    <button onClick={() => setEditingField('resume')} className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1">
                      <Edit2 size={12} /> {student?.resume ? "Replace" : "Upload"}
                    </button>
                  )}
                </div>
                {editingField === 'resume' ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="w-full rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setResumeFile(null); setEditingField(null); }} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg dark:text-slate-400">Cancel</button>
                      <button onClick={() => {
                        if (!resumeFile) return toast.error("Please select a file");
                        toast.success("Resume attached. It will be uploaded when you click Apply.");
                        setEditingField(null);
                      }} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Confirm</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    {resumeFile ? (
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Selected: {resumeFile.name}
                      </p>
                    ) : student?.resume ? (
                      <a href={student.resume} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline dark:text-slate-200 dark:hover:text-blue-400 block truncate">
                        View Current Resume
                      </a>
                    ) : (
                      <p className="text-sm italic text-slate-400">Upload your resume before applying 📄</p>
                    )}
                  </div>
                )}
              </div>

              {/* GitHub Field */}
              <InlineEditableField 
                label="GitHub Profile" 
                icon={<FiGithub size={16} />}
                name="github"
                value={student?.github} 
                editValue={formData.github}
                isEditing={editingField === 'github'}
                onEdit={() => setEditingField('github')}
                onCancel={() => setEditingField(null)}
                onChange={handleInputChange}
                onSave={() => handleInlineSave('github')}
                placeholder="Show recruiters your code 💻"
                isLink
              />

              {/* LinkedIn Field */}
              <InlineEditableField 
                label="LinkedIn Profile" 
                icon={<FiLinkedin size={16} />}
                name="linkedin"
                value={student?.linkedin} 
                editValue={formData.linkedin}
                isEditing={editingField === 'linkedin'}
                onEdit={() => setEditingField('linkedin')}
                onCancel={() => setEditingField(null)}
                onChange={handleInputChange}
                onSave={() => handleInlineSave('linkedin')}
                placeholder="Add your LinkedIn profile 🚀"
                isLink
              />

              {/* Portfolio Field */}
              <InlineEditableField 
                label="Portfolio Website" 
                icon={<LinkIcon size={16} />}
                name="portfolio"
                value={student?.portfolio} 
                editValue={formData.portfolio}
                isEditing={editingField === 'portfolio'}
                onEdit={() => setEditingField('portfolio')}
                onCancel={() => setEditingField(null)}
                onChange={handleInputChange}
                onSave={() => handleInlineSave('portfolio')}
                placeholder="Show your work to stand out ✨"
                isLink
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="text-blue-500" /> Technical Skills
              </h3>
              {editingField !== 'skills' && (
                <button onClick={() => setEditingField('skills')} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1">
                  <Edit2 size={14} /> Edit Skills
                </button>
              )}
            </div>

            {editingField === 'skills' ? (
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl dark:bg-slate-800/50">
                <div className="flex gap-2">
                  <input 
                    type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add a skill (e.g. React)..."
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <button onClick={handleAddSkill} className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-300"><X size={14}/></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button onClick={() => { setFormData(prev => ({...prev, skills: student.skills || []})); setEditingField(null); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl dark:text-slate-300">Cancel</button>
                  <button onClick={() => handleInlineSave('skills')} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Save Skills</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {student?.skills && student.skills.length > 0 ? (
                  student.skills.map((skill, index) => (
                    <span key={index} className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/30">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm italic text-slate-400">Add your technical strengths 😎</p>
                )}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="text-blue-500" /> Projects
              </h3>
              {editingField !== 'projects' && (
                <button onClick={() => setEditingField('projects')} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1">
                  <Edit2 size={14} /> Edit Projects
                </button>
              )}
            </div>

            {editingField === 'projects' ? (
              <div className="space-y-4">
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="relative rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                    <button onClick={() => handleRemoveProject(idx)} className="absolute right-3 top-3 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                    <div className="space-y-3 pr-6">
                      <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => handleProjectChange(idx, 'title', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                      <input type="text" placeholder="Live Link / Repo URL" value={proj.link} onChange={(e) => handleProjectChange(idx, 'link', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                      <textarea placeholder="Description" rows="2" value={proj.description} onChange={(e) => handleProjectChange(idx, 'description', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    </div>
                  </div>
                ))}
                <button onClick={handleAddProject} className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                  <Plus size={16} /> Add Project
                </button>
                <div className="flex gap-2 justify-end pt-2">
                  <button onClick={() => { setFormData(prev => ({...prev, projects: student.projects || []})); setEditingField(null); }} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl dark:text-slate-300">Cancel</button>
                  <button onClick={() => handleInlineSave('projects')} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Save Projects</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {student?.projects && student.projects.length > 0 ? (
                  student.projects.map((proj, index) => (
                    <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/30">
                      <h4 className="font-bold text-slate-900 dark:text-white">{proj.title || "Untitled Project"}</h4>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{proj.description}</p>
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">View Project →</a>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-slate-400">Showcase projects to improve chances 🚀</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Apply Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden md:block">
            By applying, you agree to share your profile details with <strong className="text-slate-900 dark:text-white">{drive?.companyName}</strong>.
          </p>
          <button
            onClick={handleSubmitApplication}
            disabled={applying}
            className="w-full md:w-auto rounded-2xl bg-blue-600 px-10 py-4 font-bold text-white shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-blue-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {applying ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Apply To Drive"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ReadOnlyField = ({ label, value, placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
    <div className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 cursor-not-allowed select-none">
      {value !== undefined && value !== null && value !== "" ? value : (placeholder || "Unavailable")}
    </div>
  </div>
);

const InlineEditableField = ({ label, icon, name, value, editValue, isEditing, onEdit, onCancel, onChange, onSave, placeholder, isLink }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {icon} {label}
        </span>
        {!isEditing && (
          <button onClick={onEdit} className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1">
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2 mt-1">
          <input 
            type="text" 
            name={name}
            value={editValue} 
            onChange={onChange}
            autoFocus
            className="w-full rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            placeholder={placeholder}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={onCancel} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg dark:text-slate-400">Cancel</button>
            <button onClick={onSave} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
          </div>
        </div>
      ) : (
        <div className="mt-1">
          {value ? (
            isLink ? (
              <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline dark:text-slate-200 dark:hover:text-blue-400 block truncate">
                {value}
              </a>
            ) : (
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{value}</p>
            )
          ) : (
            <p className="text-sm italic text-slate-400">{placeholder}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentApplyDrive;
