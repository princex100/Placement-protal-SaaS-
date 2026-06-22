import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-blue-100/30 bg-transparent py-12 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 border-b border-blue-100/30 pb-8 transition-colors duration-300 dark:border-slate-800/60 md:grid-cols-4">
         <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2 text-violet-600 dark:text-violet-500">
              <Network className="h-6 w-6" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Campus<span className="text-violet-600 dark:text-violet-500">Flow</span></span>
            </div>
           <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Streamlining campus placements with a modern, recruiter-friendly ecosystem.</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Portals</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/student/auth" className="transition hover:text-blue-600 dark:hover:text-blue-400">Student Login</Link></li>
               <li><Link to="/college/auth" className="transition hover:text-blue-600 dark:hover:text-blue-400">College Login</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="transition hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
              <li><a href="#how-it-works" className="transition hover:text-blue-600 dark:hover:text-blue-400">How It Works</a></li>
              <li><a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
             <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@campusflow.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Tech Hub, Silicon Valley</li>
             </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between text-sm text-slate-500 dark:text-slate-400 md:flex-row">
           <p>© {new Date().getFullYear()} CampusFlow. All rights reserved.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">Terms</a>
            <a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">Privacy</a>
            <a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">Cookies</a>
         </div>
         </div>
       </div>
    </footer>
  );
};

export default Footer;