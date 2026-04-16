import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import { getStudentEntries } from "../../utils/api";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import MainMenuDropdown from "./StudentMainMenuDropdown";

const DraftReflections = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getStudentEntries({ status: "draft" });
        setDrafts(data);
      } catch (err) {
        console.error("Error fetching drafts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleContinue = (draft) => {
    navigate("/submit-reflection/", {
      state: {
        hlp: `HLP ${draft.hlp}`,
        draft: draft,
      },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaArrowLeft
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate(-1)}
          />
          <FaHome
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform text-blue-600"
            onClick={() => navigate("/mainmenu/")}
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Draft Reflections
        </h1>
        <div className="relative">
          <FaBars
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && <MainMenuDropdown onClose={() => setMenuOpen(false)} />}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto w-full">
        {loading ? (
          <p className="text-center text-gray-500 mt-12">Loading drafts...</p>
        ) : drafts.length === 0 ? (
          <div className="text-center mt-12 bg-white rounded-xl p-8 shadow border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">You have no saved drafts.</p>
            <button
              onClick={() => navigate("/hlpcategories/")}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Start a New Reflection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => {
              const hlpData = HLP_LookFors[draft.hlp];
              const groupName = hlpData?.group;
              const bgColor = HLP_LookFors.groups?.[groupName]?.color || "bg-gray-400";

              return (
                <button
                  key={draft.id}
                  onClick={() => handleContinue(draft)}
                  className="w-full text-left bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition overflow-hidden"
                >
                  {/* Color band */}
                  <div className={`${bgColor} px-5 py-3`}>
                    <p className="text-white font-bold text-lg">
                      HLP {draft.hlp}
                    </p>
                    {hlpData && (
                      <p className="text-white text-sm opacity-90 truncate">
                        {hlpData.title}
                      </p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="px-5 py-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium text-gray-800">Week:</span>{" "}
                        {draft.week_number}
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">Date:</span>{" "}
                        {draft.date}
                      </p>
                      <p>
                        <span className="font-medium text-gray-800">Type:</span>{" "}
                        {draft.entry_type === "practice" ? "Practice" : "Observation"}
                      </p>
                    </div>
                    <span className="text-amber-600 font-semibold text-sm border border-amber-400 bg-amber-50 px-3 py-1 rounded-full">
                      Continue ✏️
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftReflections;
