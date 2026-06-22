export const calculateProfileCompletion = (student) => {
  const fieldsToCheck = {
    fullName: "Add Full Name",
    email: "Add Email",
    phoneNumber: "Add Phone Number",
   gender: "Add Gender",
    profileImage: "Upload Profile Photo",
    branch: "Add Branch",
    cgpa: "Add CGPA",
    passingYear: "Add Passing Year",
    semester: "Add Semester",
    skills: "Add Skills",
    projects: "Add Projects",
    resume: "Upload Resume",
    github: "Add GitHub Profile",
    linkedin: "Add LinkedIn Profile",
    portfolio: "Add Portfolio Website"
  };

  let completedFields = 0;
  const missingFields = [];
   const totalFields = Object.keys(fieldsToCheck).length;

  for (const [key, label] of Object.entries(fieldsToCheck)) {
    const value = student[key];

    let isCompleted = false;

    if (Array.isArray(value)) {
      isCompleted = value.length > 0;
    } else {
      isCompleted = value !== undefined && value !== null && value !== "";
    }

    if (isCompleted) {
      completedFields++;
    } else {
      missingFields.push(label);
    }
  }

  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    percentage,
    missingFields
 };
};
