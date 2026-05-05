//supervisor/supervisorView.jsx
import React, { useEffect, useState } from "react";
import InviteModal from "../components/shared/InviteModal";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../../utils/api";
import AssignHLPModal from "./AssignHLPModal";
import API from "../../utils/axios";

const SupervisorMainView = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const navigate = useNavigate();

  // Load classes so the modal can pick one
  useEffect(() => {
    getClasses().then(setClasses).catch(console.error);
  }, []);

  // When a class is selected in the quick-assign flow, load its students
  useEffect(() => {
    if (!selectedClassId) { setStudents([]); return; }
    API.get(`/user_auth/students-in-class/${selectedClassId}/`)
      .then((r) => setStudents(r.data))
      .catch(console.error);
  }, [selectedClassId]);

  const handleOpenAssign = () => {
    if (classes.length === 1) {
      setSelectedClassId(String(classes[0].id));
    }
    setShowAssignModal(true);
  };

  return (
    <>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/classes/")}
      >
        📝 View Reflections
      </button>

      <button
        className="w-3/4 p-4 md:p-5 border-2 border-teal-600 text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={handleOpenAssign}
      >
        📋 Assign HLP
      </button>

      <button
        className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => setShowInviteModal(true)}
      >
        🔗 Invite To Class
      </button>
      <button
        className="w-3/4 p-4 md:p-5 border-2 border-purple-700 text-white bg-purple-700 rounded-lg hover:bg-purple-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => navigate("/edit-classes/")}
      >
        Class Admin
      </button>

      <button
        className="w-3/4 p-4 md:p-5 border-2 border-orange-600 text-white bg-orange-600 rounded-lg hover:bg-orange-700 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
        onClick={() => window.open("/resources/", "_blank", "noopener,noreferrer")}
      >
        📖 Resources
      </button>

      {showInviteModal && (
        <InviteModal userRole="Supervisor" onClose={() => setShowInviteModal(false)} />
      )}

      {/* Quick-assign modal — shown from main menu */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-lg font-bold">Assign HLP</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-white hover:text-teal-200 text-2xl leading-none">&times;</button>
            </div>

            {/* Class selector — only shown when supervisor has multiple classes */}
            {classes.length > 1 && (
              <div className="px-6 pt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">— Choose a class —</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedClassId ? (
              /* Render the real modal form inline once a class is chosen */
              <AssignHLPModal
                classId={selectedClassId}
                students={students}
                onClose={() => { setShowAssignModal(false); setSelectedClassId(""); }}
                onAssigned={() => {}}
                embedded
              />
            ) : classes.length > 1 ? (
              <p className="px-6 py-4 text-sm text-gray-500">Select a class above to continue.</p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorMainView;
