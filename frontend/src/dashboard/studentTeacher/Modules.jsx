import { useState } from "react";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MainMenuDropdown from "./StudentMainMenuDropdown";

export default function Modules() {
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const [menuOpen, setMenuOpen] = useState(false);

  const modules = [
    {
      id: "overview",
      title: "Overview",
      description: "An introduction to the High-Leverage Practices framework.",
      color: "bg-indigo-700",
    },
    {
      id: "hlp7",
      title: "HLP 7: Organized learning environment",
      description: "Coming Soon.",
      color: "bg-rose-700",
      comingSoon: true,
    },
    {
      id: "hlp9",
      title: "HLP 9: Social Behaviors",
      description: "Coming Soon.",
      color: "bg-teal-700",
      comingSoon: true,
    },
    {
      id: "hlp10",
      title: "HLP 10: FBA",
      description: "Coming Soon.",
      color: "bg-purple-700",
      comingSoon: true,
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-gray-100 to-white p-6">
      {/* Header */}
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
            Modules
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

      {/* Module Cards */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 items-start">
        {modules.map((module, index) => (
          <div 
            key={index}
            onClick={() => navigate(`/modules/${module.id}`)}
            className={`relative ${module.color} text-white rounded-xl max-w-xs min-h-[160px] flex flex-col justify-center p-6 shadow-xl cursor-pointer hover:scale-105 hover:rotate-1 transition-transform`}
            >
            <h2 className="text-xl font-bold mb-2">{module.title}</h2>
            <p className="text-white/90">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}