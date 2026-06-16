import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setCredentials } from '../../redux/features/authSlice';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Mail, Lock, Eye, EyeOff, Briefcase, TrendingUp, ShieldCheck, 
  CheckCircle2, Calendar, Network, ChevronRight, GraduationCap
} from 'lucide-react';

const CollegeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (isAuthenticated && (role === 'college' || role === 'college-admin')) {
      navigate('/college/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post("/colleges/login", formData);
      const data = response.data?.data || response.data;
      dispatch(setCredentials({ user: data.college || data, role: 'college-admin' }));
      toast.success("Logged in successfully!");
      navigate("/college/dashboard");
    } catch (error) {
      console.error("College login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-transparent flex items-center justify-center p-3 pb-24 lg:pb-32 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[1100px] h-full max-h-[620px] bg-white/90 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(37,99,235,0.06)] dark:bg-slate-900 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-blue-100/50 dark:border-slate-800 flex flex-col lg:flex-row">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-slate-800 dark:via-indigo-950/20 dark:to-slate-900 px-8 py-6 flex flex-col justify-between">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5 lg:hidden text-violet-600 dark:text-violet-400">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                <Network className="h-4 w-4 text-slate-900 dark:text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Campus<span className="text-violet-600 dark:text-violet-400">Flow</span></span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.15]"
            >
              Streamline Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Placements Seamlessly
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md"
            >
              Discover drives, track applications, and land offers for your students from top companies — all from one beautifully simple portal.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 space-y-3"
            >
              <FeatureItem icon={<Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />} title="500+ Active Drives" desc="New opportunities added every day for your students." />
              <FeatureItem icon={<TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />} title="High Placement Rate" desc="Proven track record across batches and departments." />
              <FeatureItem icon={<ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />} title="Verified Companies" desc="Every recruiter screened and approved for trust." />
            </motion.div>
          </div>

          {/* Floating Illustration */}
          <div className="relative mt-4 h-[180px] w-full hidden sm:block">
            <motion.div 
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-2 left-6 w-36 h-36 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-white/60 dark:border-slate-700 shadow-xl flex items-center justify-center"
            >
              <Network className="h-14 w-14 text-indigo-200 dark:text-slate-600" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
              transition={{ opacity: { delay: 0.4 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 } }}
              className="absolute top-0 right-6 w-[220px] bg-white dark:bg-slate-800 rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold shadow-sm text-sm"><GraduationCap className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Top Performer</p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Student Placed</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Google · ₹24 LPA</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center transition-colors">Offer Accepted</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
              transition={{ opacity: { delay: 0.6 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 } }}
              className="absolute top-16 left-2 w-[190px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-slate-700"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">Drive Status</p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Active</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg">
                <span>120 Applicants</span>
                <ChevronRight className="h-2.5 w-2.5" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ opacity: { delay: 0.8 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 } }}
              className="absolute bottom-2 right-10 w-[170px] bg-white dark:bg-slate-800 rounded-xl p-2.5 shadow-lg border border-slate-100 dark:border-slate-700"
            >
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Upcoming Drive</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Microsoft</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Date: 12 June, 2026</p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="w-full lg:w-[45%] px-8 py-6 lg:px-12 flex flex-col justify-between relative bg-white/60 dark:bg-slate-900">
          <div className="w-full max-w-md mx-auto flex flex-col h-full justify-center">
            
            {/* Header Logo */}
            <div className="hidden lg:flex items-center gap-2 mb-6 text-violet-600 dark:text-violet-400">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                <Network className="h-5 w-5 text-slate-900 dark:text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Campus<span className="text-violet-600 dark:text-violet-400">Flow</span></span>
            </div>

            {/* Form Header */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Login to access your college dashboard and manage placements.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">College Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" placeholder="prince@college.edu" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-950 border border-blue-100/50 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    required
                    autoComplete="off"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-white/80 dark:bg-slate-950 border border-blue-100/50 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    required
                    autoComplete="new-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-600/20 bg-white/80 dark:bg-slate-950"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-slate-900 dark:text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              New here?{' '}
              <a href="/college/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Create an account.</a>
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-3 left-0 right-0 px-8 sm:px-12 flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <span>© 2026 CampusFlow</span>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white dark:border-slate-700 flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default CollegeLogin;
