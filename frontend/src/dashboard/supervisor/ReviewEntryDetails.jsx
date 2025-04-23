import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/axios";

import Sidebar from "./Sidebar";
import { FaArrowLeft, FaUser, FaCalendarAlt, FaBookmark, FaCheck, FaRedo } from "react-icons/fa";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import MenuDropdown from "../../Components/MenuDropdown";

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
    let commentAdded = false;

    try {
      // First, add the teacher comment if there is one (non-empty)
      if (comment && comment.trim().length > 0) {
        try {
          // Add teacher comment
          await API.post(`/entries/entries/${entryId}/comment/`, {
            comment: comment.trim(),
            score: parseInt(entry.score) || 1 // Use entry score or default to 1, ensure it's a number
          });
          console.log("Teacher comment added successfully");
          commentAdded = true;
        } catch (commentErr) {
          console.error("Error adding teacher comment:", commentErr);
          // Only show an alert if the comment was actually provided but failed to save
          if (comment.trim().length > 0) {
            console.log("Comment was provided but failed to save");
            // We'll continue with the status update anyway
          }
        }
      } else {
        console.log("No comment provided, skipping comment submission");
      }

      // Then update the status
      try {
        const response = await API.patch(`/entries/entry/${entryId}/`, {
          status: newStatus
        });

        // Refresh the entry data to include the new comment
        const updatedEntryResponse = await API.get(`/entries/entry/${entryId}/`);
        setEntry(updatedEntryResponse.data);

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (statusErr) {
        console.error("Failed to update entry status:", statusErr);
        alert("Failed to update entry status. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
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
      case "revised":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "revision":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const hlpInfo = entry?.hlp && HLP_LookFors[entry.hlp];
  const lookForText = hlpInfo?.lookFors?.[entry.lookfor_number];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl hover:opacity-80 transition"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl md-text-2xl font-bold">Review Entry Details</h1>
              <p className="text-sm text-purple-100">Full reflection breakdown</p>
            </div>
            
          {window.screen.width <= 600 && <MenuDropdown />}
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
                <h2 className="text-xl font-semibold text-blue-700">
                  HLP #{entry.hlp}: {hlpInfo?.title || `HLP ${entry.hlp}`}
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
                <FaCalendarAlt className="text-blue-600" />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBookmark className="text-blue-600" />
                <span>
                  Look-for #{entry.lookfor_number}: {lookForText || `#${entry.lookfor_number}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-600" />
                <span>
                  Student: {entry.user_detail?.first_name} {entry.user_detail?.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">Score:</span>
                <span>{entry.score}</span>
              </div>
            </div>

            {/* Student Prompt Responses */}
            <div className="mb-6">
              <h3 className="font-semibold text-indigo-800 mb-3 text-base flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Student Reflections
              </h3>

              {entry.prompt_responses && entry.prompt_responses.length > 0 ? (
                <div className="space-y-4">
                  {entry.prompt_responses.map((response, index) => (
                    <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-800 mb-2">{response.prompt}</h4>
                      <p className="text-gray-700">{response.reflection || "No response provided."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reflections provided.</p>
              )}
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
                ✅ Action completed successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-4 space-x-3">
              {/* Needs Revision Button */}
              <button
                onClick={() => handleAction("revision")}
                disabled={updating || entry.status === "approved" || entry.status === "revision"}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow-md font-medium transition ${
                  entry.status === "revision" || entry.status === "approved"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                }`}
              >
                <FaRedo className="h-4 w-4" />
                {entry.status === "revision" ? "Revision Requested" : "Request Revision"}
              </button>

              {/* Approve Button */}
              <button
                onClick={() => handleAction("approved")}
                disabled={updating || entry.status === "approved"}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow-md font-medium transition ${
                  entry.status === "approved"
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                }`}
              >
                <FaCheck className="h-4 w-4" />
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
