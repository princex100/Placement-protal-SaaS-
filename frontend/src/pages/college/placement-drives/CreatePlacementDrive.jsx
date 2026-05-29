import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, X, Building2, Briefcase, MapPin, IndianRupee, GraduationCap, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const PREDEFINED_BRANCHES = ["CSE", "IT", "ECE", "EEE", "ME", "CIVIL", "AIML", "DS"];
const PREDEFINED_YEARS = [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3];

const CreatePlacementDrive = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    role: "",
    package: "",
    location: "",
    jobType: "fulltime",
    mode: "on-site",
    minimumCgpa: "",
    backlogAllowed: 0,
    eligibleBranches: [],
    passingYearsAllowed: [],
    skillsRequired: [],
    description: "",
    responsibilities: "",
    applicationDeadline: "",
    driveDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const array = prev[name];
      if (array.includes(value)) {
        return { ...prev, [name]: array.filter((item) => item !== value) };
      } else {
        return { ...prev, [name]: [...array, value] };
      }
    });
  };

  const addSkill = (e) => {
    e.preventDefault();
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skillsRequired.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, trimmedSkill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.companyName || !formData.role || !formData.package || !formData.applicationDeadline) {
      toast.error("Please fill all required fields (*)");
      return;
    }

    setLoading(true);
    try {
      // Ensure numeric fields are numbers
      const payload = {
        ...formData,
        package: Number(formData.package),
        minimumCgpa: formData.minimumCgpa ? Number(formData.minimumCgpa) : 0,
        backlogAllowed: formData.backlogAllowed ? Number(formData.backlogAllowed) : 0,
      };

      await api.post("/drives", payload);
      toast.success("Placement drive created successfully");
      navigate("/college/dashboard/placement-drives");
    } catch (error) {
      console.error("Error creating drive:", error);
      // Dummy fallback for UI testing if backend fails
      toast.error(error.response?.data?.message || "Using dummy fallback: Drive creation simulated");
      navigate("/college/dashboard/placement-drives");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Drives
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create Placement Drive</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Publish a new job opportunity for your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION: Basic Info */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Building2 size={20} className="text-blue-500" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Drive Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Google Software Engineer 2024"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Role / Designation *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              >
                <option value="fulltime">Full-Time (FTE)</option>
                <option value="internship">Internship</option>
                <option value="internship+fte">Internship + FTE</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Work Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              >
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Package (LPA) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number"
                  step="0.1"
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  placeholder="e.g. 12.5"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Eligibility */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <GraduationCap size={20} className="text-emerald-500" /> Eligibility Criteria
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Minimum CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="minimumCgpa"
                value={formData.minimumCgpa}
                onChange={handleChange}
                placeholder="e.g. 7.5"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Max Active Backlogs Allowed</label>
              <input
                type="number"
                min="0"
                name="backlogAllowed"
                value={formData.backlogAllowed}
                onChange={handleChange}
                placeholder="e.g. 0"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">Eligible Branches</label>
              <div className="flex flex-wrap gap-3">
                {PREDEFINED_BRANCHES.map((branch) => (
                  <label key={branch} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.eligibleBranches.includes(branch)}
                      onChange={() => handleCheckboxChange("eligibleBranches", branch)}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{branch}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">Passing Years Allowed</label>
              <div className="flex flex-wrap gap-3">
                {PREDEFINED_YEARS.map((year) => (
                  <label key={year} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.passingYearsAllowed.includes(year)}
                      onChange={() => handleCheckboxChange("passingYearsAllowed", year)}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{year}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Timeline */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Clock size={20} className="text-orange-500" /> Timeline
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Application Deadline *</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Interview / Drive Date</label>
              <input
                type="date"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION: Details */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Briefcase size={20} className="text-purple-500" /> Additional Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Required Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
                  placeholder="e.g. React, Node.js"
                  className="flex-1 rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
                />
                <button
                  onClick={addSkill}
                  type="button"
                  className="flex items-center gap-1 rounded-xl bg-slate-100 px-4 font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              {formData.skillsRequired.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1 rounded-lg bg-blue-50 py-1 pl-3 pr-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="rounded-md p-1 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the company and the role..."
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              ></textarea>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Key Responsibilities</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="4"
                placeholder="What will the student do on a day-to-day basis?"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Publish Drive"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlacementDrive;
