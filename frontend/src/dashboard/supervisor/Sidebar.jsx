import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 border-r border-gray-200">
      <h1 className="text-2xl font-extrabold text-blue-700 mb-8 tracking-tight">
        TeachTrack
      </h1>
      <nav className="space-y-4">
        <button className="flex items-center space-x-2 text-left w-full text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
          <span>Dashboard</span>
        </button>
        <button className="flex items-center space-x-2 text-left w-full text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
          <span>Classes</span>
        </button>
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
