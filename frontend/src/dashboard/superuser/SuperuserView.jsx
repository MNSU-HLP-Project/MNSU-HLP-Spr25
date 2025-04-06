// components/SuperuserView.jsx
import React, { useState } from "react";
import OrganizationGenerator from "../components/shared/OrganizationGenerator";
import GradeEdit from "./GradeEdit";

const SuperuserView = () => {
  const [showOrgSection, setShowOrgSection] = useState(false);
  const [showGradeSection, setShowGradeSection] = useState(false)

  return (
    <>
      <button
        className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowGradeSection(!showGradeSection)}
      >
        Edit Grades
      </button>
      {showGradeSection && <GradeEdit onClose={() => setShowGradeSection(false)} />}

      <button
        className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowOrgSection(!showOrgSection)}
      >
        Create Organization
      </button>

      {showOrgSection && <OrganizationGenerator />}
    </>
  );
};

export default SuperuserView;