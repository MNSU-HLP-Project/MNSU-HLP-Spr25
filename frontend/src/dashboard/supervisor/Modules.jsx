import { useState } from "react";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainMenuDropdown from "../studentTeacher/StudentMainMenuDropdown";

export default function Modules({ audience }) {
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const [menuOpen, setMenuOpen] = useState(false);

  const modules = [
    {
      id: "overview",
      title: "Overview of the HLPs",
      description: "An introduction to the High-Leverage Practices framework.",
      color: "bg-indigo-700",
      audience: "both",
    },
    {
      id: "hlp7",
      title: "HLP 7: Organized Learning Environment",
      description: "Coming Soon.",
      color: "bg-rose-700",
      comingSoon: true,
      audience: "teacher"
    },
    {
      id: "hlp9",
      title: "HLP 9: Social Behaviors",
      description: "Coming Soon.",
      color: "bg-teal-700",
      comingSoon: true,
      audience: "teacher"
    },
    {
      id: "hlp10",
      title: "HLP 10: FBA",
      description: "Coming Soon.",
      color: "bg-purple-700",
      comingSoon: true,
      audience: "teacher"
    },
  ];

  const visibleModules = modules.filter(
    (m) => m.audience === "both" || m.audience === audience
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-gray-100 to-white p-6">
      <div>
        <div className="flex justify-between items-center mt-4 mb-4">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={handleBackClick}
            />
            <FaHome
              className="text-2xl md:text-3xl cursor-pointer text-blue-600 hover:scale-110 transition-transform"
              onClick={() => navigate("/mainmenu/")}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-gray-300 pb-1">
            {audience === "teacher" ? "Modules for Teachers" : "Modules for School Leaders"}
          </h1>
          <div className="relative">
            <FaBars
              className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <MainMenuDropdown onClose={() => setMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 items-start">
        {visibleModules.map((module) => (
          <div
            key={module.id}
            onClick={() => navigate(`/supervisor/modules/${module.id}`)}
            className={`relative ${module.color} text-white rounded-xl max-w-xs min-h-[160px] flex flex-col justify-center p-6 shadow-xl cursor-pointer hover:scale-105 hover:rotate-1 transition-transform`}
          >
            {module.comingSoon && (
              <span className="absolute top-3 right-3 bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Coming Soon
              </span>
            )}
            <h2 className="text-xl font-bold mb-2">{module.title}</h2>
            <p className="text-white/90">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}