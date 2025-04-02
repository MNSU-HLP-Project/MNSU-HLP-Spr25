import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import MainMenu from "./Components/MainMenu";
import HLPCategories from "./Components/HLPCategories";
import StudentRegister from "./Components/StudentReg";
import AdminPage from "./dashboard/adminpanel";
import HLPSelection from "./Components/HLPSelection";
import EditOrg from "./Components/EditOrg";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mainmenu/" element={<MainMenu />} />
      <Route path='/hlpcategories/' element={<HLPCategories />} />
      <Route path='/register/' element={<StudentRegister />} />
      <Route path='/dashboard/' element = {<AdminPage/>}/>
      <Route path='/hlpselection/' element={<HLPSelection />} />
      <Route path='/edit_organization/' element={<EditOrg />} />
    </Routes>
  );
}

export default App;
