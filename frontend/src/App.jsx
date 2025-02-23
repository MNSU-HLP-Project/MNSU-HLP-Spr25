import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Auth from "./Components/Auth"; // Updated import to the new component
import MainMenu from "./Components/MainMenu";
import HLPCategories from "./Components/HLPCategories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mainmenu/" element={<MainMenu />} />
      <Route path='/hlpcategories/' element={<HLPCategories />} />
    </Routes>
  );
}

export default App;
