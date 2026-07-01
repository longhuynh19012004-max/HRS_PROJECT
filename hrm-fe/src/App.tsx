import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

type UserRole = "admin" | "user";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>("user");
  const navigate = useNavigate();

  const getAuthenticatedPath = (userRole: UserRole) => (userRole === "admin" ? "/dashboard" : "/home");

  const handleLogin = (email: string) => {
    const nextRole: UserRole = email.trim().toLowerCase() === "admin@peopleops.com" ? "admin" : "user";

    setRole(nextRole);
    setIsAuthenticated(true);
    navigate(getAuthenticatedPath(nextRole));
  };

  const handleRegister = () => {
    setRole("user");
    setIsAuthenticated(true);
    navigate("/home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole("user");
    navigate("/login");
  };

  const authenticatedPath = getAuthenticatedPath(role);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate replace to={isAuthenticated ? authenticatedPath : "/login"} />}
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate replace to={authenticatedPath} /> : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate replace to={authenticatedPath} />
          ) : (
            <RegisterPage onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="/home"
        element={
          isAuthenticated ? (
            <HomePage onLogout={handleLogout} />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated && role === "admin" ? (
            <DashboardPage onLogout={handleLogout} />
          ) : isAuthenticated ? (
            <Navigate replace to="/home" />
          ) : (
            <Navigate replace to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
