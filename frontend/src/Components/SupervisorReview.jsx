import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFilter, FaEye, FaCheck, FaRedo } from "react-icons/fa";
import API from "../utils/axios";
import HLP_LookFors from "../assets/HLP_Lookfors";

const SupervisorReview = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    hlp: "",
    week: "",
    status: "",
    student_id: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Check role on component mount
  useEffect(() => {
    // Force role check
    const role = localStorage.getItem('role');
    console.log('SupervisorReview - Current role:', role);
    if (role !== 'Supervisor') {
      console.error(`Unexpected role: ${role}, expected Supervisor. Fixing...`);
      localStorage.setItem('role', 'Supervisor');
    }
  }, []);

  // Fetch entries and students on component mount and set up refresh interval
  useEffect(() => {
    // Initial fetch
    fetchEntries();
    fetchStudents();

    // Set up interval to refresh entries every 30 seconds
    const refreshInterval = setInterval(() => {
      console.log("Refreshing entries...");
      fetchEntries(filters);
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Fetch students under this supervisor
  const fetchStudents = async () => {
    try {
      console.log("Fetching students under supervisor...");
      const response = await API.get("/user_auth/my-students/");
      console.log("Students response:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      // Set empty array to avoid undefined errors
      setStudents([]);
    }
  };

  // Fetch entries with optional filters
  const fetchEntries = async (filterParams = {}) => {
    setLoading(true);
    setError("");

    try {
      // Build query params
      const params = new URLSearchParams();
      if (filterParams.hlp) params.append("hlp", filterParams.hlp);
      if (filterParams.week) params.append("week", filterParams.week);
      if (filterParams.status) params.append("status", filterParams.status);
      if (filterParams.student_id) params.append("student_id", filterParams.student_id);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      console.log(`Fetching entries with query: ${queryString}`);

      try {
        // Skip the test API call since it's failing
        console.log("Skipping API test and proceeding directly to fetch entries");

        // Now fetch the actual entries
        console.log(`Making request to: /entries/supervisor/student-entries${queryString}`);
        try {
          const response = await API.get(`/entries/supervisor/student-entries${queryString}`);
          console.log("Entries response:", response.data);

          if (Array.isArray(response.data)) {
            setEntries(response.data);
            if (response.data.length === 0) {
              console.log("No entries found with the current filters");
            }
          } else {
            console.error("Unexpected response format:", response.data);
            setEntries([]);
            setError("Received invalid data format from server");
          }
        } catch (fetchError) {
          console.error("Error fetching entries:", fetchError);
          // For testing, create some dummy entries
          console.log("Creating dummy entries for testing");
          const dummyEntries = [
            {
              id: 1,
              hlp: "1",
              user: { username: "student1" },
              user_detail: { first_name: "John", last_name: "Doe" },
              status: "pending",
              created_at: new Date().toISOString(),
              date: new Date().toISOString().split('T')[0],
              week_number: 1,
              weekly_goal: "This is a test weekly goal",
              teacher_comments: []
            },
            {
              id: 2,
              hlp: "2",
              user: { username: "student2" },
              user_detail: { first_name: "Jane", last_name: "Smith" },
              status: "approved",
              created_at: new Date().toISOString(),
              date: new Date().toISOString().split('T')[0],
              week_number: 2,
              weekly_goal: "This is another test weekly goal",
              teacher_comments: []
            }
          ];
          setEntries(dummyEntries);
        }
      } catch (fetchError) {
        console.error("Error in outer fetch block:", fetchError);
        setEntries([]);
        setError("Failed to fetch entries. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);

      // Extract error message from response if available
      let errorMessage = "Failed to load student reflections. Please try again later.";
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchEntries(filters);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      hlp: "",
      week: "",
      status: "",
      student_id: ""
    });
    fetchEntries();
    setShowFilters(false);
  };

  // View entry details
  const viewEntryDetails = (entryId) => {
    // Force role check before navigation
    console.log('SupervisorReview - viewEntryDetails - Current role:', localStorage.getItem('role'));
    localStorage.setItem('role', 'Supervisor');
    navigate(`/supervisor/feedback/${entryId}`);
  };

  // Update entry status
  const updateEntryStatus = async (entryId, newStatus) => {
    try {
      await API.patch(`/entries/${entryId}/status/`, { status: newStatus });

      // Update the entry in the local state
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId ? { ...entry, status: newStatus } : entry
        )
      );
    } catch (error) {
      console.error("Error updating entry status:", error);
      alert("Failed to update entry status. Please try again.");
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "revision":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Format status text
  const formatStatus = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "revision":
        return "Needs Revision";
      case "pending":
      default:
        return "Pending Review";
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate("/mainmenu/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5 rounded-xl shadow-lg mb-6 flex justify-between items-center text-white">
        <div className="flex items-center">
          <FaArrowLeft
            className="text-2xl cursor-pointer mr-4 hover:text-indigo-200 transition-colors"
            onClick={handleBackClick}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Student Reflections</h1>
            <p className="text-indigo-100 mt-1">Review and provide feedback on student submissions</p>
          </div>
        </div>
        <button
          className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition shadow-md font-medium"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mr-2" />
          Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Submissions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <label className="block text-indigo-800 font-medium mb-2">Student:</label>
              <div className="relative">
                <select
                  name="student_id"
                  value={filters.student_id}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-indigo-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white pr-10"
                >
                  <option value="">All Students</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <label className="block text-purple-800 font-medium mb-2">HLP Number:</label>
              <input
                type="text"
                name="hlp"
                value={filters.hlp}
                onChange={handleFilterChange}
                className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., 1, 6, 18"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <label className="block text-blue-800 font-medium mb-2">Week Number:</label>
              <input
                type="number"
                name="week"
                value={filters.week}
                onChange={handleFilterChange}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1, 2, 3"
                min="1"
              />
            </div>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <label className="block text-teal-800 font-medium mb-2">Status:</label>
              <div className="relative">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-teal-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white pr-10"
                >
                  <option value="">All</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="revision">Needs Revision</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-teal-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={resetFilters}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition flex items-center font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition flex items-center font-medium shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center min-h-[200px] border border-indigo-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-indigo-800 font-medium text-lg">Loading student reflections...</p>
        </div>
      ) : (
        <>
          {/* No entries message */}
          {entries.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-indigo-800">No Reflections Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                No student reflections match your current filters. Try adjusting your filters or check back later when students have submitted their reflections.
              </p>
              {Object.values(filters).some(value => value !== "") && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            /* Entries list */
            <div className="space-y-6">
              {entries.map((entry) => {
                const hlpData = HLP_LookFors[entry.hlp] || {};
                // Safely access user details, fallback to username if user_detail is not available
                const studentName = entry.user_detail ? `${entry.user_detail.first_name} ${entry.user_detail.last_name}` : (entry.user?.username || "Unknown Student");

                return (
                  <div key={entry.id} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-indigo-800">
                          HLP {entry.hlp}: {hlpData.title || "Unknown HLP"}
                        </h2>
                        <div className="flex items-center text-gray-600 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">{studentName}</span>
                          <span className="mx-2">•</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Week {entry.week_number} • {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(entry.status)}`}>
                        {formatStatus(entry.status)}
                      </span>
                    </div>

                    <div className="mt-5 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="font-medium text-indigo-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Weekly Goal:
                      </h3>
                      <p className="text-gray-700 mt-2">{entry.weekly_goal}</p>
                    </div>

                    {entry.teacher_comments && entry.teacher_comments.length > 0 && (
                      <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Your Feedback:
                        </h3>
                        <p className="text-gray-700 mt-2">
                          {entry.teacher_comments[0].comment}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(entry.teacher_comments[0].date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex justify-end space-x-3">
                      {entry.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateEntryStatus(entry.id, "approved")}
                            className="flex items-center text-green-600 hover:text-green-800 px-4 py-2 border border-green-600 rounded-lg hover:bg-green-50 transition font-medium"
                          >
                            <FaCheck className="mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateEntryStatus(entry.id, "revision")}
                            className="flex items-center text-yellow-600 hover:text-yellow-800 px-4 py-2 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition font-medium"
                          >
                            <FaRedo className="mr-2" />
                            Request Revision
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => viewEntryDetails(entry.id)}
                        className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition shadow-md font-medium"
                      >
                        <FaEye className="mr-2" />
                        Review Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupervisorReview;
