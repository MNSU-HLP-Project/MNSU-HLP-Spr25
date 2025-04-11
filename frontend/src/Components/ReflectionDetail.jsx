import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../utils/axios";
import HLP_LookFors from "../assets/HLP_Lookfors";

const ReflectionDetail = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check role on component mount
  useEffect(() => {
    // Force role check
    const role = localStorage.getItem('role');
    console.log('ReflectionDetail - Current role:', role);
    if (role !== 'Student Teacher') {
      console.error(`Unexpected role: ${role}, expected Student Teacher. Fixing...`);
      localStorage.setItem('role', 'Student Teacher');
    }
  }, []);

  // Fetch entry details on component mount
  useEffect(() => {
    // First, check if we have the entry data in localStorage
    const storedEntryData = localStorage.getItem('currentEntryData');
    if (storedEntryData) {
      try {
        const parsedData = JSON.parse(storedEntryData);
        if (parsedData.id === parseInt(entryId)) {
          setEntry(parsedData);
          setLoading(false);
          return; // Exit early if we have the data
        }
      } catch (parseError) {
        // Failed to parse stored entry data, will fetch from API instead
      }
    }

    // If we don't have the data in localStorage, fetch it from the API
    const fetchEntryDetails = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch entry details

        try {
          // Try with and without trailing slash
          let response;
          try {
            response = await API.get(`/entries/${entryId}/`);
          } catch (slashError) {
            // Try without trailing slash as fallback
            response = await API.get(`/entries/${entryId}`);
          }

          if (response.data && typeof response.data === 'object') {
            setEntry(response.data);
          } else {
            setError("Failed to load reflection details. Please try again later.");
          }
        } catch (apiError) {
          // Try alternative endpoint as fallback
          try {
            const fallbackResponse = await API.get(`/entries/student/entries/`);

            if (Array.isArray(fallbackResponse.data)) {
              // Find the entry with matching ID
              const matchingEntry = fallbackResponse.data.find(entry => entry.id === parseInt(entryId));

              if (matchingEntry) {
                setEntry(matchingEntry);
                return; // Exit early if we found a match
              }
            }
          } catch (fallbackError) {
            // Fallback also failed
          }

          // Check if token is valid
          if (apiError.response?.status === 401) {
            setError("Your session has expired. Please log in again.");
          } else {
            setError("Failed to load reflection details. Please try again later.");
          }
        }
      } catch (error) {
        setError("Failed to load reflection details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (entryId) {
      fetchEntryDetails();
    }

    // Clean up function to remove stored entry data when component unmounts
    return () => {
      localStorage.removeItem('currentEntryData');
    }
  }, [entryId]);

  // Removed dummy entry function

  // Handle back button click
  const handleBackClick = () => {
    // Force role check before navigation
    const role = localStorage.getItem('role');
    console.log('ReflectionDetail - handleBackClick - Current role:', role);
    if (role !== 'Student Teacher') {
      console.error(`Unexpected role: ${role}, expected Student Teacher. Fixing...`);
      localStorage.setItem('role', 'Student Teacher');
    }
    navigate("/reflections/");
  };

  // Get indicator text
  const getIndicatorText = (indicator) => {
    switch (indicator) {
      case "always":
        return "Always";
      case "sometimes":
        return "Sometimes";
      case "never":
        return "Never";
      case "na":
      default:
        return "N/A";
    }
  };

  // Get indicator badge color
  const getIndicatorBadgeColor = (indicator) => {
    switch (indicator) {
      case "always":
        return "bg-green-100 text-green-800 border-green-200";
      case "sometimes":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "never":
        return "bg-red-100 text-red-800 border-red-200";
      case "na":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">Loading reflection details...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error || "Reflection not found."}</p>
          <p className="text-gray-500 mb-4 text-sm">
            {!entry ? "No reflection data was received from the server." : ""}
            {!entryId ? "No reflection ID was provided in the URL." : `Attempted to load reflection ID: ${entryId}`}
          </p>
          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-xs font-mono overflow-auto max-h-40">
            <p className="font-semibold mb-1">Debug Info:</p>
            <p>User Role: {localStorage.getItem('role')}</p>
            <p>Token Present: {localStorage.getItem('jwtToken') ? 'Yes' : 'No'}</p>
            <p>URL: /entries/{entryId}/</p>
          </div>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Reflections
          </button>
        </div>
      </div>
    );
  }

  const hlpData = HLP_LookFors[entry.hlp] || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaArrowLeft
            className="text-2xl cursor-pointer mr-4"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-bold">Reflection Details</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(entry.status)}`}>
          {formatStatus(entry.status)}
        </span>
      </div>

      {/* HLP Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-2">
          HLP {entry.hlp}: {hlpData.title || "Unknown HLP"}
        </h2>
        <p className="text-gray-600">
          Week {entry.week_number} • Submitted on {new Date(entry.date).toLocaleDateString()}
        </p>

        {/* Look-fors */}
        {hlpData.lookFors && (
          <div className="mt-4">
            <h3 className="font-medium text-lg mb-2">Look-fors:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(hlpData.lookFors).map(([number, text]) => (
                <li key={number} className="text-gray-700">
                  <span className="font-medium">#{number}:</span> {text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prompt Responses */}
      {entry.prompt_responses && entry.prompt_responses.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-4">Prompt Responses</h2>
          <div className="space-y-6">
            {entry.prompt_responses.map((response) => (
              <div key={response.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{response.prompt_detail.prompt}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIndicatorBadgeColor(response.indicator)}`}>
                    {getIndicatorText(response.indicator)}
                  </span>
                </div>

                {response.reflection && (
                  <div className="mt-2">
                    <p className="text-gray-700">{response.reflection}</p>
                  </div>
                )}

                {/* Teacher comments on this prompt */}
                {response.teacher_comments && response.teacher_comments.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Teacher Feedback:</h4>
                    {response.teacher_comments.map((comment) => (
                      <div key={comment.id} className="mt-2">
                        <p className="text-gray-700">{comment.comment}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          - {comment.supervisor_name} on {new Date(comment.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence for Mastery */}
      {entry.evidences && entry.evidences.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-4">Evidence for Mastery</h2>
          <div className="space-y-4">
            {entry.evidences.sort((a, b) => a.order - b.order).map((evidence) => (
              <div key={evidence.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium mb-2">Evidence #{evidence.order}:</h3>
                <p className="text-gray-700">{evidence.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Goals */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Weekly Goal:</h3>
          <p className="text-gray-700">{entry.weekly_goal}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Criteria for Mastery:</h3>
          <p className="text-gray-700">{entry.criteria_for_mastery}</p>
        </div>

        {entry.goal_reflection && (
          <div>
            <h3 className="font-medium mb-2">Goal Reflection:</h3>
            <p className="text-gray-700">{entry.goal_reflection}</p>
          </div>
        )}
      </div>

      {/* Overall Teacher Comments */}
      {entry.teacher_comments && entry.teacher_comments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Teacher Feedback</h2>
          <div className="space-y-4">
            {entry.teacher_comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">{comment.comment}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    - {comment.supervisor_name} on {new Date(comment.date).toLocaleDateString()}
                  </p>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Score: {comment.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionDetail;
