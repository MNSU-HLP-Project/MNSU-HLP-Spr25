import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaClipboardList } from "react-icons/fa";
import { getClasses } from "../../utils/api";
import API from "../../utils/axios";
import Sidebar from "./Sidebar";
import MenuDropdown from "../studentTeacher/MenuDropdown";

const SupervisorClassView = () => {
  const [classes, setClasses] = useState([]);
  const [assignmentCounts, setAssignmentCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);

        // Fetch assignment counts for each class in parallel
        const counts = await Promise.all(
          data.map(async (cls) => {
            try {
              const res = await API.get(`/entries/assignments/?class_id=${cls.id}`);
              return { id: cls.id, count: res.data.length };
            } catch {
              return { id: cls.id, count: 0 };
            }
          })
        );
        const map = {};
        counts.forEach(({ id, count }) => { map[id] = count; });
        setAssignmentCounts(map);
      } catch (error) {
        console.error("Failed to fetch classes", error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="flex min-h-[100dvh] bg-gradient-to-b from-blue-100 to-white">
      {window.screen.width > 600 && <Sidebar />}

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <FaHome
              className="text-2xl cursor-pointer text-blue-600 hover:scale-110 transition-transform"
              onClick={() => navigate("/mainmenu/")}
            />
            <h1 className="text-4xl font-extrabold text-black drop-shadow-sm">
              MyHLPTracker
            </h1>
          </div>
          {window.screen.width <= 600 && <MenuDropdown />}
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
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold flex items-center space-x-2 text-blue-700">
                    <span>📄</span>
                    <span>{cls.name}</span>
                  </h2>

                  {assignmentCounts[cls.id] > 0 && (
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      <FaClipboardList className="text-[10px]" />
                      {assignmentCounts[cls.id]} assignment{assignmentCounts[cls.id] !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Click card to manage students and HLP assignments
                </p>

                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
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
