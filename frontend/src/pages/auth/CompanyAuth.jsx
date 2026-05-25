import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Building2, Users, BarChart3,
  CheckCircle2, Sparkles, ChevronRight, Star, TrendingUp, AlertCircle
} from 'lucide-react';

// Simulated registered companies — replace with real API call
const REGISTERED_EMAILS = ['hr@google.com', 'recruit@tcs.com', 'campus@infosys.com'];

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 'not_registered' | 'wrong_password' | ''

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const isRegistered = REGISTERED_EMAILS.includes(email.toLowerCase().trim());

    if (!isRegistered) {
      setError('not_registered');
      return;
    }

    // Replace with real auth logic / API call
    if (password.length < 6) {
      setError('wrong_password');
      return;
    }

    navigate('/company/dashboard');
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
              Hire the Best <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                Campus Talent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md"
            >
              Post jobs, manage applications, and connect with top graduates from leading institutions — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 space-y-3"
            >
              <FeatureItem icon={<Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />} title="Post Job Openings" desc="Reach thousands of verified students across top colleges." />
              <FeatureItem icon={<Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />} title="Manage Applications" desc="Review, shortlist and schedule interviews seamlessly." />
              <FeatureItem icon={<BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />} title="Track Hiring Analytics" desc="Get insights on applicants, conversion rates and more." />
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
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Active Job Post</p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Frontend Engineer</h4>
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold">142 Applications</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">View Applicants</span>
                <ChevronRight className="h-3 w-3 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
              transition={{ opacity: { delay: 0.6 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 } }}
              className="absolute top-16 left-2 w-[190px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white dark:border-slate-700"
            >
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">This Week</p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">18 Shortlisted</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg">
                <span>Interviews Scheduled</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">6</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ opacity: { delay: 0.8 }, y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 } }}
              className="absolute bottom-2 right-10 w-[170px] bg-white dark:bg-slate-800 rounded-xl p-2.5 shadow-lg border border-slate-100 dark:border-slate-700"
            >
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Employer Rating</p>
              <div className="flex items-center gap-1.5 mb-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">4.8 / 5.0</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">By 320 students</p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="w-full lg:w-[45%] px-8 py-6 lg:px-12 flex flex-col justify-between relative bg-white dark:bg-slate-900">
          <div className="w-full max-w-md mx-auto flex flex-col h-full justify-center">

            <div className="hidden lg:flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PlacementPortal</span>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Company Login</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Access your recruiter dashboard and manage your campus hiring.
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4 rounded-xl border px-4 py-3 flex flex-col gap-1.5
                    bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                      {error === 'not_registered'
                        ? 'Company not registered. Please register first.'
                        : 'Incorrect password. Please try again.'}
                    </p>
                  </div>
                  {error === 'not_registered' && (
                    <button
                      onClick={() => navigate('/company/register')}
                      className="ml-6 self-start text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-colors"
                    >
                      Register your company →
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-3.5" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <CheckCircle2 className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember Me</span>
                </label>
                <a href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">Forgot Password?</a>
              </div>

              <button type="submit" className="w-full mt-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm">
                Log In
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Or login with</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                  <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Microsoft
              </button>
            </div>

            {/* Register CTA */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New to PlacementPortal?
              </p>
              <button
                onClick={() => navigate('/company/register')}
                className="w-full py-2.5 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                Register Your Company
              </button>
            </div>

          </div>

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

export default CompanyLogin;