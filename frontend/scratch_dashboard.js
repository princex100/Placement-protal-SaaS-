import fs from 'fs';

let code = fs.readFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/college/CollegeDashboard.jsx', 'utf8');

// Colors
code = code.replaceAll('bg-[#0a0a12]', 'bg-slate-50 dark:bg-[#0a0a12]');
code = code.replaceAll('text-neutral-100', 'text-slate-900 dark:text-neutral-100');
code = code.replaceAll('text-neutral-400', 'text-slate-500 dark:text-neutral-400');
code = code.replaceAll('text-neutral-500', 'text-slate-500 dark:text-neutral-500');
code = code.replaceAll('text-neutral-600', 'text-slate-400 dark:text-neutral-600');
code = code.replaceAll('text-neutral-700', 'text-slate-400 dark:text-neutral-700');
code = code.replaceAll('text-neutral-300', 'text-slate-700 dark:text-neutral-300');

// Typography specific
code = code.replaceAll(' text-white ', ' text-slate-900 dark:text-white ');
code = code.replaceAll(' text-white\"', ' text-slate-900 dark:text-white\"');

// Backgrounds & Borders
code = code.replaceAll('bg-white/[0.04]', 'bg-slate-100 dark:bg-white/[0.04]');
code = code.replaceAll('bg-white/[0.02]', 'bg-white shadow-sm dark:bg-white/[0.02] dark:shadow-none');
code = code.replaceAll('bg-white/[0.01]', 'bg-slate-50 dark:bg-white/[0.01]');
code = code.replaceAll('border-white/[0.06]', 'border-slate-200 dark:border-white/[0.06]');
code = code.replaceAll('border-white/[0.04]', 'border-slate-200 dark:border-white/[0.04]');
code = code.replaceAll('bg-neutral-800', 'bg-slate-200 dark:bg-neutral-800');
code = code.replaceAll('bg-gradient-to-br from-white/[0.04] to-white/[0.01]', 'bg-gradient-to-br from-white to-slate-50 dark:from-white/[0.04] dark:to-white/[0.01] shadow-sm dark:shadow-none');

// Ambient lights (make them subtle in light mode)
code = code.replaceAll('bg-indigo-500/5', 'bg-indigo-200/40 dark:bg-indigo-500/5');
code = code.replaceAll('bg-violet-500/5', 'bg-violet-200/40 dark:bg-violet-500/5');
code = code.replaceAll('bg-blue-500/3', 'bg-blue-200/30 dark:bg-blue-500/3');

// Fix Buttons that should stay white
code = code.replaceAll('text-slate-900 dark:text-white text-sm sm:text-base', 'text-white text-sm sm:text-base'); // The Add Drive button
code = code.replaceAll('size-5 text-slate-900 dark:text-white', 'size-5 text-white'); // GraduationCap icon
code = code.replaceAll('size-4 text-slate-900 dark:text-white', 'size-4 text-white'); // Mobile GraduationCap icon
code = code.replaceAll('font-semibold text-slate-900 dark:text-white shadow-lg', 'font-semibold text-white shadow-lg');
code = code.replaceAll('border border-indigo-500/20 text-slate-900 dark:text-white font-medium', 'border border-indigo-500/20 text-indigo-700 dark:text-white font-medium');

// Mobile active navigation (needs text-indigo-700 instead of white for active state in light mode)
code = code.replaceAll('text-slate-900 dark:text-white font-medium shadow-lg', 'text-indigo-700 dark:text-white font-medium shadow-lg');

// Fix "text-white group-hover:text-white"
code = code.replaceAll('group-hover:text-slate-900 dark:text-white', 'group-hover:text-slate-900 dark:group-hover:text-white');

fs.writeFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/college/CollegeDashboard.jsx', code);
console.log('Dashboard refactored for light mode');
