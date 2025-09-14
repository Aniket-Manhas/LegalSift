import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/login.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import Signup from "./Pages/signup.jsx";
import LawyerSignup from "./Pages/lawyersignup.jsx";
import LawyerDashboard from "./Pages/lawyerdashboard.jsx";
import Services from "./components/services.jsx";
import ContactLawyer from "./Pages/contactlawyer.jsx";
import Settings from "./Pages/setting.jsx"; // ✅ Import Settings page

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root (/) to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login & Signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lawyersignup" element={<LawyerSignup />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lawyerdashboard" element={<LawyerDashboard />} />

        {/* Other Pages */}
        <Route path="/services" element={<Services />} />
        <Route path="/contactlawyer" element={<ContactLawyer />} />
        <Route path="/settings" element={<Settings />} /> {/* ✅ Added Settings page */}
      </Routes>
    </Router>
  );
}

export default App;
