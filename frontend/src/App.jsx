import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Auth from "./Components/Login"; // Updated import to the new component
import MainMenu from "./Components/MainMenu";
import HLPCategories from "./Components/HLPCategories";
import StudentRegister from "./Components/StudentReg";
import AdminPage from "./dashboard/adminpanel";
import EntryForm from "./EntryForm";
import UserEntries from "./Components/UserEntries";
import EntryComments from "./Components/EntryComments";
import TeacherDashboard from "./Components/TeacherDashboard";
import TeacherComment from "./Components/TeacherComment";
import StudentProgress from "./Components/StudentProgress";

// import InviteLink from "./Components/InviteLink";
import HLPSelection from "./Components/HLPSelection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/mainmenu/" element={<MainMenu />} />
      <Route path='/hlpcategories/' element={<HLPCategories />} />
      <Route path='/register/' element={<StudentRegister />} />
      <Route path='/dashboard/' element = {<AdminPage/>}/>
      {/* <Route path='/link/' element={<InviteLink />} /> */}
      <Route path='/hlpselection/' element={<HLPSelection />} />
      <Route path='/entryform/' element={<EntryForm />} />
      <Route path='/my-entries/' element={<UserEntries />} />
      <Route path='/entry-comments/:entryId' element={<EntryComments />} />
      <Route path='/teacher-dashboard/' element={<TeacherDashboard />} />
      <Route path='/teacher-comment/:entryId' element={<TeacherComment />} />
      <Route path='/progress/' element={<StudentProgress />} />
    </Routes>
  );
}

export default App;
