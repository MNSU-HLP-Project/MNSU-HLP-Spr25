import React from "react";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainMenuDropdown from "./StudentMainMenuDropdown";

const HLPSelection = () => {
  // Setting default values
  const [pillars, setPillars] = useState([]);
  const [embedded, setEmbedded] = useState([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [color, setColor] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const handleBackClick = () => navigate(-1);
  const handleLogout = () => navigate("/");
  const [menuOpen, setMenuOpen] = useState(false);

  // Getting the darker shade to hover TODO: Look into making this a default somehow
  const getDarkerShade = (color) => {
    const colorBase = color.replace(/-\d+$/, ""); // Remove the `bg-`
    return `${colorBase}-800`; // Adding -800 for a darker shade
  };

  // Get the collaboration that was set in HLPCategories
  useEffect(() => {
    setGroupTitle(location.state.name);
  }, []);

  // Get the group data from the HLP_LookFors file
  useEffect(() => {
    if (groupTitle) {
      const groupData = HLP_LookFors.groups[groupTitle];
      // If receiving group data set the group data to display
      if (groupData) {
        setPillars(groupData.Pillars);
        setEmbedded(groupData.Embedded);
        setColor(groupData.color);
      }
    }
  }, [groupTitle]);

  const handleClick = (hlp) => {
    // Navigate to completed lookfor for the selected HLP
    navigate("/completed-lookfor/", { state: { hlp } });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          {groupTitle}
        </h1>
        <div className="relative">
          <FaBars
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && <MainMenuDropdown onClose={() => setMenuOpen(false)} />}
        </div>
      </div>

      <p className="text-center text-lg md:text-xl font-bold text-gray-700 mb-1">
        Choose a HLP
      </p>
      {/* Pillars Section */}
      <h2 className="mt-4 text-xl font-semibold text-center">Pillar HLPs</h2>
      <div className="flex flex-row-2 md:flex-row-4 justify-center gap-3 mt-3 px-4">
        {pillars.map((pillarId) => (
          <div
            key={pillarId}
            className={`text-white ${color} p-6 w-full md:w-40 text-center rounded-xl shadow-lg cursor-pointer hover:${getDarkerShade(
              color
            )} transition`}
            onClick={() => handleClick(`HLP ${pillarId}`)}
          >
            <strong className="text-xl">HLP {pillarId}</strong>
            <p className="text-sm line-clamp-2 md:line-clamp-none">
              {HLP_LookFors[pillarId].title}
            </p>
          </div>
        ))}
      </div>

      {/* Embedded HLPs Section */}
      <h2 className="mt-4 text-xl font-semibold text-center">Embedded HLPs</h2>
      <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 mt-3 px-4">
        {embedded.map((embeddedId) => (
          <div
            key={embeddedId}
            className={`${color} text-white p-4 w-[45%] sm:w-[30%] md:w-48 text-center rounded-xl shadow-lg cursor-pointer hover:${getDarkerShade(
              color
            )} transition`}
            onClick={() => handleClick(`HLP ${embeddedId}`)}
          >
            <strong className="text-xl mb-1">HLP {embeddedId}</strong>
            <p className="text-sm line-clamp-3 md:line-clamp-none">
              {HLP_LookFors[embeddedId]?.title}
            </p>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-2 mt-auto flex justify-center">
        <button
          className="w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300 font-semibold text-lg md:text-xl"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default HLPSelection;
