import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { decodeToken } from "../utils/jwtHelper";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organization: "",
    confirmPassword: "",
    role: "Student Teacher",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (form) => {
    const { name, value } = form.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const buttonPress = async () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = "First name is required.";
      if (!formData.lastName) newErrors.lastName = "Last name is required.";
      if (!formData.organization) newErrors.organization = "Organization is required.";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      if (!formData.role) newErrors.role = "Role is required.";
    }

    setErrors(newErrors);

    // If any errors exist, stop execution
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:8000/api/login/", {
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("jwtToken", token);
          const decoded = decodeToken(token);
          console.log(decoded);
          navigate("/mainmenu/");
        }
      } else {
        const response = await axios.post("http://localhost:8000/api/signup/", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          organization: formData.organization,
          role: formData.role,
        });

        if (response.status === 201) {
          console.log("Signup Successful:", response.data);
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        const updatedErrors = { ...newErrors };

        if (apiErrors.email) updatedErrors.email = apiErrors.email;
        if (apiErrors.password) updatedErrors.password = apiErrors.password;
        if (apiErrors.detail) updatedErrors.general = apiErrors.detail;
        if (apiErrors.error) updatedErrors.general = apiErrors.error

        setErrors(updatedErrors);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {!isLogin && (
        <>
          <div className="mt-4 flex gap-2">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="mt-4">
            <input
              name="organization"
              type="text"
              placeholder="Organization"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <label className="text-gray-700 font-medium">Role:</label>
            <select
              name="role"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="" disabled>
                Select an option...
              </option>
              <option value="Student Teacher">Student Teacher</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>
        </>
      )}

      <div className="mt-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mt-4">
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {!isLogin && (
        <div className="mt-4">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}

      {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={buttonPress}
      >
        {isLogin ? "Login" : "Create Account"}
      </button>
    </div>
  );
}

export default Auth;
