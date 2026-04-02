import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/axios";

import { FaArrowLeft, FaUser, FaCalendarAlt, FaEye, FaFilter } from "react-icons/fa";
import Sidebar from "./Sidebar";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import MenuDropdown from "../studentTeacher/MenuDropdown";
import ClassCharts from "./ClassCharts";

const SupervisorClassEntries = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [className, setClassName] = useState("");

  const [filters, setFilters] = useState({
    hlp: "",
    week: "",
    status: "pending"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entriesRes = await API.get(`/entries/entries/by-class/${classId}/`);
        const classRes = await API.get(`user_auth/user_auth/get-class/${classId}/`);
        setEntries(entriesRes.data);
        setFilteredEntries(entriesRes.data);
        setClassName(classRes.data.name);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

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
      case "revised":
        return "bg-purple-100 text-purple-800";
      case "revision":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded shadow">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl hover:opacity-80"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-bold">Student Reflections</h1>
              <p className="text-sm text-white-100">Viewing all class entries for: <span className="font-semibold">{className}</span></p>
            </div>

          </div>
          {window.screen.width <= 600 && <MenuDropdown />}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by HLP"
            name="hlp"
            value={filters.hlp}
            onChange={handleFilterChange}
            className="p-2 rounded border w-full"
          />
          <input
            type="text"
            placeholder="Filter by Week"
            name="week"
            value={filters.week}
            onChange={handleFilterChange}
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
            <option value="revised">Revised Submissions</option>
            <option value="approved">Approved</option>
            <option value="revision">Needs Revision</option>
          </select>
        </div>

        {/* Reflections */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredEntries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          filteredEntries.map((entry) => {
            const hlpInfo = HLP_LookFors?.[entry.hlp];
            const lookForText = hlpInfo?.lookFors?.[entry.lookfor_number];
            return (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow p-5 mb-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className={`text-base font-bold`}>
                    HLP {entry.hlp}: {hlpInfo?.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Group: {hlpInfo?.group || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle(entry.status)}`}
                  >
                    {entry.status.replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <FaUser />
                    {entry.user_detail.first_name} {entry.user_detail.last_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                      {entry.date}
                  </span>
                </div>

                {lookForText && (
                  <div className="text-sm text-gray-700 mb-3">
                    🔍 <span className="font-medium">Look-for:</span> #{entry.lookfor_number}: {lookForText}
                  </div>
                )}


                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/review/entry/${entry.id}`)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaEye /> Review Details
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Charts */}
        {!loading && !error && <ClassCharts entries={entries} />}
      </main>
    </div>
  );
};

export default SupervisorClassEntries;
