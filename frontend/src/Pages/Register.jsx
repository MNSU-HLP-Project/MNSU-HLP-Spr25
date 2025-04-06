import React, { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import API from "../utils/axios";


function Register() {
  const [searchParams] = useSearchParams();
  const [gradelevels, setGradeLevels] = useState([])

  // Used to get the role that will be filled out as well as invitation code
  useEffect(() => {
      const code = searchParams.get('code');
      // Pull invitation code from search params
      if (code) {
          setFormData((prev) => ({ ...prev, searchParams: code }));
      }
      // pull role form search params
      const role = searchParams.get('role')
      if (role == 'sup' || role=='admin') {
        // Set student_teacher to false to display different options
          setFormData((prev) => ({ ...prev, student_teacher: false}))
      }
  }, [searchParams]);

  // Used to get grade levels when loading and then sort into correct order
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await API.get("/user_auth/getgrades/");
        // Sort the grades, handling both numbers and strings
        const sortedGrades = [...response.data].sort((a, b) => {
          // Convert numeric gradelevel strings to numbers, otherwise leave as string
          const gradeA = isNaN(a.gradelevel) ? a.gradelevel : Number(a.gradelevel);
          const gradeB = isNaN(b.gradelevel) ? b.gradelevel : Number(b.gradelevel);
  
          // If both gradelevels are numbers, compare numerically
          if (typeof gradeA === 'string' && typeof gradeB === 'string') {
            return gradeA < gradeB ? -1 : 1;
          }
  
          // If one is a string and the other is a number, treat the string as smaller
          if (typeof gradeA === 'string') return -1; // String comes first
          if (typeof gradeB === 'string') return 1;  // String comes first
  
          // If both are numbers, sort numerically
          return gradeA - gradeB;
        });
        setGradeLevels(sortedGrades);
        console.log(sortedGrades);
      } catch (error) {
        console.error("Error getting grades", error);
      }
    };

    fetchGrades();
  }, []);
// Default form data
  const [formData, setFormData] = useState({
    student_teacher: true,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // organization: "",
    confirmPassword: "",
    searchParams: "",
    grade_level:"",
    type_of_educator: "GE"
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle change of the form, based on name of input
  const handleChange = (form) => {
    const { name, value } = form.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Main submit function
  const buttonPress = async () => {
    const newErrors = {};

    // Error checks
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    // if (!formData.organization) newErrors.organization = "Organization is required.";
    if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
    };
    if (formData.student_teacher && !formData.grade_level) newErrors.grade_level = "Grade level is required."
    // if (!formData.role) newErrors.role = "Role is required.";
    
    // Set the errors to display
    setErrors(newErrors);

    // If any errors exist, stop execution
    if (Object.keys(newErrors).length > 0) return;
    console.log(formData)
    try {
        // Posting to backend for signup, all these are required
        const response = await API.post("/user_auth/signup/", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          invitation_code: formData.searchParams,
          grade_level: formData.grade_level,
          type_of_educator: formData.type_of_educator
        });
        // On success navigate to login page
        // TODO: Need to give an indication of succesful signup
        if (response.status === 201) {
          console.log("Signup Successful:", response.data);
          navigate('/')
        }
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.data) {
        // Update errors based on what is given in response
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Sign Up
      </h2>


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
          {/* Only shown with Student Teacher registrations */}
          {formData.student_teacher && (
          <div className="mt-4">
            <label className="text-gray-700 font-medium">Grade Level:</label>
            <select
              name="grade_level"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Select a grade level</option> {/* Default empty option */}
              {gradelevels.map((object) => (
                <option key={object.id} value={object.grade_level}>
                  {object.gradelevel}
                </option>
              ))}
            </select>
            {errors.grade_level && (
              <p className="text-red-500 text-sm mt-1">{errors.grade_level}</p>
            )}
          </div>)}
          {formData.student_teacher && (
          <div className="mt-4 flex items-center gap-2">
            <label className="text-gray-700 font-medium">Educator Type:</label>
            <select
              name="type_of_educator"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              {/* <option value="" disabled>
                Select an option...
              </option> */}
              <option value="GE">General Educator</option>
              <option value="SE">Special Educator</option>
            </select>
            {errors.type_of_educator && (
              <p className="text-red-500 text-sm mt-1">{errors.type_of_educator}</p>
            )}
          </div>)}
        </>
      

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


      {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

      <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={buttonPress}
      >
        Create Account
      </button>
    </div>
    </div>
  );
}


export default Register;
