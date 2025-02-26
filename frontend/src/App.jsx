import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Auth from "./Components/Login"; // Updated import to the new component
import MainMenu from "./Components/MainMenu";
import HLPCategories from "./Components/HLPCategories";
import StudentRegister from "./Components/StudentReg";
import InviteLink from "./Components/InviteLink";
import Collaboration from "./Components/HLP Pages/CollaborationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mainmenu/" element={<MainMenu />} />
      <Route path='/hlpcategories/' element={<HLPCategories />} />
      <Route path='/register/' element={<StudentRegister />} />
      <Route path='/link/' element={<InviteLink />} />
      <Route path='/collaboration/' element={<Collaboration />} />
    </Routes>
  );
}

export default App;
