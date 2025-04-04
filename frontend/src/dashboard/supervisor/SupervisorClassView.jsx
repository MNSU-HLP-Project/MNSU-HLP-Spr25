import React, { useEffect, useState } from "react";
import { getClasses } from "../../utils/api"; //getStudentsForClass
import Sidebar from "./Sidebar"; // new Sidebar component

const SupervisorClassView = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);

  // Fetch classes on load
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

  // Fetch students when a class is clicked
//   const handleClassClick = async (classObj) => {
    
//     try {
//         const data = await getStudentsForClass(classObj.id);
//       setStudents(data);
//     } catch (error) {
//       console.error("Failed to fetch students", error);
//     }
//   };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {selectedClassId
              ? classes.find((c) => c.id === selectedClassId)?.name
              : "Your Classes"}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500">🔔</button>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
              SV
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => handleClassClick(cls)}
              className="border p-4 rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{cls.name}</h2>
              {selectedClassId === cls.id && (
                <div className="mt-4">
                  <div className="flex space-x-6 mb-4 border-b">
                    <button className="pb-2 border-b-2 border-black font-semibold">
                      Students
                    </button>
                    <button className="pb-2 text-gray-400">Analytics</button>
                  </div>
                  <div className="grid gap-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="border p-3 rounded shadow"
                      >
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="text-sm">Type: {student.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SupervisorClassView;
