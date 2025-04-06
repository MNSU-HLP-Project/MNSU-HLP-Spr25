import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Auth from "./Pages/Login";
import MainMenu from "./dashboard/MainMenu";
import HLPCategories from "./Components/HLPCategories";
import Register from "./Pages/Register.jsx";
import HLPSelection from "./Components/HLPSelection";
import "./global.css"; // Import styles
import StudentDetailsPage from "./students/page";
import SupervisorClassView from "./dashboard/supervisor/SupervisorClassView";

const PreLoader = ({ isVisible }) => {
  return (
    <div className={`preloader-container ${isVisible ? "" : "fade-out"}`}>
      <div className="wave-background"></div>
      <div className="loader-container">
        <div className="loader-text">TeachTrack</div>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // Handles preloader fade-out

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true); // Start fade-out transition
      setTimeout(() => {
        setLoading(false); // Unmount preloader AFTER transition
      }, 300); // Keep this short (fade-out timing)
    }, 1200); // Display loader for 1.2s (adjust as needed)
  }, []);

  return (
    <>
      {loading ? <PreLoader isVisible={!fadeOut} /> : null}
      <div className={`app-container ${loading ? "hidden" : "visible"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mainmenu/" element={<MainMenu />} />
          <Route path="/hlpcategories/" element={<HLPCategories />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/hlpselection/" element={<HLPSelection />} />
          <Route path="/classes/" element={<SupervisorClassView />} />
          <Route path="/students/" element={<StudentDetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
