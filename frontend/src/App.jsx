import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntryForm from "./EntryForm";
import AdminPage from "./dashboard/adminpanel";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page (Default Route) */}
        <Route path="/" element={<EntryForm />} />
        
        {/* Dashboard Page */}
        <Route path="/dashboard" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
