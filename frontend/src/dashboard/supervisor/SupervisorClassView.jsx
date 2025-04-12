import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, getStudentsForClass } from "../../utils/api";
import Sidebar from "./Sidebar";

const SupervisorClassView = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentsByClass, setStudentsByClass] = useState({});
  const [studentEntriesMap, setStudentEntriesMap] = useState({});

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

  const handleToggleStudents = async (classObj) => {
    const classKey = classObj.name;

    if (selectedClassName === classKey) {
      setSelectedClassName(null);
      return;
    }

    try {
      setSelectedClassName(classKey);

      if (!studentsByClass[classKey]) {
        const data = await getStudentsForClass(classObj);
        setStudentsByClass((prev) => ({
          ...prev,
          [classKey]: data,
        }));
      }

      setSelectedStudentId(null);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      if (selectedStudentId === studentId) {
        setSelectedStudentId(null);
        return;
      }

      setSelectedStudentId(studentId);

      if (studentEntriesMap[studentId]) return;

      const res = await fetch(`http://localhost:8000/entries/by-student/${studentId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Unexpected response:", text);
        throw new Error("Fetch failed with status " + res.status);
      }

      const data = await res.json();

      setStudentEntriesMap((prev) => ({
        ...prev,
        [studentId]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch student entries", error);
    }
  };

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
            classes.map((cls) => {
              const classKey = cls.name;
              const students = studentsByClass[classKey] || [];

              return (
                <div
                  key={cls.id}
                  className="bg-white border border-gray-200 px-6 py-5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/supervisor/review/${cls.id}`)}
                    >
                      <h2 className="text-xl font-bold flex items-center space-x-2 text-purple-700">
                        <span>📄</span>
                        <span>{cls.name}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to view all reflections
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStudents(cls);
                      }}
                      className="text-gray-600 text-xl hover:text-purple-600"
                    >
                      {selectedClassName === classKey ? "▲" : "▼"}
                    </button>
                  </div>

                  {selectedClassName === classKey && (
                    <div className="mt-6 bg-gray-50 text-black rounded-md p-4">
                      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                        Students
                      </h3>
                      <div className="grid gap-4">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className="border p-3 rounded shadow-sm bg-white hover:bg-gray-100"
                          >
                            <p className="font-semibold">
                              {student.last_name}, {student.first_name}
                            </p>
                            <p className="text-sm text-gray-600">{student.username}</p>

                            <button
                              className="mt-2 text-blue-600 text-sm underline"
                              onClick={() => handleStudentClick(student.id)}
                            >
                              {selectedStudentId === student.id
                                ? "Hide Reflections"
                                : "View Reflections"}
                            </button>

                            {selectedStudentId === student.id && (
                              <div className="mt-3 border-t pt-3">
                                <p className="font-medium mb-2">Reflections:</p>
                                {studentEntriesMap[student.id]?.length === 0 ? (
                                  <p className="text-sm text-gray-400">
                                    No entries found.
                                  </p>
                                ) : (
                                  <ul className="space-y-2 text-sm">
                                    {studentEntriesMap[student.id]?.map((entry) => (
                                      <li
                                        key={entry.id}
                                        className="p-2 bg-white rounded border"
                                      >
                                        <p>{entry.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {new Date(entry.created_at).toLocaleDateString()}
                                        </p>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default SupervisorClassView;
