import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaUserShield } from "react-icons/fa";

const RoleIndicator = () => {
  const role = localStorage.getItem("role");
  
  // Define role-specific styles and icons
  const roleConfig = {
    "Student Teacher": {
      icon: <FaUserGraduate className="text-2xl md:text-3xl" />,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-600",
      label: "Student Teacher"
    },
    "Teacher": {
      icon: <FaChalkboardTeacher className="text-2xl md:text-3xl" />,
      color: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-600",
      label: "Teacher"
    },
    "Supervisor": {
      icon: <FaUserTie className="text-2xl md:text-3xl" />,
      color: "bg-purple-600",
      textColor: "text-purple-600",
      borderColor: "border-purple-600",
      label: "Supervisor"
    },
    "Admin": {
      icon: <FaUserShield className="text-2xl md:text-3xl" />,
      color: "bg-red-600",
      textColor: "text-red-600",
      borderColor: "border-red-600",
      label: "Administrator"
    },
    "Superuser": {
      icon: <FaUserShield className="text-2xl md:text-3xl" />,
      color: "bg-yellow-600",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-600",
      label: "Superuser"
    }
  };

  // Get configuration for current role, or use default
  const config = roleConfig[role] || {
    icon: <FaUserGraduate className="text-2xl md:text-3xl" />,
    color: "bg-gray-600",
    textColor: "text-gray-600",
    borderColor: "border-gray-600",
    label: "Guest"
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <div className={`relative flex items-center px-4 py-2 rounded-full border-2 ${config.borderColor} bg-white shadow-md group`}>
        {/* Role Icon */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${config.color} bg-opacity-20 mr-2`}>
          {config.icon}
        </div>
        
        {/* Role Label */}
        <span className={`font-semibold ${config.textColor}`}>
          {config.label}
        </span>
        
        {/* Animated Pulse Effect */}
        <div className={`absolute -inset-0.5 ${config.color} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      </div>
    </div>
  );
};

export default RoleIndicator;
