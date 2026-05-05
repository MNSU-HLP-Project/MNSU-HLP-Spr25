import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import API from "../../utils/axios";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const AssignedHLPs = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/entries/assignments/student/");
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const today = new Date(new Date().toDateString());

  const getDueStatus = (dueDateStr) => {
    const due = new Date(dueDateStr);
    const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: "Overdue", color: "text-red-600 bg-red-50 border-red-200", icon: <FaExclamationCircle className="text-red-500" /> };
    if (diff === 0) return { label: "Due Today", color: "text-orange-600 bg-orange-50 border-orange-200", icon: <FaClock className="text-orange-500" /> };
    if (diff <= 3) return { label: `Due in ${diff} day${diff !== 1 ? "s" : ""}`, color: "text-amber-600 bg-amber-50 border-amber-200", icon: <FaClock className="text-amber-500" /> };
    return { label: `Due ${new Date(dueDateStr).toLocaleDateString()}`, color: "text-green-600 bg-green-50 border-green-200", icon: <FaCalendarAlt className="text-green-500" /> };
  };

  const handleStartReflection = (assignment) => {
    navigate("/submit-reflection/", {
      state: { hlp: assignment.hlp, fromAssignment: true },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-3">
        <FaArrowLeft
          className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        />
        <FaHome
          className="text-xl cursor-pointer text-blue-600 hover:scale-110 transition-transform"
          onClick={() => navigate("/mainmenu/")}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assigned HLPs</h1>
          <p className="text-sm text-gray-500">HLPs your supervisor has assigned to you</p>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          Loading assignments…
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && assignments.length === 0 && (
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <FaCheckCircle className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No assignments yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Your supervisor hasn&apos;t assigned any HLPs to you or your class yet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {assignments.map((a) => {
          const hlpData = HLP_LookFors[a.hlp] ?? {};
          const lookForText =
            a.lookfor_number > 0 ? hlpData.lookFors?.[a.lookfor_number] : null;
          const status = getDueStatus(a.due_date);

          return (
            <div
              key={a.id}
              className={`bg-white rounded-xl shadow-sm border p-5 ${
                status.label === "Overdue" ? "border-red-200" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* HLP Title */}
                  <h2 className="text-lg font-bold text-blue-700">
                    HLP {a.hlp}: {hlpData.title ?? `HLP ${a.hlp}`}
                  </h2>

                  {/* Group */}
                  {hlpData.group && (
                    <p className="text-xs text-gray-400 mt-0.5">{hlpData.group}</p>
                  )}

                  {/* Look-for */}
                  {lookForText && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Focus:</span> #{a.lookfor_number} — {lookForText}
                    </p>
                  )}

                  {/* Note from supervisor */}
                  {a.note && (
                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-blue-700 mb-0.5">Supervisor note:</p>
                      <p className="text-sm text-gray-700">{a.note}</p>
                    </div>
                  )}

                  {/* Due date badge */}
                  <div className={`inline-flex items-center gap-1.5 mt-3 text-xs font-medium px-3 py-1 rounded-full border ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleStartReflection(a)}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition self-start sm:self-center"
                >
                  Start Reflection
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignedHLPs;
