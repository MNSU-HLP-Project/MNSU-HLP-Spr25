import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFilter, FaEye } from "react-icons/fa";
import API from "../utils/axios";
import HLP_LookFors from "../assets/HLP_Lookfors";

const MyReflections = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    hlp: "",
    week: "",
    status: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedHLPs, setExpandedHLPs] = useState({});


  // Check role on component mount
  useEffect(() => {
    // Force role check
    const role = localStorage.getItem('role');
    if (role !== 'Student Teacher') {
      localStorage.setItem('role', 'Student Teacher');
    }
  }, []);

  // Fetch entries on component mount
  useEffect(() => {
    fetchEntries();
    groupEntriesByHLP();
  }, []);

  const groupEntriesByHLP = () => {
    const grouped = {};
  
    entries.forEach((entry) => {
      if (!grouped[entry.hlp]) {
        grouped[entry.hlp] = [];
      }
      grouped[entry.hlp].push(entry);
    });
  
    // Sort each group by date
    Object.keys(grouped).forEach((hlp) => {
      grouped[hlp].sort((a, b) => new Date(a.date) - new Date(b.date)); // newest first
    });
  
    return grouped;
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

      const queryString = params.toString() ? `?${params.toString()}` : "";

      try {

        const response = await API.get(`/entries/student/entries/${queryString}`);
        console.log(response.data)

        if (Array.isArray(response.data)) {
          setEntries(response.data);
        } else {
          setError("Received invalid data format from server");
          setEntries([]);
        }
      } catch (apiError) {
        // Check if token is valid
        if (apiError.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError("Failed to load your reflections. Please try again later.");
        }

        setEntries([]);
      }
    } catch (error) {
      setError("Failed to load your reflections. Please try again later.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHLP = (hlp) => {
    setExpandedHLPs((prev) => ({
      ...prev,
      [hlp]: !prev[hlp]
    }));
  };
  
  // Removed dummy entries function

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
      status: ""
    });
    fetchEntries();
    setShowFilters(false);
  };

  // View entry details
  const viewEntryDetails = (entryId) => {
    // Force role check before navigation
    localStorage.setItem('role', 'Student Teacher');

    // Find the entry data
    const entryData = entries.find(entry => entry.id === entryId);

    // Store the entry data in localStorage for the detail view to use
    if (entryData) {
      localStorage.setItem('currentEntryData', JSON.stringify(entryData));
    }

    navigate(`/reflection/${entryId}`);
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
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaArrowLeft
            className="text-2xl cursor-pointer mr-4"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-bold">My Reflections</h1>
        </div>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mr-2" />
          Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-3">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">HLP Number:</label>
              <input
                type="text"
                name="hlp"
                value={filters.hlp}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 1, 6, 18"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Week Number:</label>
              <input
                type="number"
                name="week"
                value={filters.week}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 1, 2, 3"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Status:</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="revision">Needs Revision</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md flex justify-center items-center">
          <p className="text-gray-600">Loading your reflections...</p>
        </div>
      ) : (
        <>
          {/* No entries message */}
          {entries.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">No reflections found</h2>
              <p className="text-gray-600 mb-4">
                You haven't submitted any HLP reflections yet, or none match your current filters.
              </p>
              <button
                onClick={() => navigate("/hlpcategories/")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create New Reflection
              </button>
            </div>
          ) : (
            /* Entries list */
            <div className="space-y-4">
              {Object.entries(groupEntriesByHLP()).map(([hlp, hlpEntries]) => {
  const hlpData = HLP_LookFors[hlp] || {};
  const isOpen = expandedHLPs[hlp] || false;

  return (
    <div key={hlp} className="bg-white rounded-lg shadow-md">
      {/* HLP Header with Toggle */}
      <div
        onClick={() => toggleHLP(hlp)}
        className="p-4 cursor-pointer flex justify-between items-center bg-gray-100 rounded-t-lg hover:bg-gray-200 transition"
      >
        <h2 className="text-lg font-semibold">
          HLP {hlp}: {hlpData.title || "Unknown HLP"}
        </h2>
        <button className="text-blue-600 font-medium">
          {isOpen ? "Hide Entries" : "Show Entries"}
        </button>
      </div>

      {/* Entries under this HLP */}
      {isOpen && (
        <div className="space-y-4 p-4 border-t">
          {hlpEntries.map((entry) => (
            <div key={entry.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{new Date(`${entry.date}T12:00:00`).toLocaleDateString()}</p>
                  <p className="text-md font-medium text-gray-800">Status: <span className={`px-2 py-1 rounded text-sm border ${getStatusBadgeColor(entry.status)}`}>{formatStatus(entry.status)}</span></p>
                </div>
                <button
                  onClick={() => viewEntryDetails(entry.id)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaEye className="mr-1" />
                  View Details
                </button>
              </div>

              {entry.teacher_comments?.length > 0 && (
                <div className="mt-3 bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-800">Teacher Feedback:</h4>
                  <p className="text-gray-700 mt-1">{entry.teacher_comments[0].comment}</p>
                  <p className="text-sm text-gray-500 mt-1">- {entry.teacher_comments[0].supervisor_name} on {new Date(entry.teacher_comments[0].date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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

export default MyReflections;
