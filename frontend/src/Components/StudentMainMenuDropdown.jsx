import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MainMenuDropdown = ({ className = "", onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleNavigation = (path) => {
    localStorage.setItem("role", "Student Teacher");
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    navigate("/");
    onClose?.();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.(); // Close if click is outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-2 top-10 w-64 max-w-[90vw] bg-white border border-gray-300 rounded-xl shadow-xl z-50 p-4 space-y-3 ${className}`}
    >
      <button
        onClick={() => handleNavigation("/hlpcategories/")}
        className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition"
      >
        📚 New HLP Reflection
      </button>
      <button
        onClick={() => handleNavigation("/reflections/")}
        className="w-full text-left px-4 py-3 bg-purple-600 text-white rounded-lg text-base font-semibold hover:bg-purple-700 transition"
      >
        📝 My Reflections
      </button>
      <button
        onClick={() => {
          alert("Resources clicked");
          onClose?.();
        }}
        className="w-full text-left px-4 py-3 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition"
      >
        📖 Resources
      </button>
      <button
        onClick={handleLogout}
        className="w-full text-center px-4 py-3 bg-red-600 text-white rounded-lg text-base font-semibold hover:bg-red-700 transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default MainMenuDropdown;
