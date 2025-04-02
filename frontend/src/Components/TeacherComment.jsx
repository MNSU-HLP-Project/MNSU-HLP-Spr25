import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const TeacherComment = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const location = useLocation();
  const { entry } = location.state || {};
  const token = localStorage.getItem("jwtToken");
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    comment: "",
    score: "5"
  });

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

  // Handle comment form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({
      ...newComment,
      [name]: value
    });
  };

  // Submit new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await axios.post(`http://localhost:8000/api/add-comment/${entryId}/`, {
        token: token,
        comment: newComment.comment,
        score: newComment.score
      });
      
      // Refresh comments list
      fetchComments();
      
      // Reset form
      setNewComment({
        comment: "",
        score: "5"
      });
      
      setSubmitting(false);
      
      // Show success message
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
      setSubmitting(false);
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

  // Navigate back to teacher dashboard
  const handleBackClick = () => navigate("/teacher-dashboard/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          Provide Feedback
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* Entry Information */}
      {entry && (
        <div className="bg-blue-100 p-4 rounded-lg mb-6 shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-1">HLP {entry.hlp}</h2>
              {entry.user_details && (
                <p className="text-gray-700">
                  Student: {entry.user_details.first_name} {entry.user_details.last_name}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
          </div>
          <div className="mb-3">
            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm mr-2">
              Look-for #{entry.lookfor_number}
            </span>
            <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
              Score: {getScoreText(entry.score)}
            </span>
          </div>
          <p className="text-gray-700 mt-2 bg-white p-3 rounded-lg">{entry.comments}</p>
        </div>
      )}

      {/* New Comment Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Feedback</h2>
        <form onSubmit={handleSubmitComment}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Score (1-10):</label>
            <select
              name="score"
              value={newComment.score}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Your Comment:</label>
            <textarea
              name="comment"
              value={newComment.comment}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Enter your feedback for the student..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}`}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
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

      {/* Previous Comments List */}
      {!loading && !error && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Previous Feedback</h2>
          
          {comments.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-700">No previous feedback for this entry.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg shadow-md p-4">
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

export default TeacherComment;
