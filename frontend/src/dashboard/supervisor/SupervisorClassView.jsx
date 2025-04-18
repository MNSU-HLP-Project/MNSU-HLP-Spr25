import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, getStudentsForClass } from "../../utils/api";
import Sidebar from "./Sidebar";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const SupervisorClassView = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [studentsByClass, setStudentsByClass] = useState({});

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
    const classId = classObj.id;

    if (selectedClassId === classId) {
      setSelectedClassId(null); // collapse the section
      return;
    }

    try {
      setSelectedClassId(classId);

      if (!studentsByClass[classId]) {
        const data = await getStudentsForClass(classObj);
        setStudentsByClass((prev) => ({
          ...prev,
          [classId]: data,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
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
              console.log("CLASS OBJECT:", cls);
              const classId = cls?.id;
              const students = studentsByClass[classId] || [];

              return (
                <div
                  key={cls.id}
                  className="bg-white border border-gray-200 px-6 py-5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleToggleStudents(cls)}
                    >
                      <h2 className="text-xl font-bold flex items-center space-x-2 text-purple-700">
                        <span>📄</span>
                        <span>{cls.name}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to view students
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleStudents(cls)}
                      className="text-gray-600 text-xl hover:text-purple-600"
                    >
                      {selectedClassId === classId ? "▲" : "▼"}
                    </button>
                  </div>

                  {selectedClassId === classId && (
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
                            <p className="text-sm text-gray-600">
                              {student.username}
                            </p>

                            <button
                              className="mt-2 text-blue-600 text-sm underline"
                              onClick={() =>{
                                console.log("Navigating to:", classId, student.id);
                                navigate(`/supervisor/review/${classId}/${student.id}`)
                              }}
                            >
                              View Reflections
                            </button>
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
