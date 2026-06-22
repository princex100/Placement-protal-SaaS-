import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentProtectedRoute = () => {
   const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/student/auth" replace />;
  }

  if (role !== "student") {
    if (role === "college-admin") return <Navigate to="/college/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default StudentProtectedRoute;
