// dashboard/StudentTeacherView.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentTeacherView = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="w-full p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/hlpcategories/")}
      >
        📚 HLP Categories
      </button>
      <button
        className="w-full p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => alert("Resource button clicked")}
      >
        Resources
      </button>
    </>
  );
};

export default StudentTeacherView;