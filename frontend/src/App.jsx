import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import EditOrg from "./dashboard/admin/EditOrg.jsx";
import MainMenu from "./dashboard/MainMenu";
import HLPCategories from "./dashboard/studentTeacher/HLPCategories.jsx";
import Register from "./Pages/Register.jsx";
import EmailVerification from "./Pages/EmailVerification.jsx";
import PasswordReset from "./Pages/PasswordReset.jsx";
import HLPSelection from "./dashboard/studentTeacher/HLPSelection.jsx";
import Resources from "./dashboard/studentTeacher/Resources.jsx";
import "./global.css"; // Import styles

import SupervisorClassView from "./dashboard/supervisor/SupervisorClassView.jsx";

// HLP Submission Workflow Components
import HLPReflectionForm from "./dashboard/studentTeacher/HLPReflectionForm.jsx";

import HLPReflectionList from "./dashboard/studentTeacher/CompletedLookfor.jsx";

import MyReflections from "./dashboard/studentTeacher/MyReflections.jsx";
import ReflectionDetail from "./dashboard/studentTeacher/ReflectionDetail.jsx";
import SupervisorReview from "./dashboard/supervisor/SupervisorReview.jsx";
import SupervisorFeedback from "./dashboard/supervisor/SupervisorFeedback.jsx";

// Protected Route Component
import ProtectedRoute from "./utils/ProtectedRoute";
import ClassGenerator from "./dashboard/components/shared/ClassGenerator.jsx";
import ClassEditor from "./dashboard/components/shared/ClassEditor.jsx";
import SupervisorClassEntries from "./dashboard/supervisor/SupervisorClassEntries.jsx";
import SupervisorStudents from "./dashboard/supervisor/SupervisorStudents.jsx";
import EntriesDisplay from "./dashboard/supervisor/EntriesDisplay.jsx";
import ReviewEntryDetails from "./dashboard/supervisor/ReviewEntryDetails.jsx";
import { Toaster } from "react-hot-toast";
 

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
      <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
    
              padding: '14px 20px',
            },
            success: {
              style: {
                background: '#e6fffa',  // light teal/green background
                color: '#0f766e',       // darker green text
      
              },
            },
            error: {
              style: {
                background: '#ffe6e6',  // light pink background
                color: '#b91c1c',       // dark red text
                border: '1px solid #b91c1c',
              },
            },
          }}
        />

        <Routes>
          <Route path="/edit-class/" element={<ClassEditor />} />
          <Route path="/edit-classes/" element={<ClassGenerator />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route
            path="/mainmenu/"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Student Teacher",
                  "Supervisor",
                  "Admin",
                  "Superuser",
                ]}
              >
                <MainMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/"
            element={
              <ProtectedRoute allowedRoles={["Supervisor"]}>
                <SupervisorClassView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hlpcategories/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <HLPCategories />
              </ProtectedRoute>
            }
          />
          <Route path="/register/" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route
            path="/hlpselection/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <HLPSelection />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/edit_organization/"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Superuser"]}>
                <EditOrg />
              </ProtectedRoute>
            }
          />

          {/* HLP Submission Workflow Routes */}
          {/* Student Routes */}
          <Route
            path="/submit-reflection/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <HLPReflectionForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/completed-lookfor/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                < HLPReflectionList/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reflections/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <MyReflections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reflection/:entryId"
            element={
              <ProtectedRoute allowedRoles={["Student Teacher"]}>
                <ReflectionDetail />
              </ProtectedRoute>
            }
          />
          

          {/* Supervisor Routes */}
          <Route
            path="/supervisor/review/:classId?"
            element={
              <ProtectedRoute allowedRoles={["Supervisor"]}>
                <SupervisorReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supervisor/feedback/:entryId"
            element={
              <ProtectedRoute allowedRoles={["Supervisor"]}>
                <SupervisorFeedback />
              </ProtectedRoute>
            }
          />
          <Route path="/supervisor/student-entries/:studentId" element={<EntriesDisplay/>} />
          <Route path="/entries/by-class/:classId" element={<SupervisorClassEntries/>} />
          <Route path = "/supervisor/students/:classId" element = {<SupervisorStudents/>}/>
          <Route path = "/review/entry/:entryId" element = {<ReviewEntryDetails/>}/>


          <Route path="/supervisor/feedback/:entryId" element={
            <ProtectedRoute allowedRoles={["Supervisor"]}>
              <SupervisorFeedback />
            </ProtectedRoute>
          } />

          {/* Keep the old route for backward compatibility */}
          <Route
            path="/review/:entryId"
            element={
              <ProtectedRoute allowedRoles={["Supervisor"]}>
                <SupervisorFeedback />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
