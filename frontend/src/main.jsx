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
import CompanyAuth from "./pages/auth/CompanyAuth.jsx";
import CompanyRegister from "./pages/auth/CompanyRegister.jsx";
import CollegeRegister from "./pages/auth/CollegeRegister.jsx";
import CollegeLogin from "./pages/auth/CollegeAuth.jsx";
import { store } from "./redux/store";
import CollegeDashboard from "./pages/college/CollegeDashboard.jsx";
// import CollegeAuth from "./pages/auth/CollegeAuth";

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

            <Route
              path="company/auth"
              element={<CompanyAuth />}
            />
             <Route
              path="company/register"
              element={<CompanyRegister/>}
            />

            <Route
              path="college/auth"
              element={<CollegeLogin />}
            />
             <Route
              path="college/register"
              element={<CollegeRegister />}
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
