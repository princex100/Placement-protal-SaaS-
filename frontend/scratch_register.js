import fs from 'fs';

let code = fs.readFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/auth/CollegeRegister.jsx', 'utf8');

// Find the Left Panel section
const startTag = '{/* LEFT PANEL */}';
const endTag = '{/* RIGHT PANEL */}';
const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    let leftPanel = code.substring(startIndex, endIndex);

    // Left Panel Wrapper Background
    leftPanel = leftPanel.replaceAll(
        'bg-gradient-to-br from-slate-950 via-[#0B1437] to-slate-950 text-white',
        'bg-gradient-to-br from-indigo-50 via-blue-50 to-white dark:from-slate-950 dark:via-[#0B1437] dark:to-slate-950 text-slate-900 dark:text-white'
    );

    // Text colors
    leftPanel = leftPanel.replaceAll('text-slate-400', 'text-slate-500 dark:text-slate-400');
    leftPanel = leftPanel.replaceAll('text-slate-300', 'text-slate-600 dark:text-slate-300');
    leftPanel = leftPanel.replaceAll('text-white', 'text-slate-900 dark:text-white');
    // Revert the wrapper's text-white that we specifically injected
    leftPanel = leftPanel.replaceAll('text-slate-900 dark:text-slate-900 dark:text-white', 'text-slate-900 dark:text-white');

    // Borders & Backgrounds
    leftPanel = leftPanel.replaceAll('border-white/10', 'border-slate-200 dark:border-white/10');
    leftPanel = leftPanel.replaceAll('bg-white/10', 'bg-white shadow-sm dark:bg-white/10 dark:shadow-none');
    leftPanel = leftPanel.replaceAll('bg-white/5', 'bg-slate-50/80 dark:bg-white/5');

    // Button gradients - these SHOULD stay text-white
    leftPanel = leftPanel.replaceAll('text-xs font-semibold hover:opacity-90', 'text-xs font-semibold text-white hover:opacity-90');

    code = code.substring(0, startIndex) + leftPanel + code.substring(endIndex);

    // FeatureRow Component definition inside CollegeRegister.jsx needs to be updated too!
    // Finding FeatureRow component definition
    const featureRowStart = code.indexOf('const FeatureRow = ({ icon, title, subtitle }) => (');
    const featureRowEnd = code.indexOf(');', featureRowStart) + 2;

    if (featureRowStart !== -1) {
        let featureRow = code.substring(featureRowStart, featureRowEnd);
        featureRow = featureRow.replaceAll('border-white/10', 'border-slate-200 dark:border-white/10');
        featureRow = featureRow.replaceAll('bg-white/10', 'bg-white shadow-sm dark:bg-white/10 dark:shadow-none');
        featureRow = featureRow.replaceAll('text-white', 'text-slate-900 dark:text-white');
        featureRow = featureRow.replaceAll('text-slate-400', 'text-slate-500 dark:text-slate-400');
        code = code.substring(0, featureRowStart) + featureRow + code.substring(featureRowEnd);
    }

    fs.writeFileSync('c:/Users/LENOVO/OneDrive/Desktop/placement portal PROJECT/frontend/src/pages/auth/CollegeRegister.jsx', code);
    console.log("Left panel refactored for light mode successfully.");
} else {
    console.log("Could not find LEFT PANEL markers.");
}
