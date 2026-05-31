import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";

import LandingPage from "./pages/LandingPage";

import StudentAuth from "./pages/auth/StudentAuth.jsx";

import CollegeRegister from "./pages/auth/CollegeRegister.jsx";
import CollegeLogin from "./pages/auth/CollegeAuth.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import { store } from "./redux/store";
import CollegeDashboard from "./pages/college/CollegeDashboard.jsx";
// import CollegeAuth from "./pages/auth/CollegeAuth";

// Student Dashboard Imports
import StudentDashboardLayout from "./pages/student/StudentDashboardLayout.jsx";
import StudentProtectedRoute from "./pages/student/components/StudentProtectedRoute.jsx";
import StudentDashboard from "./pages/student/dashboard/StudentDashboard.jsx";
import StudentProfile from "./pages/student/profile/StudentProfile.jsx";
import StudentPlacementDrives from "./pages/student/placement-drives/StudentPlacementDrives.jsx";
import StudentDriveDetails from "./pages/student/placement-drives/StudentDriveDetails.jsx";
import StudentApplyDrive from "./pages/student/placement-drives/StudentApplyDrive.jsx";
import ApplicationStatus from "./pages/student/applications/ApplicationStatus.jsx";
import StudentApplicationDetails from "./pages/student/applications/StudentApplicationDetails.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Shared Layout */}
          <Route path="/" element={<App />}>

            {/* Landing Page */}
            <Route index element={<LandingPage />} />

            {/* Auth Pages */}

            <Route
              path="student/auth"
              element={<StudentAuth />}
            />

            {/* Student Dashboard Routes */}
            <Route element={<StudentProtectedRoute />}>
              <Route path="student/dashboard" element={<StudentDashboardLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="drives" element={<StudentPlacementDrives />} />
                <Route path="drives/:driveId" element={<StudentDriveDetails />} />
                <Route path="drives/:driveId/apply" element={<StudentApplyDrive />} />
                <Route path="applications" element={<ApplicationStatus />} />
                <Route path="applications/:applicationId" element={<StudentApplicationDetails />} />
              </Route>
            </Route>
            <Route
              path="college/auth"
              element={<CollegeLogin />}
            />
             <Route
              path="college/register"
              element={<CollegeRegister />}
            />
            <Route
              path="verify-email/:token"
              element={<VerifyEmail />}
            />
            <Route
              path="college/current"
              element={<CollegeDashboard />}
            />
            <Route
              path="college/dashboard/*"
              element={<CollegeDashboard />}
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
