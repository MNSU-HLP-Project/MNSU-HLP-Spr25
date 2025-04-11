import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import EditOrg from "./Components/EditOrg.jsx";
import MainMenu from "./dashboard/MainMenu";
import HLPCategories from "./Components/HLPCategories";
import Register from "./Pages/Register.jsx";
import HLPSelection from "./Components/HLPSelection";
import "./global.css"; // Import styles
import StudentDetailsPage from "./students/page";
// Removed SupervisorClassView import

// HLP Submission Workflow Components
import HLPReflectionForm from "./Components/HLPReflectionForm";
import MyReflections from "./Components/MyReflections";
import ReflectionDetail from "./Components/ReflectionDetail";
import SupervisorReview from "./Components/SupervisorReview";
import SupervisorFeedback from "./Components/SupervisorFeedback";

// Protected Route Component
import ProtectedRoute from "./utils/ProtectedRoute";

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
          <Route path="/mainmenu/" element={
            <ProtectedRoute allowedRoles={["Student Teacher", "Supervisor", "Admin", "Superuser"]}>
              <MainMenu />
            </ProtectedRoute>
          } />
          <Route path="/hlpcategories/" element={
            <ProtectedRoute allowedRoles={["Student Teacher"]}>
              <HLPCategories />
            </ProtectedRoute>
          } />
          <Route path="/register/" element={<Register />} />
          <Route path="/hlpselection/" element={
            <ProtectedRoute allowedRoles={["Student Teacher"]}>
              <HLPSelection />
            </ProtectedRoute>
          } />
          {/* Removed class view route */}
          <Route path="/students/" element={
            <ProtectedRoute allowedRoles={["Supervisor", "Admin", "Superuser"]}>
              <StudentDetailsPage />
            </ProtectedRoute>
          } />
          <Route path='/edit_organization/' element={
            <ProtectedRoute allowedRoles={["Admin", "Superuser"]}>
              <EditOrg />
            </ProtectedRoute>
          } />

          {/* HLP Submission Workflow Routes */}
          {/* Student Routes */}
          <Route path="/submit-reflection/" element={
            <ProtectedRoute allowedRoles={["Student Teacher"]}>
              <HLPReflectionForm />
            </ProtectedRoute>
          } />
          <Route path="/reflections/" element={
            <ProtectedRoute allowedRoles={["Student Teacher"]}>
              <MyReflections />
            </ProtectedRoute>
          } />
          <Route path="/reflection/:entryId" element={
            <ProtectedRoute allowedRoles={["Student Teacher"]}>
              <ReflectionDetail />
            </ProtectedRoute>
          } />

          {/* Supervisor Routes */}
          <Route path="/supervisor/review/" element={
            <ProtectedRoute allowedRoles={["Supervisor"]}>
              <SupervisorReview />
            </ProtectedRoute>
          } />
          <Route path="/supervisor/feedback/:entryId" element={
            <ProtectedRoute allowedRoles={["Supervisor"]}>
              <SupervisorFeedback />
            </ProtectedRoute>
          } />

          {/* Keep the old route for backward compatibility */}
          <Route path="/review/:entryId" element={
            <ProtectedRoute allowedRoles={["Supervisor"]}>
              <SupervisorFeedback />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
