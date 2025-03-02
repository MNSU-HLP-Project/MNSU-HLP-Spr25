import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import decodeToken from "../utils/jwtHelper";

const MainMenu = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const user = token ? decodeToken(token) : null;

  const [showInviteSection, setShowInviteSection] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  // Function to generate invite link
  const generateInvite = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-invite/",
        {
          userid: decodeToken(token).id,
          role: decodeToken(token).role,
        }
      );

      const role = decodeToken(token).role === "Admin" ? "sup" : "stu";
      setInviteLink(
        `${window.location.origin}/register?role=${role}&code=${response.data.code}`
      );
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  // Determine invite message based on user role
  const inviteMessage =
    user?.role === "Admin"
      ? "Send this to a supervisor:"
      : "Share this link with students:";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6 items-center relative">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mt-12 md:mt-20 tracking-wide drop-shadow-lg">
        TeachTrack
      </h1>

      <div className="flex flex-col items-center mt-12 md:mt-16 space-y-6 w-full max-w-xs md:max-w-md">
        {user?.role === "Student Teacher" && (
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
        )}

        {["Supervisor", "Admin"].includes(user?.role) && (
          <>
            <button
              className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => alert("View Reflection button clicked")}
            >
              View Reflections
            </button>

            {/* Invite Link Section */}
            <button
              className="w-3/4 p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => setShowInviteSection(!showInviteSection)}
            >
              🔗 Invite Link
            </button>

            {showInviteSection && (
              <div className="mt-1 w-3/4 p-4 bg-gray-100 rounded-lg shadow-lg">
                <button
                  className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={generateInvite}
                >
                  Generate Invite Link
                </button>

                {inviteLink && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-700 text-sm font-semibold">
                      {inviteMessage}
                    </p>
                    <div className="flex justify-center items-center mt-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="border rounded-l-lg px-2 py-1 w-3/4 text-gray-800"
                      />
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-r-lg hover:bg-green-600"
                        onClick={() => {
                          navigator.clipboard.writeText(inviteLink);
                          alert("Copied to clipboard");
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 flex items-center justify-center transition duration-300 font-semibold text-lg md:text-xl"
        onClick={() => navigate("/")}
      >
        Log Out
      </button>
    </div>
  );
};

export default MainMenu;
