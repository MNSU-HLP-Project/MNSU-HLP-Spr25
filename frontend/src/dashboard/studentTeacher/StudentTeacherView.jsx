// dashboard/StudentTeacherView.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentTeacherView = () => {
  const navigate = useNavigate();

  // Force role check
  React.useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Student Teacher') {
      localStorage.setItem('role', 'Student Teacher');
    }
  }, []);

  // Navigation handlers with role checks
  const navigateToHLPCategories = () => {
    // Force role check before navigation
    localStorage.setItem('role', 'Student Teacher');
    navigate("/hlpcategories/");
  };

  const navigateToReflections = () => {
    // Force role check before navigation
    localStorage.setItem('role', 'Student Teacher');
    navigate("/reflections/");
  };

  return (
    <>
      <button
        className="w-full p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={navigateToHLPCategories}
      >
        📚 New HLP Reflection
      </button>
      <button
        className="w-full p-4 md:p-5 border-2 border-purple-700 text-white bg-purple-700 rounded-lg hover:bg-purple-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={navigateToReflections}
      >
        📝 My Reflections
      </button>
      <button
        className="w-full p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => alert("Resource button clicked")}
      >
        📖 Resources
      </button>
    </>
  );
};

export default StudentTeacherView;