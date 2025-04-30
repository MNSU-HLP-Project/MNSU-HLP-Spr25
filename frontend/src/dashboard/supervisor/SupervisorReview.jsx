// src/pages/SupervisorReview.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../utils/axios"; // make sure your API instance is correctly configured

const SupervisorReview = () => {
  const { classId, studentId } = useParams();
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
      <h1 className="text-2xl font-bold mb-4">Student Reflections</h1>
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
