import fs from 'fs';

let code = fs.readFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/LandingPage.jsx', 'utf8');

// Container
code = code.replaceAll('bg-[#06060a]', 'bg-slate-50 dark:bg-[#06060a]');
code = code.replaceAll('text-white antialiased', 'text-slate-900 dark:text-white antialiased');

// Ambient lights
code = code.replaceAll('bg-indigo-600/20', 'bg-indigo-400/30 dark:bg-indigo-600/20');
code = code.replaceAll('bg-violet-600/15', 'bg-violet-400/20 dark:bg-violet-600/15');
code = code.replaceAll('bg-cyan-600/10', 'bg-cyan-400/20 dark:bg-cyan-600/10');

// Text opacity mappings
code = code.replaceAll('text-white/60', 'text-slate-600 dark:text-white/60');
code = code.replaceAll('text-white/50', 'text-slate-500 dark:text-white/50');
code = code.replaceAll('text-white/40', 'text-slate-500 dark:text-white/40');
code = code.replaceAll('text-white/30', 'text-slate-400 dark:text-white/30');
code = code.replaceAll('text-white/20', 'text-slate-400 dark:text-white/20');
code = code.replaceAll('text-white/70', 'text-slate-600 dark:text-white/70');
code = code.replaceAll('text-white/80', 'text-slate-700 dark:text-white/80');

// Exact text-white to dark:text-white
// Carefully targeting the strings that represent classes 
code = code.replaceAll(' text-white ', ' text-slate-900 dark:text-white ');
code = code.replaceAll(' text-white\"', ' text-slate-900 dark:text-white\"');

// Border mappings
code = code.replaceAll('border-white/10', 'border-slate-200 dark:border-white/10');
code = code.replaceAll('border-white/[0.08]', 'border-slate-200 dark:border-white/[0.08]');
code = code.replaceAll('border-white/[0.06]', 'border-slate-200 dark:border-white/[0.06]');
code = code.replaceAll('border-white/[0.04]', 'border-slate-200 dark:border-white/[0.04]');
code = code.replaceAll('border-white/20', 'border-slate-300 dark:border-white/20');

// Background mappings
code = code.replaceAll('bg-white/5', 'bg-white shadow-sm dark:bg-white/5 dark:shadow-none');
code = code.replaceAll('bg-white/[0.02]', 'bg-white shadow-md dark:bg-white/[0.02] dark:shadow-none');
code = code.replaceAll('bg-white/[0.03]', 'bg-slate-100 dark:bg-white/[0.03]');
code = code.replaceAll('bg-white/[0.05]', 'bg-slate-200 dark:bg-white/[0.05]');
code = code.replaceAll('bg-[#0a0a12]', 'bg-slate-50 dark:bg-[#0a0a12]');

// Fix gradient buttons which SHOULD be text-white regardless of mode
code = code.replaceAll('text-slate-900 dark:text-white shadow-lg', 'text-white shadow-lg');
code = code.replaceAll('text-slate-900 dark:text-white shadow-sm', 'text-white shadow-sm');
code = code.replaceAll('text-slate-900 dark:text-white shadow-xl', 'text-white shadow-xl');
code = code.replaceAll('from-indigo-500 to-violet-600 text-slate-900 dark:text-white', 'from-indigo-500 to-violet-600 text-white');

// Fix buttons that need to look right on light mode
code = code.replaceAll('bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-lg', 'bg-slate-900 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-slate-900 shadow-lg');

fs.writeFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/LandingPage.jsx', code);
console.log('Replacements completed successfully!');
