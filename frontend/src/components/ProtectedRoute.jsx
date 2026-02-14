import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = sessionStorage.getItem("token");

  // If no token and no user in context, redirect to login
  if (!token && !user) {
    return <Navigate to="/" replace />;
  }

  // If token exists, show the page
  return children;
};

export default ProtectedRoute;
