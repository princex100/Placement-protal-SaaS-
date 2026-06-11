import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2,
  BarChart3,
  Users,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Calendar,
  Settings,
  Bell,
  ChevronDown,
  XCircle,
  TrendingUp,
  PieChart
} from 'lucide-react';

/* --- CUSTOM HOOKS --- */

// Premium Typewriter Effect Hook
const useTypewriter = (words) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return { text: words[index].substring(0, subIndex), wordIndex: index };
};

/* --- ANIMATION VARIANTS --- */

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

/* --- MAIN LANDING PAGE --- */

const LandingPage = () => {
  const [activePortal, setActivePortal] = useState('student');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Typing effect phrases
  const phrases = [
    "Get Placed Smarter",
    "Create Drives Smarter",
    "Manage Placements Smarter"
  ];
  
  const { text: typedText, wordIndex } = useTypewriter(phrases);

  // Dynamic logic to split the sentence for the different colored last word
  const fullPhrase = phrases[wordIndex];
  const lastSpaceIdx = fullPhrase.lastIndexOf(' ');
  const baseLength = lastSpaceIdx + 1;

  const typedBase = typedText.substring(0, baseLength);
  const typedHighlight = typedText.substring(baseLength);

  const scrollToPortalSelection = (e) => {
    e.preventDefault();
    document.getElementById('portalSelection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortalPreview = (e) => {
    e.preventDefault();
    document.getElementById('portalPreview')?.scrollIntoView({ behavior: 'smooth' });
  };

  const portalPreviewVariants = {
    initial: { opacity: 0, x: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -40, filter: 'blur(10px)', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] font-sans text-slate-900 dark:text-white antialiased selection:bg-indigo-500/30 selection:text-slate-900 dark:text-white">
      
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-indigo-400/30 dark:bg-indigo-600/20 blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-violet-400/20 dark:bg-violet-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-32 pb-20">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
        >
          
          <motion.div variants={fadeInUp} className="mx-auto flex min-h-[140px] max-w-5xl items-center justify-center sm:min-h-[180px]">
            <h1 className="flex items-center justify-center text-center text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="pb-2">
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">{typedBase}</span>
                <span className="text-slate-900 dark:text-white">{typedHighlight}</span>
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                className="ml-2 inline-block h-[1em] w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-violet-500 align-middle"
              />
            </h1>
          </motion.div>

          <motion.p variants={fadeInUp} className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-white/60">
            Connecting Students and Colleges in one streamlined placement ecosystem. 
            Automate workflows, track applications, and organize campus drives seamlessly.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center gap-4">
            {!user && (
              <button 
                onClick={scrollToPortalSelection} 
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
            <button 
              onClick={scrollToPortalPreview} 
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none px-8 py-4 text-base font-semibold text-slate-900 dark:text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-slate-300 dark:border-white/20"
            >
              Explore Portal
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Multi-Portal Dashboard Preview */}
      <section id="portalPreview" className="scroll-mt-16 py-16 pb-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
          >
            <PortalPreviewButton active={activePortal === 'student'} onClick={() => setActivePortal('student')} icon={<GraduationCap size={18} />} label="Student Portal" />
            <PortalPreviewButton active={activePortal === 'college'} onClick={() => setActivePortal('college')} icon={<Building2 size={18} />} label="College Portal" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none shadow-2xl shadow-black/40 backdrop-blur-xl lg:h-[700px]"
          >
            {/* Browser Chrome */}
            <div className="flex h-12 items-center border-b border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-white/[0.03] px-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-white/10 transition-colors hover:bg-red-500/60"></div>
                <div className="h-3 w-3 rounded-full bg-white/10 transition-colors hover:bg-yellow-500/60"></div>
                <div className="h-3 w-3 rounded-full bg-white/10 transition-colors hover:bg-green-500/60"></div>
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-lg bg-slate-200 dark:bg-white/[0.05] px-4 py-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500/60"></div>
                <span className="text-xs text-slate-500 dark:text-white/40">campusflow.edu</span>
              </div>
            </div>
            
            <div className="relative h-[calc(100%-3rem)] w-full overflow-hidden bg-slate-50 dark:bg-[#0a0a12]">
              <AnimatePresence mode="wait">
                <motion.div key={activePortal} variants={portalPreviewVariants} initial="initial" animate="animate" exit="exit" className="h-full w-full">
                  {activePortal === 'student' && <StudentPortalPreview />}
                  {activePortal === 'college' && <CollegePortalPreview />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
              Core Platform
            </span>
            <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Built for scale, designed for <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">simplicity</span>
            </p>
          </motion.div>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <FeatureCard icon={<BarChart3 className="h-6 w-6" />} title="Student Placement Tracking" description="Real-time ATS-style dashboard for students to track application status, interview schedules, and job offers." color="indigo" />
            <FeatureCard icon={<Building2 className="h-6 w-6" />} title="College Placement Management" description="Automated workflows for placement cells to verify data, approve students, and generate reports." color="violet" />
            <FeatureCard icon={<Users className="h-6 w-6" />} title="Organize Placement Drives" description="Colleges can create drives, filter candidates by criteria, manage interview rounds, and rollout offers seamlessly." color="cyan" />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
              Workflow
            </span>
            <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">A streamlined process</p>
          </motion.div>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative flex flex-col items-center justify-between gap-8 md:flex-row"
          >
            <WorkflowStep icon={<Briefcase className="h-7 w-7" />} step="1. College Creates Drive" desc="Colleges set criteria and post placement openings." color="indigo" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-400 dark:text-white/20 md:block" />
            <WorkflowStep icon={<CheckCircle2 className="h-7 w-7" />} step="2. Verification" desc="Placement cell verifies the drive requirements." color="violet" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-400 dark:text-white/20 md:block" />
            <WorkflowStep icon={<GraduationCap className="h-7 w-7" />} step="3. Students Apply" desc="Eligible students submit their applications." color="cyan" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-400 dark:text-white/20 md:block" />
            <WorkflowStep icon={<Users className="h-7 w-7" />} step="4. Recruitment Process" desc="Interviews are held and offers are made." color="emerald" />
          </motion.div>
        </div>
      </section>

      {/* Choose Your Portal Section */}
      <section id="portalSelection" className="scroll-mt-16 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!user ? (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
              >
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Choose Your Portal</h2>
                <p className="mt-4 text-lg text-slate-500 dark:text-white/50">Select your role to access your personalized dashboard.</p>
              </motion.div>
              <motion.div 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto"
              >
                <PortalCard icon={<GraduationCap className="h-8 w-8" />} title="Student Portal" desc="Apply to placement drives, track applications, and build your career." link="/student/auth" linkText="Continue as Student" color="indigo" />
                <PortalCard icon={<Building2 className="h-8 w-8" />} title="College Portal" desc="Manage students, approve placement drives, and coordinate recruitment." link="/college/auth" linkText="Continue as College" color="violet" />
              </motion.div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center"
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{"You're on your way to success!"}</h2>
              <p className="mb-12 text-lg text-slate-500 dark:text-white/50">Jump right into your personalized dashboard to track your progress.</p>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-4 shadow-2xl backdrop-blur-xl">
                <img src="/students_placed.png" alt="Students celebrating placement" className="w-full max-w-4xl aspect-video rounded-2xl object-cover" />
              </div>
              <div className="mt-12">
                <Link to={user?.role === 'college-admin' ? '/college/dashboard' : '/student/dashboard'} className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 font-semibold text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40">
                  Go to Dashboard <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3"
          >
            <StatColumn value="500+" label="Students Placed" />
            <StatColumn value="120+" label="Partner Companies" />
            <StatColumn value="1000+" label="Applications Processed" />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-indigo-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">{user ? "Resume Your Progress" : "Start Your Placement Journey Today"}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-white/60">{user ? "Head back to your dashboard to track applications, manage drives, and stay on top of your career goals." : "Join the ecosystem today. Select your portal to create an account and unlock endless opportunities."}</p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!user ? (
              <>
                <Link to="/student/auth" className="group w-full rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    Student Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link to="/college/auth" className="w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-slate-900 dark:text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto">
                  College Portal
                </Link>
              </>
            ) : (
              <Link to={user?.role === 'college-admin' ? '/college/dashboard' : '/student/dashboard'} className="group w-full rounded-xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

    </div>
  );
};

/* --- GENERAL UI SUB-COMPONENTS --- */

const FeatureCard = ({ icon, title, description, color }) => {
  const colorStyles = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10',
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/20 group-hover:border-violet-500/40 group-hover:shadow-violet-500/10',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/10'
  };
  
  const iconStyles = {
    indigo: 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30',
    violet: 'bg-violet-500/20 text-violet-400 group-hover:bg-violet-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30'
  };

  return (
    <motion.div 
      variants={scaleIn}
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${colorStyles[color]}`}
    >
      <div className={`mb-5 inline-flex rounded-xl p-3 transition-colors ${iconStyles[color]}`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="leading-relaxed text-slate-500 dark:text-white/50">{description}</p>
    </motion.div>
  );
};

const WorkflowStep = ({ icon, step, desc, color }) => {
  const colorStyles = {
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
  };

  return (
    <motion.div variants={fadeInUp} className="z-10 flex w-full flex-col items-center text-center md:w-1/4">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-110 ${colorStyles[color]}`}>
        {icon}
      </div>
      <h4 className="mt-6 font-bold text-slate-900 dark:text-white">{step}</h4>
      <p className="mt-2 text-sm text-slate-500 dark:text-white/50">{desc}</p>
    </motion.div>
  );
};

const PortalCard = ({ icon, title, desc, link, linkText, color }) => {
  const colorStyles = {
    indigo: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    violet: 'hover:border-violet-500/50 hover:shadow-violet-500/10'
  };
  
  const buttonStyles = {
    indigo: 'from-indigo-500 to-violet-600 shadow-indigo-500/25 hover:shadow-indigo-500/40',
    violet: 'from-violet-500 to-purple-600 shadow-violet-500/25 hover:shadow-violet-500/40'
  };
  
  const iconBgStyles = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    violet: 'bg-violet-500/20 text-violet-400'
  };

  return (
    <motion.div 
      variants={scaleIn}
      className={`group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${colorStyles[color]}`}
    >
      <div>
        <div className={`mb-6 inline-flex rounded-xl p-4 transition-colors ${iconBgStyles[color]}`}>
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mb-8 leading-relaxed text-slate-500 dark:text-white/50">{desc}</p>
      </div>
      <Link to={link} className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white shadow-lg transition-all hover:shadow-xl ${buttonStyles[color]}`}>
        {linkText} <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </motion.div>
  );
};

const StatColumn = ({ value, label }) => (
  <motion.div variants={fadeInUp} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-8 backdrop-blur-xl">
    <dt className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-5xl font-bold text-transparent">{value}</dt>
    <dd className="mt-3 text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-white/40">{label}</dd>
  </motion.div>
);

/* --- PORTAL DASHBOARD PREVIEW COMPONENTS --- */

const PortalPreviewButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25' 
        : 'border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none text-slate-600 dark:text-white/60 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {icon} {label}
  </button>
);

const StudentPortalPreview = () => (
  <div className="flex h-full w-full">
    <div className="hidden w-64 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-4 lg:flex">
      <div className="space-y-1">
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
        <SidebarItem icon={<FileText size={18} />} label="My Applications" />
        <SidebarItem icon={<Briefcase size={18} />} label="Placement Drives" />
        <SidebarItem icon={<Calendar size={18} />} label="Interviews" />
        <SidebarItem icon={<Users size={18} />} label="My Profile" />
        <SidebarItem icon={<FileText size={18} />} label="Documents" />
        <SidebarItem icon={<Bell size={18} />} label="Notifications" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Ankit</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/50">{"Here's what's happening with your placements."}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-full border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none p-2 text-slate-500 dark:text-white/50 transition-colors hover:bg-white/10 hover:text-slate-900 dark:hover:text-white">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none p-1 pr-3">
            <img src="https://ui-avatars.com/api/?name=Ankit+Sharma&background=6366f1&color=fff" alt="User" className="h-8 w-8 rounded-full" />
            <span className="text-sm font-medium text-slate-700 dark:text-white/80">Ankit Sharma</span>
            <ChevronDown size={14} className="text-slate-500 dark:text-white/40" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Active Drives" value="24" trend="+12% this month" icon={<Briefcase size={20} />} color="indigo" />
        <StatCard title="Applications" value="12" trend="+8% this month" icon={<FileText size={20} />} color="emerald" />
        <StatCard title="Interviews" value="4" trend="+14% this month" icon={<Users size={20} />} color="violet" />
        <StatCard title="Offers" value="1" trend="+100% this month" icon={<GraduationCap size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-5 backdrop-blur-xl lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Placement Drives</h3>
            <button className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">View All</button>
          </div>
          <div className="space-y-3">
            <DriveRow company="Google" role="SDE Intern" package="12 LPA" eligible="CSE, IT" date="28 May 2025" status="Apply" />
            <DriveRow company="Microsoft" role="SWE" package="18 LPA" eligible="CSE" date="02 Jun 2025" status="Applied" />
            <DriveRow company="Amazon" role="Graduate Engineer" package="16 LPA" eligible="IT, CSE, ECE" date="05 Jun 2025" status="Apply" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-5 backdrop-blur-xl">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Application Status</h3>
          <div className="relative flex h-36 items-center justify-center">
            <div className="h-28 w-28 rounded-full border-[10px] border-slate-200 dark:border-white/[0.06] border-b-amber-500/60 border-l-violet-500/60 border-r-emerald-500/60 border-t-indigo-500/60"></div>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
              <span className="text-[10px] text-slate-500 dark:text-white/50">Total</span>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            <ChartLegend label="Applied" value="6" color="bg-indigo-500" />
            <ChartLegend label="Shortlisted" value="3" color="bg-emerald-500" />
            <ChartLegend label="Interview" value="2" color="bg-violet-500" />
            <ChartLegend label="Offer" value="1" color="bg-amber-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CollegePortalPreview = () => (
  <div className="flex h-full w-full">
    <div className="hidden w-64 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-4 lg:flex">
      <div className="space-y-1">
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
        <SidebarItem icon={<Users size={18} />} label="Students" />
        <SidebarItem icon={<Briefcase size={18} />} label="Incoming Drives" />
        <SidebarItem icon={<CheckCircle2 size={18} />} label="Approved Drives" />
        <SidebarItem icon={<XCircle size={18} />} label="Rejected Drives" />
        <SidebarItem icon={<PieChart size={18} />} label="Reports" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Placement Cell Overview</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/50">Manage and coordinate student placements effectively.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Registered Students" value="850" trend="+40 this week" icon={<Users size={20} />} color="indigo" />
        <StatCard title="Pending Approvals" value="8" trend="Requires attention" icon={<CheckCircle2 size={20} />} color="amber" />
        <StatCard title="Partner Companies" value="45" trend="Ongoing semester" icon={<Building2 size={20} />} color="violet" />
        <StatCard title="Placement Rate" value="72%" trend="+4% YoY" icon={<TrendingUp size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-5 backdrop-blur-xl lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Incoming Placement Drives</h3>
          <div className="space-y-3">
            <DriveApprovalRow company="Google" role="SDE Internship" packages="12 LPA" />
            <DriveApprovalRow company="Amazon" role="Full Time Engineer" packages="16 LPA" />
            <DriveApprovalRow company="TCS" role="Ninja Profile" packages="3.36 LPA" />
          </div>
        </div>
        
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-5 backdrop-blur-xl">
          <h3 className="font-bold text-slate-900 dark:text-white">Placement Analytics</h3>
          <div className="flex flex-1 items-center justify-center my-4">
             <BarChart3 className="h-28 w-28 text-slate-900 dark:text-white/10" />
          </div>
          <button className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none py-3 text-sm font-medium text-indigo-400 transition-all hover:bg-white/10">
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* --- PREVIEW HELPER SUB-COMPONENTS --- */

const SidebarItem = ({ icon, label, active }) => (
  <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    active ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-indigo-400' : 'text-slate-500 dark:text-white/50 hover:bg-white shadow-sm dark:bg-white/5 dark:shadow-none hover:text-slate-900 dark:hover:text-white'
  }`}>
    {icon}
    {label}
  </button>
);

const StatCard = ({ title, value, trend, icon, color }) => {
  const colorStyles = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    violet: 'bg-violet-500/20 text-violet-400',
    amber: 'bg-amber-500/20 text-amber-400'
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.04]">
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorStyles[color]}`}>
          {icon}
        </div>
        <h4 className="text-sm font-medium text-slate-500 dark:text-white/50">{title}</h4>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className={`text-xs font-medium ${color === 'amber' ? 'text-amber-400/70' : 'text-emerald-400/70'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const DriveRow = ({ company, role, package: pkg, eligible, date, status }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/[0.04] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-4 transition-all hover:border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.04]">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-white/5 dark:shadow-none font-bold text-slate-600 dark:text-white/70">
        {company[0]}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white">{company} <span className="text-sm font-normal text-slate-500 dark:text-white/40">{role}</span></h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-white/40">Eligible: {eligible}</p>
      </div>
    </div>
    <div className="hidden text-sm font-medium text-slate-600 dark:text-white/60 md:block">{pkg}</div>
    <div className="hidden flex-col items-end text-xs text-slate-500 dark:text-white/40 md:flex">
      <Calendar size={14} className="mb-1 text-slate-400 dark:text-white/30" />
      {date}
    </div>
    <button className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
      status === 'Apply' 
        ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
        : 'cursor-default bg-emerald-500/20 text-emerald-400'
    }`}>
      {status}
    </button>
  </div>
);

const DriveApprovalRow = ({ company, role, packages }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/[0.04] bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none p-4 transition-all hover:border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.04]">
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-white">{company} <span className="px-2 text-sm font-normal text-slate-400 dark:text-white/20">•</span> <span className="text-sm font-normal text-slate-600 dark:text-white/60">{role}</span></h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-white/40">Package: {packages}</p>
    </div>
    <div className="flex gap-2">
      <button className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/30">Reject</button>
      <button className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/30">Approve</button>
    </div>
  </div>
);

const ChartLegend = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
      <span className="text-slate-500 dark:text-white/50">{label}</span>
    </div>
    <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default LandingPage;