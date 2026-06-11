import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Mail, Phone, BookOpen, GraduationCap, Briefcase, ExternalLink, Code, Plus, Trash2, Camera, Calendar, Building, X } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";
import { setCredentials } from "../../../redux/features/authSlice";

const StudentProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    gender: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: "",
    skills: [],
    projects: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
        resume: user.resume || "",
        skills: user.skills || [],
        projects: user.projects || [],
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Skills Handlers ---
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // --- Projects Handlers ---
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", link: "" }],
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index][field] = value;
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects.splice(index, 1);
      return { ...prev, projects: updatedProjects };
    });
  };

  // --- Save Profile ---
  const handleSaveProfile = async () => {
    try {
      setIsSubmitting(true);
      
      // Update basic profile fields
      const response = await api.patch("/students/profile", formData);
      let updatedUser = response.data?.data;
      
      // If there's a new resume file, upload it separately
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resumeFile);
        
        const resumeResponse = await api.patch("/students/resume", resumeFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedUser = resumeResponse.data?.data;
      }
      
      if (updatedUser) {
        dispatch(setCredentials({ user: updatedUser, role: "student" }));
        toast.success("Profile updated successfully 🎉");
        setIsEditing(false);
        setResumeFile(null); // Reset file
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get first letter of name
  const getAvatarLetter = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return "S";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(37,99,235,0.04)] dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-start">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative group">
            <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-100 to-indigo-100 text-4xl font-bold text-blue-600 shadow-inner dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                getAvatarLetter()
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 rounded-[28px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera className="text-slate-900 dark:text-white h-8 w-8" />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left mt-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
              {user?.fullName || user?.name || "Student Name"}
              {user?.placementStatus === "placed" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider dark:bg-emerald-900/30 dark:text-emerald-400">
                  Placed
                </span>
              )}
              {user?.placementStatus === "unplaced" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-wider dark:bg-slate-800 dark:text-slate-400">
                  Unplaced
                </span>
              )}
              {user?.placementStatus === "internship" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider dark:bg-blue-900/30 dark:text-blue-400">
                  Internship
                </span>
              )}
            </h1>
            
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-blue-500" /> {user?.rollNo || "Roll No N/A"}</span>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5"><Building size={16} className="text-blue-500" /> {user?.branch?.name || user?.branch || "Branch N/A"}</span>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-blue-500" /> Batch {user?.placementSeasonYear || "N/A"}</span>
            </div>
            
            {!isEditing && (
               <div className="mt-4">
                 <p className="text-sm text-slate-500 flex items-center gap-2 justify-center md:justify-start">
                   <Mail size={14} /> {user?.email || "No email provided"}
                 </p>
               </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isEditing ? (
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-slate-900 dark:text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-70 whitespace-nowrap flex justify-center items-center"
              >
                {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Save Changes"}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="rounded-2xl bg-blue-600 px-8 py-3.5 font-bold text-slate-900 dark:text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 w-full md:w-auto whitespace-nowrap"
            >
              {user?.isProfileCompleted ? "Edit Profile" : "Complete Profile"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN - Academic & Personal */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Academic Stats (Read Only) */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgb(37,99,235,0.03)] dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="text-blue-500" /> Academic Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500">CGPA</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{user?.cgpa || "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500">Backlogs</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{user?.backlogCount || "0"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500">Semester</p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{user?.semester || "N/A"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500">Passing Year</p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{user?.passingYear || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgb(37,99,235,0.03)] dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="text-blue-500" /> Personal Details
            </h3>
            
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <EditableField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                  <EditableField label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <InfoRow icon={<Phone size={18} />} label="Phone" value={user?.phoneNumber} placeholder="Add your phone number 📱" />
                  <InfoRow icon={<User size={18} />} label="Gender" value={user?.gender} placeholder="Tell us about yourself 👀" />
                </>
              )}
            </div>

            <h3 className="mt-8 mb-5 text-lg font-bold text-slate-900 dark:text-white">Socials & Links</h3>
            
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <EditableField label="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                  <EditableField label="GitHub URL" name="github" value={formData.github} onChange={handleChange} />
                  <EditableField label="Portfolio URL" name="portfolio" value={formData.portfolio} onChange={handleChange} />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resume File (PDF)</label>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                    {formData.resume && !resumeFile && (
                      <p className="text-xs text-slate-500 italic mt-1">Current resume uploaded. Select a new file to replace it.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <InfoRow icon={<FiLinkedin size={18} />} label="LinkedIn" isLink value={user?.linkedin} placeholder="Let recruiters find you 🚀" />
                  <InfoRow icon={<FiGithub size={18} />} label="GitHub" isLink value={user?.github} placeholder="Show your code magic 💻" />
                  <InfoRow icon={<ExternalLink size={18} />} label="Portfolio" isLink value={user?.portfolio} placeholder="Add your portfolio to stand out ✨" />
                  <InfoRow icon={<BookOpen size={18} />} label="Resume" isLink value={user?.resume} placeholder="Upload your resume and shine 📄" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Skills & Projects */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Skills Section */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_4px_20px_rgb(37,99,235,0.03)] dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="text-blue-500" /> Technical Skills
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="E.g. React, Node.js, Python..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" 
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2.5 font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-2 rounded-xl bg-slate-100 pl-4 pr-2 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/30">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm font-medium text-slate-400 italic">No skills added yet — flex your stack 😎</p>
                )}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_4px_20px_rgb(37,99,235,0.03)] dark:border-slate-800/60 dark:bg-slate-900 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="text-blue-500" /> Projects
              </h3>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Plus size={16} /> New Project
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {formData.projects.length === 0 ? (
                  <p className="text-sm text-slate-400 italic py-4 text-center">Click "New Project" to add your work.</p>
                ) : (
                  formData.projects.map((proj, index) => (
                    <div key={index} className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/20 group">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveProject(index)}
                        className="absolute right-4 top-4 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="space-y-4 w-full pr-8">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Project Title</label>
                          <input 
                            type="text" value={proj.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Link / Repository</label>
                          <input 
                            type="text" value={proj.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Description</label>
                          <textarea 
                            rows="2" value={proj.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" 
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user?.projects && user.projects.length > 0 ? (
                  user.projects.map((proj, index) => (
                    <div key={index} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-800/30 dark:hover:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{proj.title || "Untitled Project"}</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{proj.description || "No description provided."}</p>
                      </div>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 w-fit">
                          View Project <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                    <p className="text-sm font-medium text-slate-400 italic">No projects yet — time to build something cool 🚀</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const InfoRow = ({ icon, label, value, placeholder, isLink = false }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {value ? (
        isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="truncate text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400 block">
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
        )
      ) : (
        <p className="truncate text-sm font-medium text-slate-400 italic">{placeholder}</p>
      )}
    </div>
  </div>
);

const EditableField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    <input 
      type={type} name={name} value={value} onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white" 
    />
  </div>
);

export default StudentProfile;
