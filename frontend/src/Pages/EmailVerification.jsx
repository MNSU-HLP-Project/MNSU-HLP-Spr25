import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

function EmailVerification() {
  const [formData, setFormData] = useState({
    email: "",
    otp_code: "",
  });
  const [errors, setErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or URL params
  useEffect(() => {
    const email = location.state?.email || new URLSearchParams(location.search).get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [location]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyOTP = async () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.otp_code) newErrors.otp_code = "Verification code is required.";
    if (formData.otp_code.length !== 6) newErrors.otp_code = "Verification code must be 6 digits.";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsVerifying(true);
    try {
      const response = await API.post("/user_auth/verify-otp/", {
        email: formData.email,
        otp_code: formData.otp_code,
        otp_type: "signup"
      });

      if (response.status === 200) {
        toast.success("Email verified successfully! You can now login.");
        navigate("/", { 
          state: { 
            message: "Email verified successfully! Please login with your credentials.",
            verified: true 
          }
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.non_field_errors) {
          setErrors({ general: apiErrors.non_field_errors[0] });
        } else if (apiErrors.otp_code) {
          setErrors({ otp_code: apiErrors.otp_code[0] });
        } else if (apiErrors.email) {
          setErrors({ email: apiErrors.email[0] });
        } else {
          setErrors({ general: "Verification failed. Please try again." });
        }
      } else {
        toast.error("An error occurred during verification. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required to resend verification code." });
      return;
    }

    setIsResending(true);
    try {
      const response = await API.post("/user_auth/send-otp/", {
        email: formData.email,
        otp_type: "signup"
      });

      if (response.status === 200) {
        toast.success("Verification code sent successfully!");
        setCountdown(60); // 60 second cooldown
        setErrors({});
      }
    } catch (error) {
      console.error("Resend error:", error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        toast.error("Failed to resend verification code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to <strong>{formData.email}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              name="otp_code"
              type="text"
              value={formData.otp_code}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength="6"
            />
            {errors.otp_code && (
              <p className="text-red-500 text-sm mt-1">{errors.otp_code}</p>
            )}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={isVerifying}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending 
                ? "Sending..." 
                : countdown > 0 
                  ? `Resend in ${countdown}s` 
                  : "Resend Code"
              }
            </button>
          </div>

          <div className="text-center pt-4 border-t">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;

