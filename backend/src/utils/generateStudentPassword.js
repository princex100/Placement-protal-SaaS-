/**
 * Generates a default password for a student based on their name and roll number.
 * Format: First 3 letters of first name (uppercase) + Last 4 digits of roll number
 * 
 * @param {string} fullName 
 * @param {string} rollNo 
* @returns {string} The generated password
 */
export const generateStudentPassword = (fullName, rollNo) => {
  if (!fullName || !rollNo) {
    throw new Error("Full name and roll number are required to generate a password.");
  }

  const trimmedName = fullName.trim();
  const firstWord = trimmedName.split(/\s+/)[0].replace(/[^a-zA-Z]/g, "");
  
  const namePart = firstWord.substring(0, 3).toUpperCase();
  
  // Fallback if name has no alphabetic characters
  const safeNamePart = namePart.length > 0 ? namePart : "USR";

 // 2. Process Roll Number
  const trimmedRoll = String(rollNo).trim();
  
  let rollPart = "";
  if (trimmedRoll.length <= 4) {
    rollPart = trimmedRoll;
  } else {
    rollPart = trimmedRoll.slice(-4);
  }

  return `${safeNamePart}${rollPart}`;
};
