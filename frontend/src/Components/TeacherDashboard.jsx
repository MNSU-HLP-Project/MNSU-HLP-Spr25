import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaFilter } from "react-icons/fa";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    hlp: "",
    date: "",
    hasReply: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all entries on component mount
  useEffect(() => {
    fetchAllEntries();
  }, []);

  // Function to fetch all entries
  const fetchAllEntries = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be a teacher-specific endpoint
      const response = await axios.get("http://localhost:8000/api/entries/");
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      hlp: "",
      date: "",
      hasReply: ""
    });
    setSearchTerm("");
  };

  // Filter entries based on search term and filter options
  const filteredEntries = entries.filter(entry => {
    // Search term filter
    const searchMatch = 
      searchTerm === "" || 
      entry.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.user_details && 
        (entry.user_details.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         entry.user_details.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         entry.user_details.last_name.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // HLP filter
    const hlpMatch = 
      filterOptions.hlp === "" || 
      entry.hlp.toString() === filterOptions.hlp;
    
    // Date filter
    const dateMatch = 
      filterOptions.date === "" || 
      entry.date === filterOptions.date;
    
    // Has reply filter
    const replyMatch = 
      filterOptions.hasReply === "" || 
      (filterOptions.hasReply === "yes" && entry.teacher_reply) ||
      (filterOptions.hasReply === "no" && !entry.teacher_reply);
    
    return searchMatch && hlpMatch && dateMatch && replyMatch;
  });

  // Navigate back to main menu
  const handleBackClick = () => navigate("/mainmenu/");

  // Navigate to entry detail/comment page
  const handleEntryClick = (entry) => {
    navigate(`/teacher-comment/${entry.id}`, { state: { entry } });
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
          Teacher Dashboard
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by student name or content..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HLP Filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">HLP Number</label>
              <select
                name="hlp"
                value={filterOptions.hlp}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All HLPs</option>
                {[...new Set(entries.map(entry => entry.hlp))].sort().map(hlp => (
                  <option key={hlp} value={hlp}>{hlp}</option>
                ))}
              </select>
            </div>
            
            {/* Date Filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={filterOptions.date}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Has Reply Filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Has Teacher Reply</label>
              <select
                name="hasReply"
                value={filterOptions.hasReply}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Entries</option>
                <option value="yes">With Reply</option>
                <option value="no">Without Reply</option>
              </select>
            </div>
            
            {/* Reset Button */}
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

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
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-gray-800">Student Entries</h2>
            <span className="text-gray-600">{filteredEntries.length} entries found</span>
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No entries match your search criteria.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEntryClick(entry)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">HLP {entry.hlp}</h2>
                    {entry.user_details && (
                      <p className="text-gray-600">
                        By: {entry.user_details.first_name} {entry.user_details.last_name}
                      </p>
                    )}
                  </div>
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
                <p className="text-gray-700 mt-2 line-clamp-2">{entry.comments}</p>
                
                {/* Teacher Reply Status */}
                <div className="mt-3 flex justify-end">
                  {entry.teacher_reply ? (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Feedback Provided
                    </span>
                  ) : (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      Needs Feedback
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
