import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const UserEntries = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user entries on component mount
  useEffect(() => {
    fetchUserEntries();
  }, []);

  // Function to fetch user entries
  const fetchUserEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/user-entries/", {
        token: token
      });
      setEntries(response.data.entries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("Failed to load entries. Please try again later.");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get score display text
  const getScoreText = (score) => {
    switch (score) {
      case "1":
        return "1 - Developing";
      case "2":
        return "2 - Proficient";
      case "NA":
        return "Not Applicable";
      default:
        return score;
    }
  };

  // Navigate back to main menu
  const handleBackClick = () => navigate("/mainmenu/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          My Entries
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* Role Indicator */}
      <RoleIndicator />

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Entries List */}
      {!loading && !error && (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">You haven't created any entries yet.</p>
              <button
                onClick={() => navigate("/hlpcategories/")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Create Your First Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/entry-comments/${entry.id}`, { state: { entry } })}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-blue-800">HLP {entry.hlp}</h2>
                  <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                </div>
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                    Look-for #{entry.lookfor_number}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Score: {getScoreText(entry.score)}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{entry.comments}</p>

                {/* Teacher Reply Section */}
                {entry.teacher_reply && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-green-700">Teacher Feedback</h3>
                    <p className="text-gray-600 italic">Teacher has provided feedback on this entry.</p>
                    <button
                      className="mt-2 px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        navigate(`/entry-comments/${entry.id}`, { state: { entry } });
                      }}
                    >
                      View Feedback
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserEntries;
