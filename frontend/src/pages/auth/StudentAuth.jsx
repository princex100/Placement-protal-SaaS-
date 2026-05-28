import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../redux/features/authSlice';
import api from '../../api/axios';
import { 
  Mail, Lock, Eye, EyeOff, Briefcase, TrendingUp, GraduationCap, 
  CheckCircle2, Calendar, Sparkles, ChevronRight, Hash
} from 'lucide-react';

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rollNo: '',
    password: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post("/students/login", {
        rollNumber: formData.rollNo, // Adjust if your backend expects 'rollNo' instead of 'rollNumber'
        password: formData.password
      });
      
      const data = response.data?.data;
      if (data?.student) {
        dispatch(setCredentials({ user: data.student, role: data.student.role }));
      }
      
      navigate("/student/dashboard"); // Adjust to your actual student dashboard route
    } catch (error) {
      console.error("Student login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center p-3 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[1100px] h-full max-h-[620px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:bg-slate-900 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row">
        
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-slate-800 dark:via-indigo-950/20 dark:to-slate-900 px-8 py-6 flex flex-col justify-between">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5 lg:hidden text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PlacementPortal</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.15]"
            >
              Your Placement <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Journey Starts Here
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md"
            >
              Explore job opportunities, apply with confidence, and build the career you've always dreamed of.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 space-y-3"
            >
              <FeatureItem icon={<Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />} title="Find Top Opportunities" desc="Discover jobs from leading companies recruiting on campus." />
              <FeatureItem icon={<TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />} title="Track Applications" desc="Monitor your applications and stay updated in real-time." />
              <FeatureItem icon={<GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />} title="Build Your Future" desc="Get placed, grow your skills, and achieve your goals." />
            </motion.div>
          </div>

          {/* Floating Illustration */}
          <div className="relative mt-4 h-[180px] w-full hidden sm:block">
            <motion.div 
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-2 left-6 w-36 h-36 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-white/60 dark:border-slate-700 shadow-xl flex items-center justify-center"
            >
              <GraduationCap className="h-14 w-14 text-indigo-200 dark:text-slate-600" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
              transition={{ opacity: { delay: 0.4 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 } }}
              className="absolute top-0 right-6 w-[220px] bg-white dark:bg-slate-800 rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold font-serif shadow-sm text-sm">G</div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">New Opportunity</p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Software Engineer</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Google</p>
                </div>
              </div>
              <button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold py-1.5 rounded-lg transition-colors">Apply Now</button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
              transition={{ opacity: { delay: 0.6 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 } }}
              className="absolute top-16 left-2 w-[190px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-slate-700"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">Application Status</p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Shortlisted</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg">
                <span>Round 2</span>
                <ChevronRight className="h-2.5 w-2.5" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ opacity: { delay: 0.8 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 } }}
              className="absolute bottom-2 right-10 w-[170px] bg-white dark:bg-slate-800 rounded-xl p-2.5 shadow-lg border border-slate-100 dark:border-slate-700"
            >
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Placement Drive</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">TCS Campus</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Date: 25 May, 2026</p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="w-full lg:w-[45%] px-8 py-6 lg:px-12 flex flex-col justify-between relative bg-white dark:bg-slate-900">
          <div className="w-full max-w-md mx-auto flex flex-col h-full justify-center">
            
            {/* Header Logo */}
            <div className="hidden lg:flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PlacementPortal</span>
            </div>

            {/* Form Header */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Login to access your student dashboard and explore opportunities.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Roll Number</label>
                <div className="relative flex items-center">
                  <Hash className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" placeholder="Enter your roll number" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all uppercase"
                    required
                    autoComplete="off"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-0.5">
                <a href="#" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Authenticating...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Contact your college placement cell.</a>
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-3 left-0 right-0 px-8 sm:px-12 flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500">
            <span>© 2026 Placement Portal</span>
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

export default StudentLogin;