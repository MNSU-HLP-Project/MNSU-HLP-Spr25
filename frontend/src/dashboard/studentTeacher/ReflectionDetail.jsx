import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../utils/axios";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import { formatDateStringToLocale } from "../../utils/utilFunc";
import { RUBRIC_CRITERIA, RUBRIC_SCORE_LABELS, RUBRIC_MAX_SCORE } from "../../utils/rubric";

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
    if (role !== 'Student Teacher') {
      console.error(`Unexpected role: ${role}, expected Student Teacher. Fixing...`);
      localStorage.setItem('role', 'Student Teacher');
    }
    navigate("/reflections/");
  };


  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "revision":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "revised":
        return "bg-purple-100 text-purple-800 border-purple-200";
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
      case "revised":
        return "Revised Submission";
      case "pending":
      default:
        return "Pending Review";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-100 p-4 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">Loading reflection details...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-[100dvh] bg-gray-100 p-4">
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
    <div className="min-h-[100dvh] bg-gray-100 p-4">
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
          Submitted on {entry.date}
        </p>

        {/* Look-fors */}
        {hlpData.lookFors && (
          <div className="mt-4">
            <p>#{entry.lookfor_number}: {hlpData.lookFors[entry.lookfor_number]}</p>
            <p className="text-sm text-gray-600 mt-1">Score: {entry.score ?? "N/A"}</p>
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
                  <h3 className="font-medium">{response.prompt}</h3>
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
                          - {comment.supervisor_name} on {formatDateStringToLocale(comment.date)}
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

      {/* Evidence for Mastery section removed */}


      {/* Revision Notice */}
      {entry.status === "revision" && (
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md mb-4 border border-yellow-200">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">Revision Requested</h2>
              <p className="text-yellow-700">Your supervisor has requested revisions to this reflection. Please review their feedback below and make the necessary changes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Teacher Comments */}
      {entry.teacher_comments && entry.teacher_comments.length > 0 && (
        <div className={`bg-white p-6 rounded-lg shadow-md mb-4 ${entry.status === "revision" ? "border-2 border-yellow-300" : ""}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Teacher Feedback
          </h2>
          <div className="space-y-4">
            {entry.teacher_comments.map((comment) => {
              const hasCriteriaScores = RUBRIC_CRITERIA.some((c) => comment[c.key] > 0);
              return (
                <div key={comment.id} className={`p-4 rounded-lg ${entry.status === "revision" ? "bg-yellow-50 border border-yellow-200" : "bg-blue-50"}`}>
                  <p className="text-gray-700 font-medium">{comment.comment}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      - {comment.supervisor_name} on {formatDateStringToLocale(comment.date)}
                    </p>
                    {comment.score > 0 && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Score: {comment.score} / {RUBRIC_MAX_SCORE}
                      </span>
                    )}
                  </div>

                  {/* Rubric breakdown — shown only for approved entries with criterion data */}
                  {entry.status === "approved" && hasCriteriaScores && (
                    <div className="mt-4 border border-blue-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-100 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-800">Rubric Score Breakdown</span>
                        <span className="text-sm font-bold text-blue-800">{comment.score} / {RUBRIC_MAX_SCORE}</span>
                      </div>
                      <div className="divide-y divide-blue-100">
                        {RUBRIC_CRITERIA.map((criterion) => {
                          const val = comment[criterion.key];
                          if (!val) return null;
                          const colors = {
                            4: "bg-green-100 text-green-800 border-green-300",
                            3: "bg-blue-100 text-blue-800 border-blue-300",
                            2: "bg-amber-100 text-amber-800 border-amber-300",
                            1: "bg-red-100 text-red-800 border-red-300",
                          };
                          return (
                            <div key={criterion.key} className="flex items-center justify-between px-4 py-2 bg-white text-sm">
                              <span className="text-gray-700 font-medium">{criterion.label}</span>
                              <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${colors[val]}`}>
                                {RUBRIC_SCORE_LABELS[val]} ({val}/4)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit:  Removed this from the details page and added edit functionality in the completedlookfors page */}

      <div className="flex justify-end mt-6">
        <button
          onClick={() =>
            navigate("/submit-reflection/", {
              state: { hlp: entry.hlp, edit: true, detail: entry },
            })
          }
          className={`flex items-center font-medium py-2 px-4 rounded-lg shadow-md transition duration-200 ${entry.status === "revision"
            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
        >
          {entry.status === "revision" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Make Requested Revisions
            </>
          ) : (
            "Edit Reflection"
          )}
        </button>
      </div>

    </div>
  );
};

export default ReflectionDetail;
