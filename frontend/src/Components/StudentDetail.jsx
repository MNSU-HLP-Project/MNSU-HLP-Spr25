import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaUserGraduate, FaChartBar, FaFileAlt, FaComment, FaEnvelope } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const location = useLocation();
  const { student } = location.state || {};
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
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch student entries on component mount
  useEffect(() => {
    if (studentId) {
      fetchStudentEntries();
    }
  }, [studentId]);

  // Calculate statistics when entries change
  useEffect(() => {
    calculateStats();
  }, [entries]);

  // Function to fetch student entries
  const fetchStudentEntries = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data
      const mockEntries = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        hlp: Math.floor(Math.random() * 10) + 1,
        lookfor_number: Math.floor(Math.random() * 5) + 1,
        score: ["1", "2", "NA"][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
        comments: `This is a sample entry ${i + 1} for student ${studentId}`,
        teacher_reply: Math.random() > 0.5
      }));
      
      setEntries(mockEntries);
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

  // Navigate back to class dashboard
  const handleBackClick = () => navigate("/class-dashboard/");

  // Navigate to entry detail
  const handleEntryClick = (entry) => {
    navigate(`/teacher-comment/${entry.id}`, { state: { entry, student } });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
      10: "Specially Designed Instruction"
    };
    
    return hlpTitles[hlp] || `HLP ${hlp}`;
  };

  // Send email to student (mock function)
  const handleSendEmail = () => {
    alert(`Email would be sent to ${student.email}`);
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
          Student Details
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>
      
      {/* Role Indicator */}
      <RoleIndicator />

      {/* Student Profile */}
      {student && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserGraduate className="text-blue-600 text-4xl" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{student.first_name} {student.last_name}</h2>
              <p className="text-gray-600 mb-2">{student.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-medium">
                  Student Teacher
                </div>
                <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-700 text-sm font-medium">
                  {student.entriesCount} Entries
                </div>
                <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-medium">
                  Avg. Score: {student.averageScore}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleSendEmail}
              >
                <FaEnvelope />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Tabs */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                selectedTab === "overview" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setSelectedTab("overview")}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                selectedTab === "entries" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setSelectedTab("entries")}
            >
              Entries
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                selectedTab === "feedback" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setSelectedTab("feedback")}
            >
              Feedback
            </button>
          </div>
          
          {/* Overview Tab Content */}
          {selectedTab === "overview" && (
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                  <FaFileAlt className="text-3xl text-blue-500 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Total Entries</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalEntries}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                  <FaChartBar className="text-3xl text-green-500 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Average Score</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.averageScore}</p>
                  <p className="text-sm text-gray-500">(Excluding N/A)</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center">
                  <FaComment className="text-3xl text-purple-500 mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Feedback Rate</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats.totalEntries > 0 
                      ? Math.round((stats.entriesWithFeedback / stats.totalEntries) * 100) 
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-500">{stats.entriesWithFeedback} of {stats.totalEntries} entries</p>
                </div>
              </div>
              
              {/* Score Distribution */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Score Distribution</h3>
                <div className="space-y-3">
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
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">HLP Focus Areas</h3>
                {Object.keys(stats.hlpCounts).length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No HLP data available</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
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
            </div>
          )}
          
          {/* Entries Tab Content */}
          {selectedTab === "entries" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All Entries</h3>
              
              {entries.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No entries available</p>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">HLP {entry.hlp}: {getHLPTitle(entry.hlp)}</h4>
                          <p className="text-sm text-gray-600 mt-1">Look-for #{entry.lookfor_number}</p>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{entry.comments}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                          <span className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
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
                </div>
              )}
            </div>
          )}
          
          {/* Feedback Tab Content */}
          {selectedTab === "feedback" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Entries Needing Feedback</h3>
              
              {entries.filter(entry => !entry.teacher_reply).length === 0 ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <p className="text-green-700">All entries have received feedback!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries
                    .filter(entry => !entry.teacher_reply)
                    .map((entry) => (
                      <div 
                        key={entry.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEntryClick(entry)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">HLP {entry.hlp}: {getHLPTitle(entry.hlp)}</h4>
                            <p className="text-sm text-gray-600 mt-1">Look-for #{entry.lookfor_number}</p>
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{entry.comments}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                            <span className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                              entry.score === "1" ? "bg-yellow-100 text-yellow-800" :
                              entry.score === "2" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {entry.score === "NA" ? "N/A" : `Score: ${entry.score}`}
                            </span>
                            <button
                              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEntryClick(entry);
                              }}
                            >
                              Add Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
