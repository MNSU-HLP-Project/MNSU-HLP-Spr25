import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

function PasswordReset() {
  const [step, setStep] = useState(1); // 1: Request reset, 2: Verify OTP, 3: Reset password
  const [formData, setFormData] = useState({
    email: "",
    otp_code: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state
  React.useEffect(() => {
    const email = location.state?.email;
    if (email) {
      setFormData(prev => ({ ...prev, email }));
      setStep(2); // Skip to OTP verification if email is provided
    }
  }, [location]);

  // Countdown timer for resend button
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestReset = async () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await API.post("/user_auth/password-reset-request/", {
        email: formData.email
      });

      if (response.status === 200) {
        toast.success("Password reset code sent to your email!");
        setStep(2);
        setCountdown(60);
        setErrors({});
      }
    } catch (error) {
      console.error("Request reset error:", error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.email) {
          setErrors({ email: apiErrors.email[0] });
        } else if (apiErrors.error) {
          setErrors({ general: apiErrors.error });
        }
      } else {
        toast.error("Failed to send reset code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const newErrors = {};
    if (!formData.otp_code) newErrors.otp_code = "Verification code is required.";
    if (formData.otp_code.length !== 6) newErrors.otp_code = "Verification code must be 6 digits.";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await API.post("/user_auth/verify-otp/", {
        email: formData.email,
        otp_code: formData.otp_code,
        otp_type: "password_reset"
      });

      if (response.status === 200) {
        toast.success("Code verified! Please set your new password.");
        setStep(3);
        setErrors({});
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.non_field_errors) {
          setErrors({ general: apiErrors.non_field_errors[0] });
        } else if (apiErrors.otp_code) {
          setErrors({ otp_code: apiErrors.otp_code[0] });
        } else {
          setErrors({ general: "Invalid verification code. Please try again." });
        }
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const newErrors = {};
    if (!formData.new_password) newErrors.new_password = "New password is required.";
    if (!formData.confirm_password) newErrors.confirm_password = "Please confirm your password.";
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }
    if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters long.";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await API.post("/user_auth/password-reset/", {
        email: formData.email,
        otp_code: formData.otp_code,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });

      if (response.status === 200) {
        toast.success("Password reset successfully! You can now login.");
        navigate("/", { 
          state: { 
            message: "Password reset successfully! Please login with your new password.",
            passwordReset: true 
          }
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.new_password) {
          setErrors({ new_password: apiErrors.new_password[0] });
        } else if (apiErrors.confirm_password) {
          setErrors({ confirm_password: apiErrors.confirm_password[0] });
        } else if (apiErrors.non_field_errors) {
          setErrors({ general: apiErrors.non_field_errors[0] });
        } else {
          setErrors({ general: "Password reset failed. Please try again." });
        }
      } else {
        toast.error("Password reset failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await API.post("/user_auth/send-otp/", {
        email: formData.email,
        otp_type: "password_reset"
      });

      if (response.status === 200) {
        toast.success("Reset code sent successfully!");
        setCountdown(60);
        setErrors({});
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email address to receive a reset code</p>
      </div>

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

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <button
        onClick={handleRequestReset}
        disabled={isLoading}
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : "Send Reset Code"}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Reset Code</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <strong>{formData.email}</strong>
        </p>
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
        disabled={isLoading}
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <div className="text-center">
        <button
          onClick={handleResendOTP}
          disabled={isLoading || countdown > 0}
          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? "Sending..." 
            : countdown > 0 
              ? `Resend in ${countdown}s` 
              : "Resend Code"
          }
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          name="new_password"
          type="password"
          value={formData.new_password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter new password"
        />
        {errors.new_password && (
          <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          name="confirm_password"
          type="password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Confirm new password"
        />
        {errors.confirm_password && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
        )}
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <button
        onClick={handleResetPassword}
        disabled={isLoading}
        className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="text-center pt-4 border-t mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;




