import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Pages/login.jsx";
import Signup from "./Pages/signup.jsx";
import LawyerSignup from "./Pages/lawyersignup.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import LawyerDashboard from "./Pages/lawyerdashboard.jsx";
import Services from "./components/services.jsx";
import ContactLawyer from "./Pages/contactlawyer.jsx";
import Settings from "./Pages/setting.jsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lawyersignup" element={<LawyerSignup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lawyerdashboard"
            element={
              <ProtectedRoute allowedRoles={["lawyer"]}>
                <LawyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute allowedRoles={["user", "lawyer"]}>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactlawyer"
            element={
              <ProtectedRoute allowedRoles={["user", "lawyer"]}>
                <ContactLawyer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["user", "lawyer"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for unknown URLs */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
