import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth"; // Updated import to the new component
import MainMenu from "./Components/MainMenu";

function App() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-4">Teach Track</h1>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* Unified Auth Page */}
        <Route path='/mainmenu/' element={<MainMenu />} />
      </Routes>
    </div>
  );
}

export default App;
