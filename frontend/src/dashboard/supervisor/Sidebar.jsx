import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const getLinkClasses = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center space-x-2 text-left w-full px-2 py-1 rounded transition-colors duration-200 font-medium ${
      isActive
        ? "bg-blue-100 text-blue-800"
        : "text-gray-700 hover:text-blue-600"
    }`;
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 border-r border-gray-200">
      <h1 className="text-2xl font-extrabold text-blue-700 mb-8 tracking-tight">
        TeachTrack
      </h1>
      <nav className="space-y-4">
        <NavLink to="/mainmenu" className={getLinkClasses("/mainmenu")}>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/classes" className={getLinkClasses("/classes")}>
          <span>Classes</span>
        </NavLink>
        <button
          onClick={() => alert("Functionality coming soon!")}
          className="flex items-center space-x-2 text-left w-full text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
        >
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
