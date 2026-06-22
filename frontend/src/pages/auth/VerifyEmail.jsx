import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

let processedTokens = new Set();

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await api.get(`/colleges/verify-email/${token}`);
         setStatus("success");
        toast.success(response.data.message || "Email verified successfully!");

        const data = response.data?.data;
        if (data?.college) {
          dispatch(setCredentials({ user: data.college, role: data.college.role }));
        }
        
        setTimeout(() => {
          navigate("/college/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        const msg = error.response?.data?.message || "Verification failed.";
        setErrorMessage(msg);
      }
    };

    if (token && !processedTokens.has(token)) {
      processedTokens.add(token);
      verifyEmailToken();
    }
    
  }, [token, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md rounded-[24px] border border-blue-100/50 bg-white/90 p-8 shadow-[0_8px_30px_rgb(37,99,235,0.06)] dark:border-slate-800 dark:bg-slate-900 text-center">
        
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verifying Email...</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Please wait while we verify your account securely.</p>
          </div>
        )}

         {status === "success" && (
         <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-3 mb-4 dark:bg-green-900/30">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Email Verified!</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Your account has been successfully verified.</p>
            <p className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">Redirecting to your dashboard...</p>
         </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-red-100 p-3 mb-4 dark:bg-red-900/30">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Failed</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{errorMessage}</p>
           <button 
              onClick={() => navigate("/college/auth")}
              className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-slate-900 dark:text-white transition hover:bg-blue-700"
            >
              Return to Login
           </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
