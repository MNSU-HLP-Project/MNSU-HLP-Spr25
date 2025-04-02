import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChartBar, FaFileAlt } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const StudentProgress = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEntries: 0,
    entriesWithFeedback: 0,
    averageScore: 0,
    hlpCounts: {},
    scoreDistribution: { "1": 0, "2": 0, "NA": 0 }
  });

  // Fetch user entries on component mount
  useEffect(() => {
    fetchUserEntries();
  }, []);

  // Calculate statistics when entries change
  useEffect(() => {
    calculateStats();
  }, [entries]);

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

  // Calculate statistics from entries
  const calculateStats = () => {
    if (entries.length === 0) return;

    // Count entries with feedback
    const entriesWithFeedback = entries.filter(entry => entry.teacher_reply).length;

    // Calculate average score (excluding NA)
    const numericScores = entries.filter(entry => entry.score !== "NA").map(entry => parseInt(entry.score));
    const averageScore = numericScores.length > 0
      ? (numericScores.reduce((sum, score) => sum + score, 0) / numericScores.length).toFixed(1)
      : 0;

    // Count entries by HLP
    const hlpCounts = {};
    entries.forEach(entry => {
      hlpCounts[entry.hlp] = (hlpCounts[entry.hlp] || 0) + 1;
    });

    // Count entries by score
    const scoreDistribution = { "1": 0, "2": 0, "NA": 0 };
    entries.forEach(entry => {
      scoreDistribution[entry.score] = (scoreDistribution[entry.score] || 0) + 1;
    });

    setStats({
      totalEntries: entries.length,
      entriesWithFeedback,
      averageScore,
      hlpCounts,
      scoreDistribution
    });
  };

  // Navigate back to main menu
  const handleBackClick = () => navigate("/mainmenu/");

  // Get color based on score
  const getScoreColor = (score) => {
    switch (score) {
      case "1":
        return "bg-yellow-500";
      case "2":
        return "bg-green-500";
      case "NA":
        return "bg-gray-400";
      default:
        return "bg-blue-500";
    }
  };

  // Get HLP title (simplified version)
  const getHLPTitle = (hlp) => {
    const hlpTitles = {
      1: "Collaboration with Families",
      2: "Assess, Analyze, and Use Data",
      3: "Explicit Instruction",
      4: "Flexible Grouping",
      5: "Cognitive and Metacognitive Strategies",
      6: "Scaffolded Supports",
      7: "Intensive Intervention",
      8: "Establish an Inclusive Environment",
      9: "Feedback",
      10: "Specially Designed Instruction",
      11: "Assistive Technology",
      12: "Content Learning",
      13: "Functional Behavioral Assessment",
      14: "Positive Behavioral Interventions",
      15: "Communication with Stakeholders",
      16: "Use Student Assessment Data",
      17: "Intensive Intervention",
      18: "Accommodations and Modifications",
      19: "Assistive Technology",
      20: "Transition Planning",
      21: "Maintain Respectful Environment",
      22: "Support Social, Emotional, and Behavioral Development"
    };

    return hlpTitles[hlp] || `HLP ${hlp}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          My Progress
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

      {/* Progress Dashboard */}
      {!loading && !error && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <FaFileAlt className="text-3xl text-blue-500 mb-2" />
              <h2 className="text-xl font-semibold text-gray-800">Total Entries</h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalEntries}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <FaChartBar className="text-3xl text-green-500 mb-2" />
              <h2 className="text-xl font-semibold text-gray-800">Average Score</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.averageScore}</p>
              <p className="text-sm text-gray-500">(Excluding N/A)</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-1000"
                  style={{
                    clipPath: stats.totalEntries > 0
                      ? `polygon(0 0, 100% 0, 100% ${(stats.entriesWithFeedback / stats.totalEntries) * 100}%, 0 ${(stats.entriesWithFeedback / stats.totalEntries) * 100}%)`
                      : 'polygon(0 0, 100% 0, 100% 0%, 0 0%)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">
                    {stats.totalEntries > 0
                      ? Math.round((stats.entriesWithFeedback / stats.totalEntries) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Feedback Rate</h2>
              <p className="text-sm text-gray-500 mt-1">{stats.entriesWithFeedback} of {stats.totalEntries} entries</p>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Score Distribution</h2>
            <div className="space-y-4">
              {Object.entries(stats.scoreDistribution).map(([score, count]) => (
                <div key={score} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {score === "NA" ? "Not Applicable" : score === "1" ? "1 - Developing" : "2 - Proficient"}
                    </span>
                    <span className="text-sm text-gray-600">{count} entries</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(score)}`}
                      style={{ width: `${stats.totalEntries > 0 ? (count / stats.totalEntries) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HLP Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">HLP Focus Areas</h2>
            {Object.keys(stats.hlpCounts).length === 0 ? (
              <p className="text-gray-600 text-center py-4">No HLP data available</p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {Object.entries(stats.hlpCounts)
                  .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
                  .map(([hlp, count]) => (
                    <div key={hlp} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                          HLP {hlp}: {getHLPTitle(parseInt(hlp))}
                        </span>
                        <span className="text-sm text-gray-600">{count} entries</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full bg-blue-600"
                          style={{ width: `${(count / Math.max(...Object.values(stats.hlpCounts))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {entries.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {entries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/entry-comments/${entry.id}`, { state: { entry } })}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">HLP {entry.hlp}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{entry.comments}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.score === "1" ? "bg-yellow-100 text-yellow-800" :
                          entry.score === "2" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {entry.score === "NA" ? "N/A" : `Score: ${entry.score}`}
                        </span>
                        {entry.teacher_reply && (
                          <span className="text-xs text-blue-600 mt-1">Has feedback</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {entries.length > 5 && (
                  <div className="text-center">
                    <button
                      onClick={() => navigate("/my-entries/")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all entries
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
