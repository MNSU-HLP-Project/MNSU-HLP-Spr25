import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { decodeToken } from "../utils/jwtHelper";



function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organization: '',
    confirmPassword: '',
    role: 'General Educator'
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: ''
  });
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  const handleChange = (form) => {
    const {name, value} = form.target;
    setFormData(prevFormData => ({
      ...prevFormData, [name]: value
    }))
  }

  const buttonPress = async () => {
    const newErrors = {
      email: formData.email ? '' : 'Email is required.',
      password: formData.password ? '' : 'Password is required.'
    };

    setErrors(newErrors);
    if (!newErrors.email && !newErrors.password){
        if(isLogin) {
          try {
          const response = await axios.post('http://localhost:8000/api/login/', {
            email: formData.email,
            password: formData.password
          });

          if(response.status == 200) {
            const token = response.data.token;
            localStorage.setItem("jwtToken", token);

            const decoded = decodeToken(token);
            setUserDetails(decoded);
            console.log(decoded)
            navigate('/mainmenu/')
          } else {
            setErrors({password: 'Username or Password is incorrect'})
          }
          } catch (error) {
            console.error('Login Error:', error.response.data);
            alert('Invalid credentials. Please try again.');
          }

        } else {
          console.log(formData)
          const newErrors = {
            firstName: formData.firstName ? '' : 'First name is required.',
            lastName: formData.lastName ? '' : 'Last name is required.',
            email: formData.email ? '' : 'Email is required.',
            password: formData.password ? '' : 'Password is required.',
            confirmPassword: formData.password === formData.confirmPassword ? '' : 'Passwords do not match.',
            organization: formData.organization ? '' : 'Organization is required.',
            role: formData.role ? '' : 'Role is required.'
          };
          setErrors(newErrors);

          // Check for any errors
          console.log(newErrors)
          if (Object.values(newErrors).every(error => error === '')) {
            try {
              const response = await axios.post('http://localhost:8000/api/signup/', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                organization: formData.organization,
                role: formData.role
              });
              if (response.status == 201) {
              console.log('Signup Successful:', response.data);
              setIsLogin(true); // Switch to login after successful registration
              }
              else {
                console.log(response.data)
              }
            } catch (error) {
              console.error('Signup Error:', error.response.data);
              alert('An error occurred during signup. Please try again.');
            }
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
                name='lastName'
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
                name='role'
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="General educator">General Educator</option>
                <option value="Special educator">Special Educator</option>
                <option value="Other">Other</option>
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
            name='password'
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
              name='confirmPassword'
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
)}
          </div>
        )}

        <button className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={buttonPress}
          >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <div className="relative w-full flex justify-center mt-4">
          <span className="absolute bg-white px-2 text-gray-500 text-sm">
            or
          </span>
          <div className="w-full border-t border-gray-300 mt-3"></div>
        </div>

        <button className="w-full mt-6 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 shadow-sm">
          <FcGoogle className="text-2xl" />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
