import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object
  const [role, setRole] = useState(null); // user role: "user" or "lawyer"
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on page load
  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // include cookie
      });

      if (!res.ok) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setRole(data.role); // ✅ store role
      }
    } catch (err) {
      console.error("Fetch user failed:", err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole); // ✅ pass role on login
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
