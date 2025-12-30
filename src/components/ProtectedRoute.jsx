import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const sessionData = JSON.parse(localStorage.getItem("user_session"));

  // 1. If no session exists, send to login
  if (!sessionData || !sessionData.token) {
    return <Navigate to="/" replace />;
  }

  // 2. If role doesn't match exactly, send to an unauthorized page or back to login
  if (sessionData.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
