import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserGraduate, FaChalkboardTeacher, FaSearch, FaFilter, FaChartBar } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const ClassDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    progress: "",
    lastActive: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [classStats, setClassStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalEntries: 0,
    averageScore: 0,
    entriesNeedingFeedback: 0
  });

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch students when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass.id);
      calculateClassStats(selectedClass.id);
    }
  }, [selectedClass]);

  // Function to fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be a teacher-specific endpoint
      const response = await axios.post("http://localhost:8000/api/get-classes/", {
        token: token
      });

      if (response.data && response.data.classes) {
        setClasses(response.data.classes);

        // Select the first class by default if available
        if (response.data.classes.length > 0) {
          setSelectedClass(response.data.classes[0]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes. Please try again later.");
      setLoading(false);
    }
  };

  // Function to fetch students for a class
  const fetchStudents = async (classId) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/get-class-students/${classId}/`, {
        token: token
      });

      if (response.data && response.data.students) {
        // Add some mock data for demonstration
        const studentsWithStats = response.data.students.map(student => ({
          ...student,
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString().split('T')[0],
          entriesCount: Math.floor(Math.random() * 20) + 1,
          averageScore: (Math.random() * 2).toFixed(1),
          pendingFeedback: Math.floor(Math.random() * 5)
        }));

        setStudents(studentsWithStats);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students. Please try again later.");
      setLoading(false);
    }
  };

  // Calculate class statistics
  const calculateClassStats = (classId) => {
    // In a real implementation, this would fetch data from the backend
    // For now, we'll use mock data
    setClassStats({
      totalStudents: Math.floor(Math.random() * 20) + 5,
      activeStudents: Math.floor(Math.random() * 15) + 3,
      totalEntries: Math.floor(Math.random() * 100) + 20,
      averageScore: (Math.random() * 2).toFixed(1),
      entriesNeedingFeedback: Math.floor(Math.random() * 15)
    });
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
      progress: "",
      lastActive: ""
    });
    setSearchTerm("");
  };

  // Filter students based on search term and filter options
  const filteredStudents = students.filter(student => {
    // Search term filter
    const searchMatch =
      searchTerm === "" ||
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Progress filter
    const progressMatch =
      filterOptions.progress === "" ||
      (filterOptions.progress === "high" && student.averageScore > 1.5) ||
      (filterOptions.progress === "medium" && student.averageScore >= 1.0 && student.averageScore <= 1.5) ||
      (filterOptions.progress === "low" && student.averageScore < 1.0);

    // Last active filter
    const lastActiveMatch =
      filterOptions.lastActive === "" ||
      (filterOptions.lastActive === "week" && new Date(student.lastActive) >= new Date(Date.now() - 7 * 86400000)) ||
      (filterOptions.lastActive === "month" && new Date(student.lastActive) >= new Date(Date.now() - 30 * 86400000)) ||
      (filterOptions.lastActive === "older" && new Date(student.lastActive) < new Date(Date.now() - 30 * 86400000));

    return searchMatch && progressMatch && lastActiveMatch;
  });

  // Navigate back to main menu
  const handleBackClick = () => navigate("/mainmenu/");

  // Navigate to student detail page
  const handleStudentClick = (student) => {
    navigate(`/student-detail/${student.id}`, { state: { student } });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get days since last active
  const getDaysSinceLastActive = (dateString) => {
    const lastActive = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          Class Dashboard
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

      {/* Class Selection */}
      {!loading && !error && classes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Class:</label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedClass ? selectedClass.id : ""}
              onChange={(e) => {
                const classId = e.target.value;
                const selectedClass = classes.find(c => c.id.toString() === classId);
                setSelectedClass(selectedClass);
              }}
            >
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* No Classes Message */}
      {!loading && !error && classes.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">You don't have any classes yet. Please create a class first.</span>
        </div>
      )}

      {/* Class Statistics */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedClass.name} - Class Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{classStats.totalStudents}</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-green-600">{classStats.activeStudents}</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-purple-600">{classStats.totalEntries}</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-yellow-600">{classStats.averageScore}</p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Needs Feedback</p>
              <p className="text-2xl font-bold text-red-600">{classStats.entriesNeedingFeedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by student name or email..."
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Progress Level</label>
                <select
                  name="progress"
                  value={filterOptions.progress}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Progress Levels</option>
                  <option value="high">High (Score &gt; 1.5)</option>
                  <option value="medium">Medium (Score 1.0 - 1.5)</option>
                  <option value="low">Low (Score &lt; 1.0)</option>
                </select>
              </div>

              {/* Last Active Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Last Active</label>
                <select
                  name="lastActive"
                  value={filterOptions.lastActive}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Time</option>
                  <option value="week">Within Last Week</option>
                  <option value="month">Within Last Month</option>
                  <option value="older">Older Than a Month</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="md:col-span-2 flex justify-end">
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
      )}

      {/* Students List */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Students</h2>
            <span className="text-gray-600">{filteredStudents.length} students found</span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No students match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Needs Feedback
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUserGraduate className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(student.lastActive)}</div>
                        <div className="text-sm text-gray-500">{getDaysSinceLastActive(student.lastActive)} days ago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.entriesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium px-2 py-1 rounded-full text-center w-16 ${
                          student.averageScore > 1.5 ? 'bg-green-100 text-green-800' :
                          student.averageScore >= 1.0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.averageScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.pendingFeedback > 0 ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {student.pendingFeedback}
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            0
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentClick(student);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassDashboard;
