//supervisor/supervisorView.jsx
import React, { useState } from "react";
import InviteLinkGenerator from "../components/shared/InviteLinkGenerator";
import ClassGenerator from "../components/shared/ClassGenerator";
import { useNavigate } from "react-router-dom";
import SupervisorClassView from "./SupervisorClassView";

const SupervisorMainView = () => {
  const [showInviteSection, setShowInviteSection] = useState(false);
  const [showClassSection, setShowClassSection] = useState(false);
  const [refreshClasses, setRefreshClasses] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-purple-700 text-white bg-purple-700 rounded-lg hover:bg-purple-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/classes/")}
      >
        📝 Classes
      </button>

      {/* Invite Link Section */}
      <button
        className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowInviteSection(!showInviteSection)}
      >
        🔗 Invite Link
      </button>

      {showInviteSection && (
        <InviteLinkGenerator
          userRole="Supervisor"
          refreshSignal={refreshClasses} // passed down to trigger useEffect
        />
      )}
    </>
  );
};

export default SupervisorMainView;
