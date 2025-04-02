import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RoleIndicator from "./RoleIndicator";

const EntryComments = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const location = useLocation();
  const { entry } = location.state || {};
  const token = localStorage.getItem("jwtToken");

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments on component mount
  useEffect(() => {
    if (entryId) {
      fetchComments();
    }
  }, [entryId]);

  // Function to fetch comments for the entry
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/entry-comments/${entryId}/`, {
        token: token
      });
      setComments(response.data.comments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigate back to entries list
  const handleBackClick = () => navigate("/my-entries/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          Teacher Feedback
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* Role Indicator */}
      <RoleIndicator />

      {/* Entry Information */}
      {entry && (
        <div className="bg-blue-100 p-4 rounded-lg mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">HLP {entry.hlp}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
              Look-for #{entry.lookfor_number}
            </span>
            <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
          </div>
          <p className="text-gray-700 mt-2">{entry.comments}</p>
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

      {/* Comments List */}
      {!loading && !error && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teacher Comments</h2>

          {comments.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-700">No teacher comments yet.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-green-700">
                    {comment.teacher_details ?
                      `${comment.teacher_details.first_name} ${comment.teacher_details.last_name}` :
                      "Teacher"}
                  </h3>
                  <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                </div>
                <div className="mb-2">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Score: {comment.score}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EntryComments;
