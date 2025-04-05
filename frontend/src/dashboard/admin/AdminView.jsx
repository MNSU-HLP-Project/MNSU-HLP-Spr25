// dashboard/AdminView.jsx
import React, { useState } from "react";
import InviteLinkGenerator from "../components/shared/InviteLinkGenerator";

const AdminView = () => {
  const [showInviteSection, setShowInviteSection] = useState(false);

  return (
    <>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => alert("View Reflection button clicked")}
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

      {showInviteSection && <InviteLinkGenerator />}
    </>
  );
};

export default AdminView;