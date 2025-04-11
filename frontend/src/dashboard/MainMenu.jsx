import React from "react";
import { useNavigate } from "react-router-dom";
import StudentTeacherView from "./studentTeacher/StudentTeacherView";
import AdminView from "./admin/AdminView";
import SuperuserView from "./superuser/SuperuserView";
import SupervisorMainView from "./supervisor/SupervisorMainView";

const MainMenu = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Map roles to their respective components
  const roleComponents = {
    "Student Teacher": <StudentTeacherView />,
    "Admin": <AdminView />,
    "Superuser": <SuperuserView />,
    "Supervisor": <SupervisorMainView />
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6 pb-16 items-center relative">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mt-12 md:mt-20 tracking-wide drop-shadow-lg">
        TeachTrack
      </h1>

      <div className="flex flex-col items-center mt-8 md:mt-16 space-y-6 w-full max-w-xs md:max-w-md">
        {/* Render component based on role */}
        {roleComponents[role] || <p>Unknown role: {role}</p>}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 flex items-center justify-center transition duration-300 font-semibold text-lg md:text-xl z-50"
          onClick={() => {
            // Clear localStorage before logging out
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('role');
            navigate("/");
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default MainMenu;