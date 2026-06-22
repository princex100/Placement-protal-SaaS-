import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, ChevronRight, FileText, CheckCircle2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import api from "../../../api/axios";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      applied: 0,
       shortlisted: 0,
      offers: 0,
      profileCompletion: {
       percentage: 0,
        missingFields: []
      }
    },
    latestDrives: []
   });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, drivesRes] = await Promise.allSettled([
          api.get('/students/dashboard-stats'),
          api.get('/drives/student/eligible') // Get eligible drives
        ]);
        
        const latestDrives = drivesRes.status === 'fulfilled' ? (drivesRes.value.data?.data || []) : [];
        
        let stats = dashboardData.stats;
        if (statsRes.status === 'fulfilled') {
          const fetchedStats = statsRes.value.data?.data;
          stats = {
            applied: fetchedStats.appliedDrives || 0,
            shortlisted: 0, // This could be fetched similarly if needed
            offers: fetchedStats.jobOffers || 0,
           profileCompletion: fetchedStats.profileCompletion || { percentage: 0, missingFields: [] },
            placementStatus: fetchedStats.placementStatus || "unplaced"
          };
         }

        setDashboardData({ stats, latestDrives });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
   fetchDashboard();
  }, []);

  return (
    <>
      {/* Top Welcome Section */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(37,99,235,0.04)] dark:border-slate-800/60 dark:bg-slate-900 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || "Student"} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your applications, track active placement drives, and monitor your placement progress.
           </p>
        </div>

         <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-blue-50/50 px-5 py-3 dark:bg-slate-800/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Placement Status</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {dashboardData.stats.placementStatus || user?.placementStatus || "Unplaced"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Applied Drives" 
          value={dashboardData.stats.applied} 
           icon={<Briefcase size={22} />} 
          trend="Total applications" 
          progress={dashboardData.stats.applied} 
       />
        <StatCard 
          title="Shortlisted" 
          value={dashboardData.stats.shortlisted} 
          icon={<FileText size={22} />} 
          trend="Moving to next round" 
          progress={dashboardData.stats.applied ? (dashboardData.stats.shortlisted / dashboardData.stats.applied) * 100 : 0} 
        />
        <StatCard 
           title="Offers Received" 
          value={dashboardData.stats.offers} 
          icon={<TrendingUp size={22} />} 
           trend="Congratulations" 
          progress={dashboardData.stats.offers > 0 ? 100 : 0} 
          color="emerald"
        />
      </div>

      {/* Complete Your Profile Section */}
      <div className="flex flex-col rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(37,99,235,0.04)] dark:border-slate-800/60 dark:bg-slate-900">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h2>
            
            {dashboardData.stats.profileCompletion.percentage < 50 ? (
              <p className="text-sm font-medium text-amber-600 dark:text-amber-500 mt-1">Profile incomplete. Complete your profile before placements.</p>
            ) : dashboardData.stats.profileCompletion.percentage >= 80 && dashboardData.stats.profileCompletion.percentage < 100 ? (
             <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">Great! Your profile looks placement-ready 🚀</p>
            ) : dashboardData.stats.profileCompletion.percentage === 100 ? (
               <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">Profile Completed ✅</p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add more details to stand out to recruiters.</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardData.stats.profileCompletion.percentage}%</span>
              <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    dashboardData.stats.profileCompletion.percentage === 100 ? 'bg-emerald-500' :
                    dashboardData.stats.profileCompletion.percentage > 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${dashboardData.stats.profileCompletion.percentage}%` }}
                ></div>
              </div>
             </div>

             {dashboardData.stats.profileCompletion.percentage < 100 && dashboardData.stats.profileCompletion.missingFields.length > 0 && (
              <div className="mt-6">
               <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Missing Details:</p>
               <div className="flex flex-wrap gap-2">
                  {dashboardData.stats.profileCompletion.missingFields.map((field, index) => (
                   <span key={index} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                      {field}
                    </span>
                  ))}
                </div>
               </div>
             )}
         </div>

          {dashboardData.stats.profileCompletion.percentage < 100 && (
           <div className="shrink-0 mt-4 md:mt-0">
             <button 
                onClick={() => navigate('/student/dashboard/profile')}
               className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-slate-900 dark:text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-600/20 dark:bg-blue-500 dark:hover:bg-blue-600"
             >
                Complete Profile
              </button>
            </div>
          )}
         </div>
      </div>


      {/* Latest Placement Drives */}
      <div className="flex flex-col rounded-[32px] border border-blue-100/50 bg-white/90 backdrop-blur-md p-8 shadow-[0_8px_30px_rgb(37,99,235,0.04)] dark:border-slate-800/60 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latest Placement Drives</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">New job opportunities available for you</p>
          </div>
         <button 
            onClick={() => navigate('/student/dashboard/drives')}
             className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {loading ? (
             <div className="col-span-2 flex justify-center py-8">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"></div>
            </div>
          ) : dashboardData.latestDrives.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 dark:border-slate-800">
               <p className="text-sm text-slate-500">No active placement drives found right now.</p>
             </div>
           ) : (
            dashboardData.latestDrives.map((drive) => (
              <div 
                key={drive._id}
                onClick={() => navigate(`/student/dashboard/drives/${drive._id}`)}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:-translate-y-1 hover:border-blue-100 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-700">
                    <Building2 size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{drive.companyName}</h4>
                    <div className="mt-0.5 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{drive.role}</span>
                       <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{drive.package} LPA</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-slate-900 dark:group-hover:text-white dark:bg-slate-700">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon, trend, progress, color = "blue" }) => {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
     bar: "bg-blue-600 dark:bg-blue-500"
    },
    emerald: {
     bg: "bg-emerald-50 dark:bg-emerald-900/20",
     text: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-600 dark:bg-emerald-500"
    },
     amber: {
     bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500 dark:bg-amber-500"
    }
  };

  const selectedColor = colorStyles[color];

  return (
    <div className="rounded-[32px] border border-slate-100 bg-white/90 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(37,99,235,0.03)] dark:border-slate-800/60 dark:bg-slate-900">
     <div className="mb-4 flex items-center justify-between">
         <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selectedColor.bg} ${selectedColor.text}`}>
           {icon}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {trend}
       </div>
      </div>
      
      <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
     <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div 
          className={`h-full rounded-full ${selectedColor.bar}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
