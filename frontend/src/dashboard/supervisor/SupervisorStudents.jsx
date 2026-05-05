import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/axios';
import { FaArrowLeft, FaEye, FaHome, FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import MenuDropdown from '../studentTeacher/MenuDropdown';
import AssignHLPModal from './AssignHLPModal';
import HLP_LookFors from '../../assets/HLP_Lookfors';

const SupervisorStudents = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await API.get(`/user_auth/students-in-class/${classId}/`);
      setStudents(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load student data.");
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await API.get(`/entries/assignments/?class_id=${classId}`);
      setAssignments(response.data);
    } catch (err) {
      console.error("Failed to load assignments", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchStudents(), fetchAssignments()]);
      setLoading(false);
    };
    load();
  }, [classId]);

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await API.delete(`/entries/assignments/${id}/delete/`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete assignment.");
    }
  };

  const goToReflections = (studentId) => {
    navigate(`/supervisor/student-entries/${studentId}`);
  };

  const getInitials = (first, last) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const isOverdue = (due) => new Date(due) < new Date(new Date().toDateString());

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded shadow">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white text-xl hover:opacity-80" title="Go Back">
              <FaArrowLeft />
            </button>
            <button onClick={() => navigate("/mainmenu/")} className="text-white text-xl hover:opacity-80" title="Home">
              <FaHome />
            </button>
            <div>
              <h1 className="text-xl md-text-2xl font-bold">Students in Class</h1>
              <p className="text-sm text-white-100">Click "Review" to view reflections</p>
            </div>
            {window.screen.width <= 600 && <MenuDropdown />}
          </div>

          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition shadow"
          >
            <FaPlus /> Assign HLP
          </button>
        </div>

        {/* Main Content */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Students Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-blue-500 opacity-0 group-hover:opacity-100 blur-lg rounded-xl transition duration-300 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                    {getInitials(student.first_name, student.last_name)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {student.last_name}, {student.first_name}
                    </h2>
                    <p className="text-sm text-gray-500">{student.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => goToReflections(student.id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm shadow"
                >
                  <FaEye /> Review Reflections
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Assignments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">HLP Assignments for This Class</h2>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <FaPlus /> New Assignment
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
              <FaCalendarAlt className="mx-auto text-3xl text-gray-300 mb-3" />
              <p>No HLP assignments yet. Click "Assign HLP" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => {
                const hlpData = HLP_LookFors[a.hlp] ?? {};
                const lookForText =
                  a.lookfor_number > 0
                    ? hlpData.lookFors?.[a.lookfor_number]
                    : null;
                const overdue = isOverdue(a.due_date);
                const isWholeClass = !a.students || a.students.length === 0;

                return (
                  <div
                    key={a.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${
                      overdue ? "border-red-200" : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-700">
                          HLP {a.hlp}: {hlpData.title ?? `HLP ${a.hlp}`}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isWholeClass
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {isWholeClass
                            ? "Whole Class"
                            : `${a.students.length} student${a.students.length !== 1 ? "s" : ""}`}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                            overdue
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          <FaCalendarAlt className="text-[10px]" />
                          Due {new Date(a.due_date).toLocaleDateString()}
                          {overdue && " · Overdue"}
                        </span>
                      </div>

                      {lookForText && (
                        <p className="text-sm text-gray-600 mt-1">
                          Look-for #{a.lookfor_number}: {lookForText}
                        </p>
                      )}

                      {a.note && (
                        <p className="text-sm text-gray-500 mt-1 italic">{a.note}</p>
                      )}

                      {!isWholeClass && a.students.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Assigned to:{" "}
                          {a.students
                            .map((s) => `${s.first_name} ${s.last_name}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteAssignment(a.id)}
                      className="text-red-400 hover:text-red-600 transition shrink-0 self-start sm:self-center"
                      title="Delete assignment"
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showAssignModal && (
        <AssignHLPModal
          classId={classId}
          students={students}
          onClose={() => setShowAssignModal(false)}
          onAssigned={fetchAssignments}
        />
      )}
    </div>
  );
};

export default SupervisorStudents;
