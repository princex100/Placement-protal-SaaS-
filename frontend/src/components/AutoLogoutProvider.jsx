import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../redux/features/authSlice";
import { toast } from "react-hot-toast";

// Set timeout duration (e.g., 15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

const AutoLogoutProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logoutUser = () => {
    dispatch(clearCredentials());
    toast.error("You have been logged out due to inactivity.");
    // Redirect to login based on context
    if (window.location.pathname.startsWith('/college')) {
      navigate("/college/auth");
    } else {
      navigate("/student/auth");
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isAuthenticated) {
      timerRef.current = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    // Only set up listeners if the user is authenticated
    if (!isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ["mousemove", "keydown", "wheel", "click", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    // Initialize timer
    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AutoLogoutProvider;
