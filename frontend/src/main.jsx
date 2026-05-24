import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";

import LandingPage from "./pages/LandingPage";

import StudentAuth from "./pages/auth/StudentAuth.jsx";
// import CompanyAuth from "./pages/auth/CompanyAuth";
// import CollegeAuth from "./pages/auth/CollegeAuth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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

          {/* <Route
            path="company/auth"
            element={<CompanyAuth />}
          /> */}

          {/* <Route
            path="college/auth"
            element={<CollegeAuth />}
          /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);