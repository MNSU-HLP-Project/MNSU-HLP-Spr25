import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, getStudentsForClass } from "../../utils/api";
import Sidebar from "./Sidebar";

const SupervisorClassView = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Failed to fetch classes", error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
            TeachTrack
          </h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 text-xl">🔔</button>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
              SV
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {classes.length === 0 ? (
            <p className="text-gray-500">No classes available.</p>
          ) : (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white border border-gray-200 px-6 py-5 rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                onClick={() => navigate(`/supervisor/students/${cls.id}`)}
              >
                <h2 className="text-xl font-bold flex items-center space-x-2 text-purple-700">
                  <span>📄</span>
                  <span>{cls.name}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Click card to view individual student reflections
                </p>

                {/* ✅ New Button */}
                <button
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    navigate(`/entries/by-class/${cls.id}`);
                  }}
                >
                  View All Reflections for This Class
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SupervisorClassView;
