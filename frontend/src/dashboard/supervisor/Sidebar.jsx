import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 border-r">
      <h1 className="text-xl font-bold mb-6">TeachTrack</h1>
      <nav className="space-y-4">
        <button className="flex items-center space-x-2 text-left w-full hover:text-blue-600">
          <span>Dashboard</span>
        </button>
        <button className="flex items-center space-x-2 text-left w-full hover:text-blue-600">
          <span>Classes</span>
        </button>
        <button className="flex items-center space-x-2 text-left w-full hover:text-blue-600">
          <span>Analytics</span>
        </button>
        <button className="flex items-center space-x-2 text-left w-full hover:text-blue-600">
          <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
