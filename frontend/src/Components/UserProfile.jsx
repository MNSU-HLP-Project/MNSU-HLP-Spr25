import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserCircle, FaEdit, FaKey, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  // Function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Get the current role from localStorage
      const currentRole = localStorage.getItem("role") || "Student Teacher";
      console.log("[UserProfile] Current role from localStorage:", currentRole);

      // Log all localStorage items for debugging
      console.log("[UserProfile] All localStorage items:");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }

      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data based on the user's role
      let mockUser;

      // Create different mock data based on role
      if (currentRole === "Teacher" || currentRole === "Supervisor") {
        mockUser = {
          id: 1,
          username: "teacher123",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane.smith@example.com",
          bio: "Experienced teacher with a passion for helping student teachers grow.",
          role: currentRole, // Use the role from localStorage
          joined_date: "2022-08-10",
          profile_image: null
        };
      } else {
        // Default to student teacher
        mockUser = {
          id: 2,
          username: "student123",
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          bio: "I am a student teacher passionate about special education.",
          role: currentRole, // Use the role from localStorage
          joined_date: "2023-01-15",
          profile_image: null
        };
      }

      setUser(mockUser);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user profile. Please try again later.");
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (changePassword) {
      if (!formData.current_password) {
        errors.current_password = "Current password is required";
      }

      if (!formData.new_password) {
        errors.new_password = "New password is required";
      } else if (formData.new_password.length && formData.new_password.length < 8) {
        errors.new_password = "Password must be at least 8 characters";
      }

      if (formData.new_password !== formData.confirm_password) {
        errors.confirm_password = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would send data to the backend
      // For now, we'll just simulate a successful update

      // Update user data
      setUser({
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        bio: formData.bio
      });

      // Show success message
      setSuccessMessage("Profile updated successfully!");

      // Exit edit mode
      setEditMode(false);
      setChangePassword(false);

      // Reset password fields
      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
      setLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
    setChangePassword(false);

    // Reset form data to current user data
    if (user) {
      setFormData({
        ...formData,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    }

    // Clear errors
    setFormErrors({});
  };

  // Navigate back based on user role
  const handleBackClick = () => {
    // Get the current role from localStorage
    const currentRole = localStorage.getItem("role") || "Student Teacher";
    console.log("[UserProfile] Navigating back with role:", currentRole);

    // Log all localStorage items for debugging
    console.log("[UserProfile] All localStorage items before navigation:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }

    // Always navigate back to main menu
    // The MainMenu component will display the appropriate content based on the role
    navigate("/mainmenu/");
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          My Profile
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* Role Indicator */}
      <RoleIndicator />

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* User Profile */}
      {!loading && user && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-40">
            <div className="absolute -bottom-16 left-6 md:left-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUserCircle className="text-gray-400 text-6xl" />
                    </div>
                  )}
                </div>
                {editMode && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors">
                    <FaCamera />
                  </button>
                )}
              </div>
            </div>

            {!editMode && (
              <button
                className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full shadow-md hover:bg-blue-50 transition-colors flex items-center gap-1"
                onClick={() => setEditMode(true)}
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-6">
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${formErrors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.first_name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${formErrors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Username (Read-only) */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={user.username}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                {/* Password Change Toggle */}
                <div className="mb-6">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    <FaKey />
                    {changePassword ? "Cancel Password Change" : "Change Password"}
                  </button>
                </div>

                {/* Password Change Fields */}
                {changePassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                    {/* Current Password */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                      <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${formErrors.current_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.current_password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.current_password}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${formErrors.new_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.new_password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.new_password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className={`w-full p-3 border ${formErrors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                      />
                      {formErrors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.confirm_password}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    onClick={handleCancel}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={loading}
                  >
                    <FaSave />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-600 mb-4">{user.username}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Information</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Role:</span> {user.role}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Joined:</span> {formatDate(user.joined_date)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Bio</h3>
                  <p className="text-gray-600">
                    {user.bio || "No bio provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
