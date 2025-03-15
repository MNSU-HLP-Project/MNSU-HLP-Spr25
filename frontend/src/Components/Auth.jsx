import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: formData.email.trim(),
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        toast.success('Logged in successfully!');
        setTimeout(() => {
          navigate('/mainmenu');
        }, 1500);
      } else {
        toast.error('Login failed - Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      console.error('Login error:', error.response?.data);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/signup/', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        role: formData.role,
      });

      toast.success('Account created successfully!');
      setIsLogin(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          Object.values(error.response?.data || {})[0] || 
                          'Signup failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
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
          onClick={isLogin ? handleLogin : handleSignup}
        >
          {isLogin ? "Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
