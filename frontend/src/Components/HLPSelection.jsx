import React from "react";
import HLP_LookFors from "../assets/HLP_Lookfors"
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const HLPSelection = () => {

  const [pillars, setPillars] = useState([]);
  const [embedded, setEmbedded] = useState([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [color, setColor] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const handleBackClick = () => navigate("/hlpcategories/");
  const handleMenuClick = () => alert("Menu button clicked");
  const handleLogout = () => navigate("/");
  const getDarkerShade = (color) => {
    const colorBase = color.replace(/-\d+$/, ''); // Remove the `bg-` and add `hover:bg-`
    return `${colorBase}-800`; // Adding -800 for a darker shade
  };

  useEffect(() => {
    setGroupTitle(location.state.name)
  },[])

  useEffect(() => {
    if (groupTitle) {
      const groupData = HLP_LookFors.groups[groupTitle];

      if (groupData) {
        setPillars(groupData.Pillars);
        setEmbedded(groupData.Embedded);
        setColor(groupData.color)
      }
    }
  }, [groupTitle]);

  // Navigate to entry form with selected HLP data
  const handleClick = (hlpId) => {
    // Get the HLP data from the lookfors
    const hlpData = HLP_LookFors[hlpId];

    // Navigate to entry form with HLP data and group information
    navigate("/entryform", {
      state: {
        hlpId: hlpId,
        hlpTitle: hlpData.title,
        hlpGroup: groupTitle,
        lookFors: hlpData.lookFors
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          {groupTitle}
        </h1>
        <FaBars
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleMenuClick}
        />
      </div>

      <p className="text-center text-lg md:text-xl font-bold text-gray-700 mb-1">
        Choose a HLP
      </p>
      {/* Pillars Section */}
      <h2 className="mt-4 text-xl font-semibold text-center">Pillar HLP’s</h2>
      <div className="flex flex-row-2 md:flex-row-4 justify-center gap-3 mt-3 px-4">
        {pillars.map((pillarId) => (
          <div
            key={pillarId}
            className={`text-white ${color} p-6 w-full md:w-40 text-center rounded-lg shadow-lg cursor-pointer hover:${getDarkerShade(color)} transition`}
            onClick={() => handleClick(pillarId)}
          >
            <strong className="text-xl">HLP {pillarId}</strong>
            <p>{HLP_LookFors[pillarId].title}</p>
          </div>
        ))}
      </div>

      {/* Embedded HLPs Section */}
      <h2 className="mt-4 text-xl font-semibold text-center">Embedded HLP’s</h2>
      <div className="flex flex-row-6 md:flex-row-4 justify-center gap-3 mt-3 px-4">
        {embedded.map((embeddedId) => (
          <div
            key={embeddedId}
            className={`${color} text-white p-4 w-full md:w-48 text-center rounded-lg shadow-lg cursor-pointer hover:${getDarkerShade(color)} transition`}
            onClick={() => handleClick(embeddedId)}
          >
            <strong className="text-xl">HLP {embeddedId}</strong>
            <p>{HLP_LookFors[embeddedId]?.title}</p>
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
