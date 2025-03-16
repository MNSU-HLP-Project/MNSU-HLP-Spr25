import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./Pages/LandingPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import MainMenu from './Components/MainMenu';
import HLPCategories from './Components/HLPCategories';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Remove the separate /auth route and redirect to home */}
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/mainmenu" element={
        <ProtectedRoute>
          <MainMenu />
        </ProtectedRoute>
      } />
      <Route path="/hlpcategories" element={
        <ProtectedRoute>
          <HLPCategories />
        </ProtectedRoute>
      } />
      <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/teacher-dashboard" element={
        <ProtectedRoute>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
