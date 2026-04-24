// src/pages/SupervisorReview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import API from "../../utils/axios";

const SupervisorReview = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await API.get(`/entries/by-class/${classId}/${studentId}/`);
        setEntries(response.data);
      } catch (err) {
        console.error("Failed to fetch entries", err);
        setError("Failed to load reflections");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [classId, studentId]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-2xl text-gray-700 hover:text-gray-900 transition" title="Go back">
          <FaArrowLeft />
        </button>
        <button onClick={() => navigate("/mainmenu/")} className="text-2xl text-blue-600 hover:scale-110 transition-transform" title="Home">
          <FaHome />
        </button>
        <h1 className="text-2xl font-bold">Student Reflections</h1>
      </div>
      {entries.length === 0 ? (
        <p>No reflections found for this student.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white p-4 border rounded shadow-sm">
              <p className="font-semibold">Week: {entry.week}</p>
              <p className="mt-1 text-gray-700">{entry.content}</p>
              <p className="text-sm text-gray-500">Status: {entry.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SupervisorReview;
