// components/shared/ClassGenerator.jsx
import { useEffect, useState } from "react";
import { generateClass, getClasses, removeClass } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaHome, FaPlus, FaEdit, FaTrash,
  FaUsers, FaChevronDown, FaChevronUp, FaUserGraduate,
} from "react-icons/fa";
import ConfirmDialog from "../../../Components/ConfirmDialog";
import API from "../../../utils/axios";

const ClassGenerator = ({ onClassCreated }) => {
  const [classes, setClasses] = useState([]); // [{id, name}]
  const [expandedId, setExpandedId] = useState(null);
  const [studentsMap, setStudentsMap] = useState({}); // { classId: [...] }
  const [loadingStudents, setLoadingStudents] = useState({});
  const [newClassName, setNewClassName] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState(null); // id of class pending delete
  const navigate = useNavigate();

  const fetchClasses = async () => {
    const data = await getClasses();
    setClasses(data); // full objects [{id, name}]
  };

  useEffect(() => { fetchClasses(); }, []);

  const toggleExpand = async (cls) => {
    if (expandedId === cls.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(cls.id);
    if (studentsMap[cls.id]) return; // already loaded

    setLoadingStudents((prev) => ({ ...prev, [cls.id]: true }));
    try {
      const res = await API.get(`/user_auth/students-in-class/${cls.id}/`);
      setStudentsMap((prev) => ({ ...prev, [cls.id]: res.data }));
    } catch (err) {
      console.error(err);
      setStudentsMap((prev) => ({ ...prev, [cls.id]: [] }));
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [cls.id]: false }));
    }
  };

  const genClass = async () => {
    setErrors({});
    setServerError("");
    setSuccessMessage("");

    if (!newClassName.trim()) {
      setErrors({ class_name: "Class name is required." });
      return;
    }

    setCreating(true);
    try {
      await generateClass({ class_name: newClassName.trim() });
      onClassCreated?.();
      setSuccessMessage(`"${newClassName.trim()}" created successfully.`);
      setNewClassName("");
      fetchClasses();
    } catch (error) {
      if (error.response?.data?.error === "Class already exists") {
        setServerError("A class with that name already exists.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const confirmingClass = classes.find((c) => c.id === confirmId);

  const handleDelete = () => {
    if (!confirmingClass) return;
    removeClass(confirmingClass.name);
    setClasses((prev) => prev.filter((c) => c.id !== confirmId));
    setStudentsMap((prev) => { const copy = { ...prev }; delete copy[confirmId]; return copy; });
    if (expandedId === confirmId) setExpandedId(null);
    setConfirmId(null);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-blue-50 to-blue-100">
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete this class?"
        message={
          confirmingClass
            ? `"${confirmingClass.name}" and all its data will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Class"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white hover:opacity-80 transition text-xl">
            <FaArrowLeft />
          </button>
          <button onClick={() => navigate("/mainmenu/")} className="text-white hover:opacity-80 transition text-xl">
            <FaHome />
          </button>
          <h1 className="text-2xl font-bold">Class Admin</h1>
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 w-full flex flex-col gap-6">

        {/* Class List — grows to fill available height */}
        <section className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Your Classes</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {classes.length} class{classes.length !== 1 ? "es" : ""} — click a row to see enrolled students
              </p>
            </div>
            <FaUsers className="text-2xl text-blue-300" />
          </div>

          {classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FaUsers className="text-6xl mb-4 text-gray-200" />
              <p className="font-medium text-lg">No classes yet.</p>
              <p className="text-sm mt-1">Create your first class using the form below.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {classes.map((cls) => {
                const isOpen = expandedId === cls.id;
                const students = studentsMap[cls.id] ?? [];
                const isLoading = loadingStudents[cls.id];

                return (
                  <li key={cls.id}>
                    {/* Class row */}
                    <div
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => toggleExpand(cls)}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {cls.name[0]?.toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{cls.name}</p>
                        {studentsMap[cls.id] && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {students.length} student{students.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-class?class=${cls.name}`); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-sm font-medium transition"
                        >
                          <FaEdit className="text-xs" /> Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmId(cls.id); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm font-medium transition"
                        >
                          <FaTrash className="text-xs" /> Delete
                        </button>
                        <span className="text-gray-400 ml-1">
                          {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                        </span>
                      </div>
                    </div>

                    {/* Expanded student list */}
                    {isOpen && (
                      <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                        {isLoading ? (
                          <p className="text-sm text-gray-400">Loading students…</p>
                        ) : students.length === 0 ? (
                          <div className="flex items-center gap-2 text-gray-400">
                            <FaUserGraduate className="text-base" />
                            <p className="text-sm">No students enrolled yet.</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Enrolled Students ({students.length})
                            </p>
                            <ul className="space-y-2">
                              {students.map((s) => (
                                <li key={s.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                                    {(s.first_name?.[0] ?? "")}{(s.last_name?.[0] ?? "")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">
                                      {s.last_name}, {s.first_name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{s.email || s.username}</p>
                                  </div>
                                  <button
                                    onClick={() => navigate(`/supervisor/student-entries/${s.id}`)}
                                    className="text-xs text-blue-600 hover:underline shrink-0"
                                  >
                                    View reflections
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Create New Class — fixed at bottom */}
        <section className="bg-white rounded-xl shadow border border-gray-200 p-5 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Class</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter class name…"
              value={newClassName}
              onChange={(e) => { setNewClassName(e.target.value); setErrors({}); setServerError(""); setSuccessMessage(""); }}
              onKeyDown={(e) => e.key === "Enter" && genClass()}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              onClick={genClass}
              disabled={creating}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-60 shrink-0"
            >
              <FaPlus className="text-xs" />
              {creating ? "Creating…" : "Create"}
            </button>
          </div>

          {errors.class_name && <p className="text-red-500 text-sm mt-2">{errors.class_name}</p>}
          {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}
          {successMessage && <p className="text-green-600 text-sm mt-2 font-medium">{successMessage}</p>}
        </section>
      </main>
    </div>
  );
};

export default ClassGenerator;
