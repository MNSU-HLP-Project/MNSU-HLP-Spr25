// components/SuperuserView.jsx
import React, { useState } from "react";
import OrganizationGenerator from "../components/shared/OrganizationGenerator";

const SuperuserView = () => {
  const [showOrgSection, setShowOrgSection] = useState(false);

  return (
    <>
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