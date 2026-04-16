import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStudentEntries } from "../../utils/api";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import MainMenuDropdown from "./StudentMainMenuDropdown";
import API from "../../utils/axios";
import { formatDateStringToLocale } from "../../utils/utilFunc";

const HLPReflectionList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hlpNumber = location.state?.hlp?.replace("HLP ", "") || "";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  const handleBackClick = () => navigate(-1);

  const toggleEntryDetails = (entryId) => {
    setExpandedEntryId((prev) => (prev === entryId ? null : entryId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entries, draftRes] = await Promise.all([
          getStudentEntries({ hlp: hlpNumber }),
          API.get(`/entries/draft/?hlp=${hlpNumber}`).catch(() => ({ data: { draft: null } })),
        ]);
        setEntries(entries);
        setDraft(draftRes.data.draft);
      } catch (err) {
        console.error("Error fetching reflections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hlpNumber]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-3">
          <FaArrowLeft
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={handleBackClick}
          />
          <FaHome
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform text-blue-600"
            onClick={() => navigate("/mainmenu/")}
          />
        </div>
        <div className="mb-6 text-black text-center py-3">
        <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          HLP #{hlpNumber}: {HLP_LookFors[hlpNumber].title}
        </p>
      </div>
        <div className="relative">
            <FaBars
              className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <MainMenuDropdown onClose={() => setMenuOpen(false)} />
            )}
          </div>

      </div>
      <div className="p-4 md:p-8">
        <div className={`mb-6 ${HLP_LookFors.groups[HLP_LookFors[hlpNumber].group].color} from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md`}>
        <h2 className="text-xl md:text-xl lg:text-2xl font-semibold mb-4 text-white flex items-center">

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
            <p className="text-white">Loading reflections...</p>
          ) : entries.length === 0 ? (
            <p className="text-white">
              No reflections submitted yet for this HLP.
            </p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="text-lg md:text-2xl  font-semibold text-indigo-700 mb-2">
                    Look-for #{entry.lookfor_number}
                  </h3>
                  <p className="text-sm md:text-xl text-gray-600 mb-1">
                    Score:{" "}
                    <span className="font-medium text-gray-800">
                      {entry.score}
                    </span>
                  </p>
                  <p className="text-sm md:text-xl text-gray-600 mb-4">
                    Date Submitted:{" "}
                    <span className="font-medium text-gray-800">
                      {entry.date}
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
                    <button
                      onClick={() => toggleEntryDetails(entry.id)}
                      className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 md:py-3 md:px-6 lg:py-4 lg:px-8 rounded text-sm md:text-base lg:text-xl font-medium hover:bg-indigo-700 transition mb-2 sm:mb-0"
                    >
                      {expandedEntryId === entry.id
                        ? "Hide Details"
                        : "View Reflection"}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/submit-reflection/", {
                          state: {
                            hlp: `HLP ${hlpNumber}`,
                            edit: true,
                            detail: entry,
                          },
                        });
                      }}
                  
                      className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 md:py-3 md:px-6 lg:py-4 lg:px-8 rounded text-sm md:text-base lg:text-xl font-medium hover:bg-green-700 transition mb-2 sm:mb-0"

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

                      {entry.teacher_comments?.length > 0 && (
                        <div className="mt-4 bg-white p-3 rounded border border-blue-200">
                          <h5 className="font-semibold text-blue-800">
                            Teacher Feedback:
                          </h5>
                          <p className="text-gray-700 mt-1">
                            {entry.teacher_comments[0].comment}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            - {entry.teacher_comments[0].supervisor_name} on{" "}
                            {formatDateStringToLocale(entry.teacher_comments[0].date)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New / Continue Reflection Button */}
        <div className="mt-8 flex justify-center">
          <button
            className={`w-full p-4 md:p-5 border-2 text-white rounded-lg flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl max-w-xl ${
              draft
                ? "border-amber-600 bg-amber-600 hover:bg-amber-700"
                : "border-blue-700 bg-blue-700 hover:bg-blue-800"
            }`}
            onClick={() =>
              navigate("/submit-reflection/", {
                state: {
                  hlp: `HLP ${hlpNumber}`,
                  draft: draft || null,
                },
              })
            }
          >
            {draft ? "✏️ Continue Draft Reflection" : "📚 Add New Reflection on this HLP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HLPReflectionList;
