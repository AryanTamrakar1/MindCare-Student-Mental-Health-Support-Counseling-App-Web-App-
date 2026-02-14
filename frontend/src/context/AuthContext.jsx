import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in when app loads
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login function
  const login = (userData, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
