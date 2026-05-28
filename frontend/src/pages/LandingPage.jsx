import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Header.jsx';
import Footer from './Footer.jsx';
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

/* --- MAIN LANDING PAGE --- */

const LandingPage = () => {
  const [activePortal, setActivePortal] = useState('student');

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
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 selection:bg-blue-200 selection:text-blue-900 dark:bg-slate-950 dark:text-slate-50 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      

      {/* 2. Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-blue-50 to-white pt-24 pb-16 transition-colors duration-300 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          
          <div className="mx-auto flex min-h-[140px] max-w-5xl items-center justify-center sm:min-h-[180px]">
            <h1 className="flex items-center justify-center text-center text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="pb-2">
                <span className="text-blue-600 dark:text-blue-400">{typedBase}</span>
                <span className="text-indigo-950 dark:text-indigo-200">{typedHighlight}</span>
              </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                className="ml-2 inline-block h-[1em] w-[4px] rounded-full bg-indigo-950 align-middle dark:bg-sky-400"
              />
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Connecting Students and Colleges in one streamlined placement ecosystem. 
            Automate workflows, track applications, and organize campus drives seamlessly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <button onClick={scrollToPortalSelection} className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">
              Get Started
            </button>
            <button onClick={scrollToPortalPreview} className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              Explore Portal
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Multi-Portal Dashboard Preview */}
      <section id="portalPreview" className="scroll-mt-16 bg-white py-12 pb-32 transition-colors duration-300 dark:bg-slate-950">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <PortalPreviewButton active={activePortal === 'student'} onClick={() => setActivePortal('student')} icon={<GraduationCap size={18} />} label="Student Portal" />
            <PortalPreviewButton active={activePortal === 'college'} onClick={() => setActivePortal('college')} icon={<Building2 size={18} />} label="College Portal" />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:ring-white/5 lg:h-[700px]">
            <div className="flex h-12 items-center border-b border-slate-100 bg-white px-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </div>
            <div className="relative h-[calc(100%-3rem)] w-full overflow-hidden bg-slate-50/50 transition-colors duration-300 dark:bg-slate-950/50">
              <AnimatePresence mode="wait">
                <motion.div key={activePortal} variants={portalPreviewVariants} initial="initial" animate="animate" exit="exit" className="h-full w-full">
                  {activePortal === 'student' && <StudentPortalPreview />}
                  {activePortal === 'college' && <CollegePortalPreview />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="bg-white py-24 transition-colors duration-300 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">Core Platform</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Built for scale, designed for simplicity</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<BarChart3 className="h-6 w-6" />} title="Student Placement Tracking" description="Real-time ATS-style dashboard for students to track application status, interview schedules, and job offers." />
            <FeatureCard icon={<Building2 className="h-6 w-6" />} title="College Placement Management" description="Automated workflows for placement cells to verify data, approve students, and generate reports." />
            <FeatureCard icon={<Users className="h-6 w-6" />} title="Organize Placement Drives" description="Colleges can create drives, filter candidates by criteria, manage interview rounds, and rollout offers seamlessly." />
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="border-y border-slate-100 bg-slate-50 py-24 transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">Workflow</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">A streamlined process</p>
          </div>
          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
            <WorkflowStep icon={<Briefcase className="h-7 w-7" />} step="1. College Creates Drive" desc="Colleges set criteria and post placement openings." color="blue" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-300 dark:text-slate-700 md:block" />
            <WorkflowStep icon={<CheckCircle2 className="h-7 w-7" />} step="2. Verification" desc="Placement cell verifies the drive requirements." color="blue" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-300 dark:text-slate-700 md:block" />
            <WorkflowStep icon={<GraduationCap className="h-7 w-7" />} step="3. Students Apply" desc="Eligible students submit their applications." color="blue" />
            <ChevronRight className="hidden h-6 w-6 flex-shrink-0 text-slate-300 dark:text-slate-700 md:block" />
            <WorkflowStep icon={<Users className="h-7 w-7" />} step="4. Recruitment Process" desc="Interviews are held and offers are made." color="green" />
          </div>
        </div>
      </section>

      {/* 6. Choose Your Portal Section */}
      <section id="portalSelection" className="scroll-mt-16 bg-white py-24 transition-colors duration-300 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Choose Your Portal</h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">Select your role to access your personalized dashboard.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <PortalCard icon={<GraduationCap className="h-8 w-8" />} title="Student Portal" desc="Apply to placement drives, track applications, and build your career." link="/student/auth" linkText="Continue as Student" />
            <PortalCard icon={<Building2 className="h-8 w-8" />} title="College Portal" desc="Manage students, approve placement drives, and coordinate recruitment." link="/college/auth" linkText="Continue as College" />
          </div>
        </div>
      </section>

      {/* 7. Statistics Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 divide-y divide-slate-200 text-center transition-colors duration-300 dark:divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <StatColumn value="500+" label="Students Placed" />
            <StatColumn value="120+" label="Partner Companies" />
            <StatColumn value="1000+" label="Applications Processed" />
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="relative overflow-hidden bg-blue-600 py-24 dark:bg-blue-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Start Your Placement Journey Today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">Join the ecosystem today. Select your portal to create an account and unlock endless opportunities.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/student/auth" className="w-full rounded-lg bg-white px-8 py-4 text-sm font-bold text-blue-600 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg sm:w-auto">Student Portal</Link>
            <Link to="/college/auth" className="w-full rounded-lg border border-blue-500 bg-blue-700 px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-800 hover:shadow-lg dark:border-blue-600 dark:bg-blue-900 dark:hover:bg-blue-950 sm:w-auto">College Portal</Link>
          </div>
        </div>
      </section>


    </div>
  );
};

/* --- GENERAL UI SUB-COMPONENTS --- */

const FeatureCard = ({ icon, title, description }) => (
  <div className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
    <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      {icon}
    </div>
    <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
    <p className="leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

const WorkflowStep = ({ icon, step, desc, color }) => (
  <div className="z-10 flex w-full flex-col items-center text-center md:w-1/4">
    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-colors duration-300 dark:bg-slate-800 dark:ring-slate-700 ${color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-emerald-400'}`}>
      {icon}
    </div>
    <h4 className="mt-6 font-bold text-slate-900 dark:text-white">{step}</h4>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </div>
);

const PortalCard = ({ icon, title, desc, link, linkText }) => (
  <div className="group flex flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)] hover:ring-blue-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800 dark:hover:ring-blue-500/50">
    <div>
      <div className="mb-6 inline-flex rounded-xl bg-blue-50 p-4 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
    <Link to={link} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-6 py-4 text-sm font-semibold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
      {linkText} <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

const StatColumn = ({ value, label }) => (
  <div className="flex flex-col py-4">
    <dt className="text-4xl font-extrabold text-blue-600 dark:text-blue-500">{value}</dt>
    <dd className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{label}</dd>
  </div>
);

/* --- PORTAL DASHBOARD PREVIEW COMPONENTS --- */

const PortalPreviewButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`}
  >
    {icon} {label}
  </button>
);

const StudentPortalPreview = () => (
  <div className="flex h-full w-full">
    <div className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:flex">
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Ankit 👋</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your placements.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-400">
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 dark:border-slate-700 dark:bg-slate-800">
            <img src="https://ui-avatars.com/api/?name=Ankit+Sharma&background=0D8ABC&color=fff" alt="User" className="h-8 w-8 rounded-full" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ankit Sharma</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Active Drives" value="24" trend="+12% this month" icon={<Briefcase size={20} />} color="blue" />
        <StatCard title="Applications" value="12" trend="+8% this month" icon={<FileText size={20} />} color="emerald" />
        <StatCard title="Interviews" value="4" trend="+14% this month" icon={<Users size={20} />} color="purple" />
        <StatCard title="Offers" value="1" trend="+100% this month" icon={<GraduationCap size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Placement Drives</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View All</button>
          </div>
          <div className="space-y-3">
            <DriveRow company="Google" role="SDE Intern" package="₹12 LPA" eligible="CSE, IT" date="28 May 2025" status="Apply" />
            <DriveRow company="Microsoft" role="SWE" package="₹18 LPA" eligible="CSE" date="02 Jun 2025" status="Applied" />
            <DriveRow company="Amazon" role="Graduate Engineer" package="₹16 LPA" eligible="IT, CSE, ECE" date="05 Jun 2025" status="Apply" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Application Status</h3>
          <div className="relative flex h-36 items-center justify-center">
            <div className="h-28 w-28 rounded-full border-[10px] border-slate-100 border-b-amber-400 border-l-purple-500 border-r-emerald-500 border-t-blue-500 dark:border-slate-800"></div>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Total</span>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            <ChartLegend label="Applied" value="6" color="bg-blue-500" />
            <ChartLegend label="Shortlisted" value="3" color="bg-emerald-500" />
            <ChartLegend label="Interview" value="2" color="bg-purple-500" />
            <ChartLegend label="Offer" value="1" color="bg-amber-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CollegePortalPreview = () => (
  <div className="flex h-full w-full">
    <div className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:flex">
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
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and coordinate student placements effectively.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Registered Students" value="850" trend="+40 this week" icon={<Users size={20} />} color="blue" />
        <StatCard title="Pending Approvals" value="8" trend="Requires attention" icon={<CheckCircle2 size={20} />} color="amber" />
        <StatCard title="Partner Companies" value="45" trend="Ongoing semester" icon={<Building2 size={20} />} color="purple" />
        <StatCard title="Placement Rate" value="72%" trend="+4% YoY" icon={<TrendingUp size={20} />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Incoming Placement Drives</h3>
          <div className="space-y-3">
            <DriveApprovalRow company="Google" role="SDE Internship" packages="₹12 LPA" />
            <DriveApprovalRow company="Amazon" role="Full Time Engineer" packages="₹16 LPA" />
            <DriveApprovalRow company="TCS" role="Ninja Profile" packages="₹3.36 LPA" />
          </div>
        </div>
        
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold text-slate-900 dark:text-white">Placement Analytics</h3>
          <div className="flex flex-1 items-center justify-center my-4">
             <BarChart3 className="h-28 w-28 text-blue-200 dark:text-slate-800" />
          </div>
          <button className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-blue-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700">
            Generate Full Report
          </button>
        </div>
      </div>
    </div>
  </div>
);



/* --- PREVIEW HELPER SUB-COMPONENTS --- */

const SidebarItem = ({ icon, label, active }) => (
  <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
    active ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
  }`}>
    {icon}
    {label}
  </button>
);

const StatCard = ({ title, value, trend, icon, color }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorStyles[color]}`}>
          {icon}
        </div>
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h4>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className={`text-xs font-medium ${color === 'amber' ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

const DriveRow = ({ company, role, package: pkg, eligible, date, status }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-sm dark:border-slate-800/60 dark:hover:border-slate-700">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {company[0]}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white">{company} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{role}</span></h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Eligible: {eligible}</p>
      </div>
    </div>
    <div className="hidden text-sm font-medium text-slate-600 dark:text-slate-300 md:block">{pkg}</div>
    <div className="hidden flex-col items-end text-xs text-slate-500 dark:text-slate-400 md:flex">
      <Calendar size={14} className="mb-1 text-slate-400 dark:text-slate-500" />
      {date}
    </div>
    <button className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
      status === 'Apply' 
        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20' 
        : 'cursor-default bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
    }`}>
      {status}
    </button>
  </div>
);

const DriveApprovalRow = ({ company, role, packages }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-sm dark:border-slate-800/60 dark:hover:border-slate-700">
    <div>
      <h4 className="font-semibold text-slate-900 dark:text-white">{company} <span className="px-2 text-sm font-normal text-slate-400 dark:text-slate-600">•</span> <span className="text-sm font-normal text-slate-600 dark:text-slate-300">{role}</span></h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Package: {packages}</p>
    </div>
    <div className="flex gap-2">
      <button className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">Reject</button>
      <button className="rounded bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">Approve</button>
    </div>
  </div>
);


const ChartLegend = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
    </div>
    <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
  </div>
);



export default LandingPage;