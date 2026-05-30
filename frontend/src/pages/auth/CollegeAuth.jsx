import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  BarChart3,
  Briefcase,
  Users,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CollegeLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    collegeId: "",
    email: "",
    password: "",
  });

  // Auto-scroll to top when navigated to this page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await api.post("/colleges/login", {
        collegeId: formData.collegeId,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data?.data;
      if (data?.college) {
        dispatch(setCredentials({ user: data.college, role: data.college.role }));
      }

      navigate("/college/dashboard");
    } catch (error) {
      console.error("College login failed:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeatureRow = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent dark:bg-slate-950 p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative flex w-full max-w-[1200px] max-h-[95vh] overflow-hidden rounded-[24px] border border-blue-100/50 bg-white/90 shadow-[0_8px_30px_rgb(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900"
      >
        {/* LEFT PANEL */}
        <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0B1437] to-slate-950 text-white p-8 xl:p-10 flex-col justify-between">
          {/* Background Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[420px] h-[420px] rounded-full bg-violet-600/20 blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_40%)]" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl">
                <GraduationCap className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">PlacementPortal</h3>
                <p className="text-xs text-slate-400">College Placement Cell</p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Welcome Back to <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Your Workspace
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Access your institutional dashboard to continue coordinating placement drives and managing student opportunities.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <FeatureRow
                icon={<Briefcase className="h-4 w-4" />}
                title="Active Drives"
                subtitle="Review and manage ongoing recruitment processes."
              />
              <FeatureRow
                icon={<Users className="h-4 w-4" />}
                title="Student Activity"
                subtitle="Track recent applications and interview shortlists."
              />
              <FeatureRow
                icon={<BarChart3 className="h-4 w-4" />}
                title="Live Analytics"
                subtitle="Check your real-time campus placement statistics."
              />
            </div>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="relative z-10 mt-8">
            <div className="absolute left-0 bottom-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-2xl w-[180px]">
              <p className="text-[10px] text-slate-400 mb-1.5">Weekly Placements</p>
              <div className="flex items-end gap-2 mb-2">
                <h3 className="text-2xl font-bold">42</h3>
                <span className="text-[10px] font-medium text-green-400 mb-1">+12%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-2 py-1.5">
                <span className="text-xs text-slate-300">View Report</span>
                <ChevronRight className="h-3 w-3 text-slate-400" />
              </div>
            </div>

            <div className="ml-auto w-[220px] rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-2xl shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Upcoming Interview</p>
                  <h4 className="font-semibold text-sm">Microsoft R1</h4>
                </div>
                <div className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                  Today
                </div>
              </div>
              <button className="w-full rounded-xl bg-white/10 py-2 text-xs font-semibold hover:bg-white/20 transition">
                Join Meeting Link
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-full flex-col justify-center bg-white/60 dark:bg-slate-900 lg:w-[55%]">
          <div className="overflow-y-auto px-6 py-6 sm:px-8 xl:px-12">
            <div className="mx-auto w-full max-w-[420px]">
              {/* Mobile Logo */}
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800">
                  <LayoutDashboard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">PlacementPortal</h2>
                  <p className="text-xs text-slate-500">College Placement Cell</p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  College Login
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField 
                  label="College ID" 
                  icon={<ShieldCheck size={16} />} 
                  name="collegeId" 
                  value={formData.collegeId} 
                  onChange={handleChange} 
                  placeholder="e.g. JSS123" 
                />
                
                <InputField 
                  label="Official Email" 
                  icon={<Mail size={16} />} 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="college@domain.edu" 
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-10 w-full rounded-xl border border-blue-100/50 bg-white/80 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* CTA */}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Login to Dashboard
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>


                {/* Footer */}
                <div className="pt-6 pb-2">
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    Don't have a college account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/college/register")}
                      className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* INPUT FIELD */
const InputField = ({ label, icon, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    <div className="group relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  </div>
);

export default CollegeLogin;
