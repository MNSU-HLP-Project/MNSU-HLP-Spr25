import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/axios";

import { FaArrowLeft, FaCalendarAlt, FaFilter, FaEye } from "react-icons/fa";
import Sidebar from "./Sidebar";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const EntriesDisplay = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    hlp: "",
    week: "",
    status: ""
  });

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await API.get(`entries/by-student/${studentId}/`);
        setEntries(response.data);
        setFilteredEntries(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [classId, studentId]);

  useEffect(() => {
    const filtered = entries.filter((entry) => {
      return (
        (filters.hlp === "" || entry.hlp.toLowerCase().includes(filters.hlp.toLowerCase())) &&
        (filters.week === "" || entry.week_number.toString() === filters.week) &&
        (filters.status === "" || entry.status === filters.status)
      );
    });
    setFilteredEntries(filtered);
  }, [filters, entries]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "revision":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl hover:opacity-80"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Student Reflections</h1>
              <p className="text-sm text-purple-100">Review submissions by student</p>
            </div>
          </div>
          <div>
            <button className="bg-white text-purple-700 px-4 py-2 rounded shadow hover:bg-purple-100 flex items-center space-x-2">
              <FaFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="hlp"
            value={filters.hlp}
            onChange={handleFilterChange}
            placeholder="Filter by HLP"
            className="p-2 rounded border w-full"
          />
          <input
            type="text"
            name="week"
            value={filters.week}
            onChange={handleFilterChange}
            placeholder="Filter by Week"
            className="p-2 rounded border w-full"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 rounded border w-full"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {/* Reflections List */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredEntries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow p-5 mb-6 border border-gray-200"
            >
              {/* HLP & Group Info */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-base font-bold text-purple-800">
                    HLP: {HLP_LookFors?.[entry.hlp]?.title || `HLP ${entry.hlp}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Group: {HLP_LookFors?.[entry.hlp]?.group || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle(
                    entry.status
                  )}`}
                >
                  {entry.status.replace(/^\w/, (c) => c.toUpperCase())}
                </span>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />
                  Week{entry.week_number}
                </span>
                <span className="text-gray-700">
                  🔍 Look-for:{" "}
                  {HLP_LookFors?.[entry.hlp]?.lookFors?.[entry.lookfor_number] ||
                    `Look-for #${entry.lookfor_number}`}
                </span>
              </div>

              {/* Weekly Goal */}
              <div className="bg-indigo-50 text-indigo-900 p-4 rounded mb-4">
                <p className="font-semibold mb-1">⚡ Weekly Goal:</p>
                <p>{entry.weekly_goal || "No goal provided."}</p>
              </div>

              {/* Review Button */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => navigate(`/review/entry/${entry.id}`)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded shadow flex items-center gap-2 text-sm"
                >
                  <FaEye />
                  Review Details
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default EntriesDisplay;
