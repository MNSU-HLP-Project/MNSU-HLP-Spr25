import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/axios";

function Auth() {
  // Set for data and defaults
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle change for the form, important that the name of the element matches what formData is expecting
  const handleChange = (form) => {
    const { name, value } = form.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // On button press, start an async function
  const buttonPress = async () => {
    const newErrors = {};
    // Set errors if not filled out
    if (!formData.username) newErrors.username = "username is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    // If any errors exist, stop execution
    if (Object.keys(newErrors).length > 0) return;

    try {
      // Post username and password to backend
        const response = await API.post("/user_auth/login/", {
          username: formData.username,
          password: formData.password,
        });
        // On correct login store the data and role, navigate to main menu
        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("role", response.data.role)
          console.log(response.data.role)
          navigate("/mainmenu/");
        }
      
      
    } catch (error) {
      // On error update error with the information from the error response code
      console.error("Error:", error);

      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        const updatedErrors = { ...newErrors };

        if (apiErrors.username) updatedErrors.username = apiErrors.username;
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
        Log In
      </h2>

      <div className="mt-4">
        <input
          name="username"
          type="username"
          placeholder="username"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
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

      {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

        
      <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={buttonPress}
      >
        Log In
      </button>
    </div>
  );
}

export default Auth;
