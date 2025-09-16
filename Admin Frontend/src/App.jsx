import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import Footer from "./component/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import LawyerManagement from "./pages/Lawyers";
import UserAccounts from "./pages/UserAccounts";
import PaymentsRevenue from "./pages/PaymentsRevenue";
import SupportPanel from "./pages/SupportPanel";
// You can later add Consultations, Disputes, Settings, Notifications pages

function DashboardLayout() {
  return (
    <div className="app">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <div className="content">
          <Outlet /> {/* Nested routes render here */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Redirect root '/' to '/dashboard' */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Layout with nested routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="lawyers" element={<LawyerManagement />} />
          <Route path="users" element={<UserAccounts />} />
          <Route path="payments" element={<PaymentsRevenue />} />
          <Route path="support" element={<SupportPanel />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
