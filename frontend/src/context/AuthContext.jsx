import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(function () {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function login(userData, token) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  function updateUser(updatedData) {
    const updatedUser = {};

    const existingKeys = Object.keys(user);
    for (let i = 0; i < existingKeys.length; i++) {
      const key = existingKeys[i];
      updatedUser[key] = user[key];
    }

    const newKeys = Object.keys(updatedData);
    for (let i = 0; i < newKeys.length; i++) {
      const key = newKeys[i];
      updatedUser[key] = updatedData[key];
    }

    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
