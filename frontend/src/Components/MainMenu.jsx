import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();
  const buttonPress = (route) => {
    navigate(route);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <button
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => buttonPress('/hlpcategories/')}
        >
          HLP Categories
        </button>
        <button
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => buttonPress('/dashboard/')}
        >
          Admin DashBoard
        </button>
        <button
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => buttonPress('/link/')}
        >
          Invite Link
        </button>
    
        <button
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => buttonPress('/')}
        >
          Log Out
        </button>

      </div>
    </div>
  );
};

export default MainMenu;
