import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { decodeToken } from "../utils/jwtHelper";
import { useSearchParams } from "react-router-dom";


function StudentRegister() {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            setFormData((prev) => ({ ...prev, searchParams: code }));
        }
        const role = searchParams.get('role')
        if (role == 'sup') {
            setFormData((prev) => ({ ...prev, student_teacher: false}))
        }
    }, [searchParams]);

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
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    // if (!formData.organization) newErrors.organization = "Organization is required.";
    if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
    };
    if (!formData.grade_level) newErrors.grade_level = "Grade level is required."
    // if (!formData.role) newErrors.role = "Role is required.";
    

    setErrors(newErrors);

    // If any errors exist, stop execution
    if (Object.keys(newErrors).length > 0) return;
    console.log(formData)
    try {
        const response = await axios.post("http://localhost:8000/api/signup/", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        //   organization: formData.organization,
          invitation_code: formData.searchParams,
          grade_level: formData.grade_level,
          type_of_educator: formData.type_of_educator
        });

        if (response.status === 201) {
          console.log("Signup Successful:", response.data);
          navigate('/')
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
          {formData.student_teacher && (<div className="mt-4">
            <input
              name="grade_level"
              type="text"
              placeholder="Grade Level"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
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
  );
}


export default StudentRegister;
