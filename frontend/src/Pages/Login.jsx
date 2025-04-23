import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function Auth() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (form) => {
    const { name, value } = form.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buttonPress = async () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await API.post("/user_auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("role", response.data.role);
        navigate("/mainmenu/");
      }
    } catch (error) {
      const updatedErrors = { ...newErrors };
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (apiErrors.username) updatedErrors.username = apiErrors.username;
        if (apiErrors.password) updatedErrors.password = apiErrors.password;
        if (apiErrors.detail || apiErrors.error)
          updatedErrors.general = apiErrors.detail || apiErrors.error;
      } else {
        updatedErrors.general = "Something went wrong. Please try again.";
      }
      setErrors(updatedErrors);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Welcome Back
      </h2>

      {/* Username Input */}
      <div className="mb-5">
        <label className="block text-base md:text-lg font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          name="username"
          type="text"
          placeholder="e.g. supervisor@mnsu.edu"
          className="w-full px-4 py-3 bg-blue-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-all"
          onChange={handleChange}
          value={formData.username}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-5">
        <label className="block text-base md:text-lg font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 bg-blue-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-all"
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {/* General Error */}
      {errors.general && (
        <p className="text-sm text-red-500 text-center mb-4">
          {errors.general}
        </p>
      )}

      {/* Submit Button */}
      <button
        onClick={buttonPress}
        className="w-full py-3 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 text-base md:text-lg lg:text-xl text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-in-out"
      >
        Log In
      </button>
    </div>
  );
}

export default Auth;
