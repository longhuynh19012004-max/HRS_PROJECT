import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AddEmployeePage } from "./pages/AddEmployeePage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeePage } from "./pages/EmployeePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { SchedulePage } from "./pages/SchedulePage";
import { SettingsPage } from "./pages/SettingsPage";
import { AppSettings } from "./types/settings";

type UserRole = "admin" | "user";

function ScrollToTop() {
  const { pathname } = useLocation();

  useQuery({
    queryKey: ["scroll-to-top", pathname],
    queryFn: () => {
      window.scrollTo(0, 0);
      return null;
    },
  });

  return null;
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem("role") as UserRole) || "user");
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { language: "en", theme: "light" };
  });
  const navigate = useNavigate();

  // 🕵️ TỰ ĐỘNG GIỮ ĐĂNG NHẬP KHI REFRESH (F5) TRANG
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        // Đọc trường dữ liệu systemRole từ cấu hình trong jwt.strategy.ts của Backend
        const tokenRole: UserRole = decodedPayload.systemRole === "admin" ? "admin" : "user";
        
        setRole(tokenRole);
        setIsAuthenticated(true);
      } catch (e) {
        // Token lỗi hoặc hết hạn thì dọn dẹp bộ nhớ
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const getAuthenticatedPath = (userRole: UserRole) => (userRole === "admin" ? "/dashboard" : "/home");

  // Nhận dữ liệu phân quyền thực tế từ màn hình Login truyền sang
  const handleLogin = (email: string, tokenRole: UserRole) => {
    setRole(tokenRole);
    setIsAuthenticated(true);
    navigate(getAuthenticatedPath(tokenRole));
  };

  const handleRegister = () => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", "user");
    setRole("user");
    setIsAuthenticated(true);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Xóa sạch token khi người dùng bấm đăng xuất
    setIsAuthenticated(false);
    setRole("user");
    navigate("/login");
  };

  const updateSettings = (newSettings: AppSettings) => {
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const authenticatedPath = getAuthenticatedPath(role);

  return (
    <div className={`app-root theme-${settings.theme}`}>
      <ScrollToTop />
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
                onChangeSettings={updateSettings}
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
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage settings={settings} onLogout={handleLogout} />
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