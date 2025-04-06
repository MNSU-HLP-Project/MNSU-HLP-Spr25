//supervisor/supervisorView.jsx
import React, { useState } from "react";
import InviteLinkGenerator from "../components/shared/InviteLinkGenerator";
import ClassGenerator from "../components/shared/ClassGenerator";
import { useNavigate } from "react-router-dom";

const SupervisorMainView = () => {
  const [showInviteSection, setShowInviteSection] = useState(false);
  const [showClassSection, setShowClassSection] = useState(false);
  const [refreshClasses, setRefreshClasses] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/classes")}
      >
        View Reflections
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

      <button
        className="w-3/4 p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowClassSection(!showClassSection)}
      >
        Create Class
      </button>

      {showClassSection && (
        <ClassGenerator
          onClassCreated={() => {
            setRefreshClasses((prev) => !prev); // refresh invite class list
            setShowInviteSection(true); // auto-show invite section
          }}
        />
      )}
    </>
  );
};

export default SupervisorMainView;
