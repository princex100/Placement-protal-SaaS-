import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, Building2, Users, BarChart3,
  CheckCircle2, Sparkles, ChevronRight, Star, TrendingUp,
  Hash, Briefcase, User, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    industry: '',
    email: '',
    hrName: '',
    hrEmail: '',
    password: '',
    confirmPassword: '',
    description: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center p-3 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[1100px] h-full max-h-[620px] bg-white rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:bg-slate-900 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-slate-800 dark:via-blue-950/20 dark:to-slate-900 px-8 py-6 flex flex-col justify-between">

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 dark:bg-blue-900/20 blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-200/50 dark:bg-cyan-900/20 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5 lg:hidden text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PlacementPortal</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.15]"
            >
              Start Hiring <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                Smarter Today
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md"
            >
              Join 500+ companies already hiring top talent through our campus recruitment platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 space-y-3"
            >
              <FeatureItem icon={<Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />} title="Free to Get Started" desc="Create your company profile and post your first job for free." />
              <FeatureItem icon={<Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />} title="Access 50,000+ Students" desc="Tap into a verified pool of graduates from 200+ colleges." />
              <FeatureItem icon={<BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />} title="End-to-End Hiring" desc="From posting to onboarding — manage it all in one dashboard." />
            </motion.div>
          </div>

          {/* Floating Illustration */}
          <div className="relative mt-4 h-[180px] w-full hidden sm:block">

            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-2 left-6 w-36 h-36 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-white/60 dark:border-slate-700 shadow-xl flex items-center justify-center"
            >
              <Building2 className="h-14 w-14 text-blue-200 dark:text-slate-600" />
            </motion.div>

            {/* Card 1: Companies joined */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
              transition={{ opacity: { delay: 0.4 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 } }}
              className="absolute top-0 right-6 w-[220px] bg-white dark:bg-slate-800 rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Companies Onboarded</p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">500+ Recruiters</h4>
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">+12 this week</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Join them today</span>
                <ChevronRight className="h-3 w-3 text-blue-500" />
              </div>
            </motion.div>

            {/* Card 2: Placement stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
              transition={{ opacity: { delay: 0.6 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 } }}
              className="absolute top-16 left-2 w-[190px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-slate-700"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">Placements This Year</p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">12,400+ Hired</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg">
                <span>Avg. Offer</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">₹8.2 LPA</span>
              </div>
            </motion.div>

            {/* Card 3: Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ opacity: { delay: 0.8 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 } }}
              className="absolute bottom-2 right-10 w-[170px] bg-white dark:bg-slate-800 rounded-xl p-2.5 shadow-lg border border-slate-100 dark:border-slate-700"
            >
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Platform Rating</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">4.9 / 5.0</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">By 500+ companies</p>
            </motion.div>

          </div>
        </div>

        {/* RIGHT SIDE: REGISTER FORM */}
        <div className="w-full lg:w-[45%] relative flex flex-col bg-white dark:bg-slate-900">
          
          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-12">
            <div className="w-full max-w-md mx-auto flex flex-col h-max pb-12">

              <div className="hidden lg:flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PlacementPortal</span>
              </div>

              <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Register Company</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Set up your recruiter account and start hiring campus talent.
                </p>
              </div>

              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>

                {/* Row 1: Company ID + Company Name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company ID</label>
                    <div className="relative flex items-center">
                      <Hash className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type="text" name="companyId" value={formData.companyId} onChange={handleChange} placeholder="CMP-123"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Acme Corp"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                    </div>
                  </div>
                </div>

                {/* Row 2: Industry + Official Email */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                    <div className="relative flex items-center">
                      <Briefcase className="absolute left-3 h-4 w-4 text-slate-400" />
                      <select name="industry" value={formData.industry} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none" required>
                        <option value="">Select</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Manufacturing</option>
                        <option>Consulting</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="hr@company.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                    </div>
                  </div>
                </div>

                {/* Row 3: HR Name + HR Email */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">HR Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type="text" name="hrName" value={formData.hrName} onChange={handleChange} placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">HR Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type="email" name="hrEmail" value={formData.hrEmail} onChange={handleChange} placeholder="john@company.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                    </div>
                  </div>
                </div>

                {/* Row 4: Password + Confirm Password */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create password"
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
                      <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        required />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 5: Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Description</label>
                  <div className="relative flex items-start">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of your company..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none h-[68px]"
                      required />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer group pt-1">
                  <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                    <input type="checkbox" className="peer sr-only" required />
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <CheckCircle2 className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    I agree to the <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Privacy Policy</a>
                  </span>
                </label>

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm mt-2">
                  Create Company Account
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <Link to="/company/auth" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Login to your account.</Link>
              </p>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-8 sm:px-12 py-3 bg-gradient-to-t from-white via-white to-white/0 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/0 flex items-center justify-between text-[10px] font-medium text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
            <span className="pointer-events-auto">© 2026 Placement Portal</span>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors pointer-events-auto">Privacy Policy</a>
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

export default CompanyRegister;