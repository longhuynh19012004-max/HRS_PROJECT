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
import { EditEmployeePage } from "./pages/EditEmployeePage";

type UserRole = "admin" | "user";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("access_token"); 
  });

  // 🚀 SỬA TẠI ĐÂY: Hàm bóc tách quyền hạn siêu an toàn, không lo crash khi F5
  const [role, setRole] = useState<UserRole>(() => {
    // Bước 1: Ưu tiên lấy trực tiếp từ user_role đã lưu trong máy (Đưa về chữ thường)
    const storedRole = localStorage.getItem("user_role")?.toLowerCase();
    if (storedRole === "admin") return "admin";
    if (storedRole === "user") return "user";

    // Bước 2: Nếu không có cấu hình sẵn, tiến hành giải mã Token theo chuẩn Base64URL
    const token = localStorage.getItem("access_token");
    if (!token) return "user";
    try {
      const payloadBase64Url = token.split(".")[1];
      if (!payloadBase64Url) return "user";
      
      // Chuyển đổi ký tự chuẩn Base64URL sang Base64 thông thường và tự động bù thêm dấu "=" 
      const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
      
      const decodedPayload = JSON.parse(atob(padded));
      return decodedPayload.systemRole === "admin" ? "admin" : "user";
    } catch (e) {
      return "user"; // Thất bại hoàn toàn mới trả về user
    }
  });

  const [settings, setSettings] = useState<AppSettings>({ language: "en", theme: "light" });
  const navigate = useNavigate();

  // Đồng bộ kiểm tra token định kỳ hoặc khi load lại ứng dụng
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payloadBase64Url = token.split(".")[1];
        const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
        
        const decodedPayload = JSON.parse(atob(padded));
        const tokenRole: UserRole = decodedPayload.systemRole === "admin" ? "admin" : "user";
        
        setRole(tokenRole);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        setIsAuthenticated(false);
        setRole("user");
      }
    }
  }, []);

  const getAuthenticatedPath = (userRole: UserRole) => (userRole === "admin" ? "/dashboard" : "/home");

  const handleLogin = (email: string, tokenRole: UserRole) => {
    // Lưu chính xác chữ thường "admin" hoặc "user" vào bộ nhớ máy để bước useState bên trên đọc được
    localStorage.setItem("user_role", tokenRole); 

    setIsAuthenticated(true);
    setRole(tokenRole);
    
    navigate(getAuthenticatedPath(tokenRole));
  };

  const handleRegister = () => {
    localStorage.setItem("user_role", "user");
    setRole("user");
    setIsAuthenticated(true);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

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

        <Route
          path="/dashboard/edit/:id"
          element={
            isAuthenticated && role === "admin" ? (
              <EditEmployeePage onLogout={handleLogout} />
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