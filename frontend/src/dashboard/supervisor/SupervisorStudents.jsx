import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../utils/axios';
import { FaArrowLeft, FaUserGraduate, FaEye } from 'react-icons/fa';
import Sidebar from './Sidebar';
import MenuDropdown from '../../Components/MenuDropdown';

const SupervisorStudents = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await API.get(`/user_auth/students-in-class/${classId}/`);
        setStudents(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classId]);

  const goToReflections = (studentId) => {
    navigate(`/supervisor/student-entries/${studentId}`);
  };

  const getInitials = (first, last) => {
    return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-xl hover:opacity-80"
              title="Go Back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl md-text-2xl font-bold">Students in Class</h1>
              <p className="text-sm text-white-100">Click “Review” to view reflections</p>
            </div>
            
          {window.screen.width <= 600 && <MenuDropdown />}
          </div>
        </div>

        {/* Main Content */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden"
            >
              {/* Gradient hover border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-blue-500 opacity-0 group-hover:opacity-100 blur-lg rounded-xl transition duration-300 z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  {/* Avatar bubble */}
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
                  <FaEye />
                  Review Reflections
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SupervisorStudents;
