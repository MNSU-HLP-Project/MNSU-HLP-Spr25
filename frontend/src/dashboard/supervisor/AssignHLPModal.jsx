import { useState } from "react";
import API from "../../utils/axios";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const hlpNumbers = Object.keys(HLP_LookFors).filter((k) => k !== "groups");

const AssignHLPModal = ({ classId, students = [], onClose, onAssigned, embedded = false }) => {
  const [hlp, setHlp] = useState("");
  const [lookforNumber, setLookforNumber] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [targetType, setTargetType] = useState("class"); // "class" | "students"
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedHlpData = hlp ? HLP_LookFors[hlp] : null;
  const lookFors = selectedHlpData?.lookFors ?? {};

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!hlp) return setError("Please select an HLP.");
    if (!dueDate) return setError("Please set a due date.");
    if (targetType === "students" && selectedStudents.length === 0)
      return setError("Please select at least one student.");

    setSubmitting(true);
    try {
      await API.post("/entries/assignments/create/", {
        sup_class: classId,
        hlp,
        lookfor_number: lookforNumber,
        due_date: dueDate,
        note,
        student_ids: targetType === "students" ? selectedStudents : [],
      });
      onAssigned?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* HLP Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              HLP <span className="text-red-500">*</span>
            </label>
            <select
              value={hlp}
              onChange={(e) => {
                setHlp(e.target.value);
                setLookforNumber(0);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">— Select an HLP —</option>
              {hlpNumbers.map((num) => (
                <option key={num} value={num}>
                  HLP {num}: {HLP_LookFors[num].title}
                </option>
              ))}
            </select>
          </div>

          {/* Look-for (optional) */}
          {selectedHlpData && Object.keys(lookFors).length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Specific Look-For (optional)
              </label>
              <select
                value={lookforNumber}
                onChange={(e) => setLookforNumber(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value={0}>— Any look-for —</option>
                {Object.entries(lookFors).map(([num, text]) => (
                  <option key={num} value={num}>
                    #{num}: {text}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any instructions or context for students..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assign To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setTargetType("class")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                  targetType === "class"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Whole Class
              </button>
              <button
                type="button"
                onClick={() => setTargetType("students")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                  targetType === "students"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Specific Students
              </button>
            </div>

            {targetType === "students" && (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-sm text-gray-500 p-3">No students in class.</p>
                ) : (
                  students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => toggleStudent(s.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {s.last_name}, {s.first_name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60"
            >
              {submitting ? "Assigning…" : "Assign HLP"}
            </button>
          </div>
        </form>
  );

  if (embedded) return formContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-lg font-bold">Assign HLP</h2>
          <button onClick={onClose} className="text-white hover:text-blue-200 text-2xl leading-none">
            &times;
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
};

export default AssignHLPModal;
