import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStudentEntries } from "../utils/api";
import API from "../utils/axios";

const HLPReflectionList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hlpNumber = location.state?.hlp?.replace("HLP ", "") || "";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  const toggleEntryDetails = (entryId) => {
    setExpandedEntryId((prev) => (prev === entryId ? null : entryId));
  };

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const entries = await getStudentEntries({ hlp: hlpNumber });
        setEntries(entries);
      } catch (err) {
        console.error("Error fetching reflections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReflections();
  }, [hlpNumber]);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Completed Look-fors for HLP {hlpNumber}
        </h2>

        {loading ? (
          <p className="text-gray-700">Loading reflections...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-600">
            No reflections submitted yet for this HLP.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  Look-for #{entry.lookfor_number}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Score:{" "}
                  <span className="font-medium text-gray-800">
                    {entry.score}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Date Submitted:{" "}
                  <span className="font-medium text-gray-800">
                    {entry.date}
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
                  <button
                    onClick={() => toggleEntryDetails(entry.id)}
                    className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 mb-2 sm:mb-0"
                  >
                    {expandedEntryId === entry.id
                      ? "Hide Details"
                      : "View Reflection"}
                  </button>
                  <button
                    onClick={() => {
                      console.log("Existing entry:", entry);
                      navigate("/submit-reflection/", {
                        state: {
                          hlp: `HLP ${hlpNumber}`,
                          mode: "edit",
                          existingEntry: entry,
                        },
                      });
                    }}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Edit Reflection
                  </button>
                </div>

                {expandedEntryId === entry.id && (
                  <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="text-indigo-800 font-semibold mb-2">
                      Reflection Prompts:
                    </h4>
                    {entry.prompt_responses?.map((res, index) => (
                      <div key={index} className="mb-4">
                        <p className="text-sm text-indigo-600 font-medium">
                          Prompt #{res.prompt}:
                        </p>
                        <p className="text-gray-800">
                          {res.reflection || "(No response)"}
                        </p>
                      </div>
                    ))}

                    {/* @@ Not sure how this is grabbing but leaving it for TODO */}

                    {/* {entry.teacher_comments?.length > 0 && (
                      <div className="mt-4 bg-white p-3 rounded border border-blue-200">
                        <h5 className="font-semibold text-blue-800">
                          Teacher Feedback:
                        </h5>
                        <p className="text-gray-700 mt-1">
                          {entry.teacher_comments[0].comment}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          - {entry.teacher_comments[0].supervisor_name} on{" "}
                          {new Date(
                            entry.teacher_comments[0].date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Reflection Button */}
      <div className="mt-8 flex justify-center">
        <button
          className="w-full p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl max-w-xl"
          onClick={() =>
            navigate("/submit-reflection/", {
              state: {
                hlp: `HLP ${hlpNumber}`,
              },
            })
          }
        >
          📚 Add New Reflection on this HLP
        </button>
      </div>
    </div>
  );
};

export default HLPReflectionList;
