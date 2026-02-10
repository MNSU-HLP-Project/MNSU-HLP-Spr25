//supervisor/supervisorView.jsx
import React, { useState } from "react";
import InviteLinkGenerator from "../components/shared/InviteLinkGenerator";
import ClassGenerator from "../components/shared/ClassGenerator";
import { useNavigate } from "react-router-dom";
import SupervisorClassView from "./SupervisorClassView";

const SupervisorMainView = () => {
  const [showInviteSection, setShowInviteSection] = useState(false);
  const [refreshClasses, setRefreshClasses] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/classes/")}
      >
        📝 View Reflections
      </button>

      {/* Invite Link Section */}
      <button
        className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowInviteSection(!showInviteSection)}
      >
        🔗 Invite To Class
      </button>

      {showInviteSection && (
        <InviteLinkGenerator
          userRole="Supervisor"
          refreshSignal={refreshClasses} // passed down to trigger useEffect
        />
      )}
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-purple-700 text-white bg-purple-700 rounded-lg hover:bg-purple-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/edit-classes/")}
      >
        Class Admin
      </button>

      <button
        className="w-3/4 p-4 md:p-5 border-2 border-orange-600 text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => window.open("/resources/", "_blank", "noopener,noreferrer")}
      >
        📖 Resources
      </button>
    </>
  );
};

export default SupervisorMainView;
