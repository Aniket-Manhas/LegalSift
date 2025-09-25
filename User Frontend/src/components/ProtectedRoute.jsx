import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If allowedRoles is defined and user role is not in it
  if (allowedRoles.length && !allowedRoles.includes(role))
    return <Navigate to="/login" replace />;

  return children;
}
