import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AddEmployeePage } from "./pages/AddEmployeePage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeePage } from "./pages/EmployeePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SchedulePage } from "./pages/SchedulePage";
import { SettingsPage } from "./pages/SettingsPage";
import { AppSettings } from "./types/settings";

type UserRole = "admin" | "user";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>("user");
  const [settings, setSettings] = useState<AppSettings>({ language: "en", theme: "light" });
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
    <div className={`app-root theme-${settings.theme}`}>
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
              <HomePage settings={settings} onLogout={handleLogout} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && role === "admin" ? (
              <DashboardPage settings={settings} onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/new"
          element={
            isAuthenticated && role === "admin" ? (
              <AddEmployeePage onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/employee"
          element={
            isAuthenticated && role === "admin" ? (
              <EmployeePage onLogout={handleLogout} />
            ) : isAuthenticated ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <SettingsPage
                role={role}
                settings={settings}
                onChangeSettings={setSettings}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/schedule"
          element={
            isAuthenticated ? (
              <SchedulePage role={role} settings={settings} onLogout={handleLogout} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}
