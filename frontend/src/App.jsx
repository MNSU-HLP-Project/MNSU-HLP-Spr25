import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth"; // Updated import to the new component

function App() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-4">Welcome to My App</h1>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* Unified Auth Page */}
      </Routes>
    </div>
  );
}

export default App;
