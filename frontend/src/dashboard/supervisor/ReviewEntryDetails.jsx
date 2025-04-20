import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/axios";

import Sidebar from "./Sidebar";
import { FaArrowLeft, FaUser, FaCalendarAlt, FaBookmark } from "react-icons/fa";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const ReviewEntryDetails = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await API.get(`/entries/entry/${entryId}/`);
        setEntry(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load entry.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [entryId]);

  const handleAction = async (newStatus) => {
    if (!entry) return;
    setUpdating(true);
    try {
      const response = await API.patch(`/entries/entry/${entryId}/`, {
        status: newStatus,
        teacher_reply: comment || "",
      });
      setEntry(response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update entry.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const hlpInfo = entry?.hlp && HLP_LookFors[entry.hlp];
  const lookForText = hlpInfo?.lookFors?.[entry.lookfor_number];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl hover:opacity-80 transition"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Review Entry Details</h1>
              <p className="text-sm text-purple-100">Full reflection breakdown</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200 space-y-6 transition-all">
            {/* Top Info */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-purple-800">
                  {hlpInfo?.title || `HLP ${entry.hlp}`}
                </h2>
                <p className="text-sm text-gray-500">Group: {hlpInfo?.group || "N/A"}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle(entry.status)}`}
              >
                {entry.status?.charAt(0).toUpperCase() + entry.status?.slice(1)}
              </span>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-purple-600" />
                <span>Week {entry.week_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBookmark className="text-purple-600" />
                <span>
                  Look-for: {lookForText || `#${entry.lookfor_number}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-purple-600" />
                <span>
                  Student: {entry.user_detail?.first_name} {entry.user_detail?.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-bold">Score:</span>
                <span>{entry.score}</span>
              </div>
            </div>

            {/* Reflection */}
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2 text-base">📝 Reflection</h3>
              <div className="bg-indigo-50 text-indigo-900 p-4 rounded-lg leading-relaxed">
                {entry.goal_reflection || "No reflection provided."}
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor Comment
              </label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 transition resize-none"
                placeholder="Add your comments for the student..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Success Message */}
            {success && (
              <div className="text-green-600 font-medium">
                ✅ Reflection approved successfully!
              </div>
            )}

            {/* Approve Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleAction("approved")}
                disabled={updating || entry.status === "approved"}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow-md font-medium transition ${
                  entry.status === "approved"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {entry.status === "approved" ? "Already Approved" : "Approve Reflection"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewEntryDetails;
