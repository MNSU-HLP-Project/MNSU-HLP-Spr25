import React from "react";
import { useNavigate } from "react-router-dom";
import StudentTeacherView from "./studentTeacher/StudentTeacherView";
import AdminView from "./admin/AdminView";
import SuperuserView from "./superuser/SuperuserView";
import SupervisorMainView from "./supervisor/SupervisorMainView";

const MainMenu = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const roleComponents = {
    "Student Teacher": <StudentTeacherView />,
    Admin: <AdminView />,
    Superuser: <SuperuserView />,
    Supervisor: <SupervisorMainView />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6 pb-16 items-center relative font-sans">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mt-12 md:mt-20 tracking-tight">
        TeachTrack
      </h1>

      {/* Role Component */}
      <div className="flex flex-col items-center mt-8 md:mt-16 space-y-6 w-full max-w-xs md:max-w-md">
        {roleComponents[role] || (
          <div className="text-center bg-red-100 text-red-600 rounded-lg p-4 text-sm font-medium shadow">
            Unknown role: <span className="italic">{role}</span>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("role");
            navigate("/");
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-32 md:w-36 px-5 py-3 md:py-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 font-semibold text-base md:text-lg transition-all z-50"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
