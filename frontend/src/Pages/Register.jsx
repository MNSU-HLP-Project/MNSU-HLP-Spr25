import { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

const roleObj = {
  'stu': 'Practitioner',
  'admin': 'Administrator',
  'sup': 'Coach / Facilitator'
};

function Register() {
  const [searchParams] = useSearchParams();
  const [roleSignup, setRoleSignup] = useState('')
  const gradeLevels = [
    { value: "primary", label: "Primary (K-3)" },
    { value: "intermediate", label: "Intermediate (4-5)" },
    { value: "middle_grades", label: "Middle Grades (6-8)" },
    { value: "high_school", label: "High School (9-12)" }
  ];
  const professionalCategories = [
    { value: "principal", label: "Principal" },
    { value: "assistant_principal", label: "Assistant Principal" },
    { value: "dean", label: "Dean" },
    { value: "special_education_administrator", label: "Special Education Administrator" },
    { value: "instructional_coach", label: "Instructional Coach" },
    { value: "general_educator", label: "General Educator" },
    { value: "special_educator", label: "Special Educator" },
    { value: "other", label: "Other" }
  ];
  const roleDescriptions = {
    Practitioner: "Supports users who are developing, practicing, documenting, and reflecting on their implementation of High-Leverage Practices. This includes pre-service teacher and leader candidates, in-service teachers, special educators, and school leaders.",
    "Coach / Facilitator": "Supports users who observe practice, provide feedback, mentor educators, facilitate reflection, or monitor progress. Examples include IHE faculty, cooperating teachers, principals, instructional coaches, and professional learning facilitators."
  };
  // Used to get the role that will be filled out as well as invitation code
  useEffect(() => {
      const code = searchParams.get('code');
      // Pull invitation code from search params
      if (code) {
          setFormData((prev) => ({ ...prev, searchParams: code }));
      }
      // Pull role from search params
      const role = searchParams.get('role')
      setRoleSignup(roleObj[role])
  }, [searchParams]);

// Default form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // organization: "",
    confirmPassword: "",
    searchParams: "",
    grade_levels: [],
    professional_category: "",
    other_professional_category: ""
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

  const handleGradeLevelChange = (event) => {
    const { checked, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      grade_levels: checked
        ? [...prevFormData.grade_levels, value]
        : prevFormData.grade_levels.filter((gradeLevel) => gradeLevel !== value),
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
    if (formData.grade_levels.length === 0) newErrors.grade_levels = "Select at least one grade level."
    if (!formData.professional_category) newErrors.professional_category = "Select an educator type."
    if (formData.professional_category === "other" && !formData.other_professional_category.trim()) {
      newErrors.other_professional_category = "Please specify your educator type."
    }
    // if (!formData.role) newErrors.role = "Role is required.";
    
    // Set the errors to display
    setErrors(newErrors);

    // If any errors exist, stop execution
    if (Object.keys(newErrors).length > 0) return;
    try {
        // Posting to backend for signup, all these are required
        const response = await API.post("/user_auth/signup/", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          invitation_code: formData.searchParams,
          grade_levels: formData.grade_levels,
          professional_category: formData.professional_category,
          other_professional_category: formData.other_professional_category
        });
        // On success navigate to email verification page
        if (response.status === 201) {
          if (response.data.email_sent) {
            navigate('/email-verification', { 
              state: { 
                email: response.data.user_email,
                message: response.data.message 
              }
            });
          } else {
            // Email failed to send, but user was created
            navigate('/email-verification', { 
              state: { 
                email: response.data.user_email,
                message: response.data.message,
                showResend: true
              }
            });
          }
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
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gray-100 p-4">
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {roleSignup} Sign Up
      </h2>
      {roleDescriptions[roleSignup] && (
        <p className="mt-2 text-sm text-center text-gray-600">
          {roleDescriptions[roleSignup]}
        </p>
      )}

        <form onSubmit={(e) => { e.preventDefault(); buttonPress(); }}>
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
            <fieldset>
              <legend className="text-gray-700 font-medium">Grade Level:</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {gradeLevels.map((gradeLevel) => (
                  <label key={gradeLevel.value} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      name="grade_levels"
                      value={gradeLevel.value}
                      checked={formData.grade_levels.includes(gradeLevel.value)}
                      onChange={handleGradeLevelChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {gradeLevel.label}
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.grade_levels && (
              <p className="text-red-500 text-sm mt-1">{errors.grade_levels}</p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="professional_category" className="text-gray-700 font-medium">Educator Type:</label>
            <select
              id="professional_category"
              name="professional_category"
              value={formData.professional_category}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Select an educator type</option>
              {professionalCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.professional_category && (
              <p className="text-red-500 text-sm mt-1">{errors.professional_category}</p>
            )}
          </div>
          {formData.professional_category === "other" && (
            <div className="mt-4">
              <label htmlFor="other_professional_category" className="text-gray-700 font-medium">Please specify:</label>
              <input
                id="other_professional_category"
                name="other_professional_category"
                type="text"
                value={formData.other_professional_category}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
              {errors.other_professional_category && (
                <p className="text-red-500 text-sm mt-1">{errors.other_professional_category}</p>
              )}
            </div>
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
          errors.password.map((e, index) => (
            <p key={index} className="text-red-500 text-sm mt-1">{e}</p>
          ))
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
        type="submit"
      >
        Create Account
      </button>
    </form>
    </div>
    </div>
  );
}


export default Register;
