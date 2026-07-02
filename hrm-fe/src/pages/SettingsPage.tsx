import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  House,
  Languages,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import { AppLanguage, AppSettings, AppTheme } from "../types/settings";

type SettingsPageProps = {
  role: "admin" | "user";
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  onLogout: () => void;
};

const copy = {
  en: {
    dashboard: "Dashboard",
    employees: "Employees",
    recruiting: "Recruiting",
    schedule: "Schedule",
    documents: "Documents",
    profile: "Profile",
    home: "Home",
    settings: "Settings",
    logout: "Logout",
    title: "Settings",
    eyebrow: "Workspace Preferences",
    description: "Control how the portal looks and which language is used across your workspace.",
    appearance: "Appearance",
    appearanceHelp: "Switch between light and dark mode.",
    darkMode: "Dark mode",
    light: "Light",
    dark: "Dark",
    language: "Language",
    languageHelp: "Choose the display language for key screens.",
    english: "English",
    vietnamese: "Vietnamese",
  },
  vi: {
    dashboard: "Bảng điều khiển",
    employees: "Nhân viên",
    recruiting: "Tuyển dụng",
    schedule: "Lịch làm việc",
    documents: "Tài liệu",
    profile: "Hồ sơ",
    home: "Trang chủ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    title: "Cài đặt",
    eyebrow: "Tùy chỉnh giao diện",
    description: "Điều chỉnh giao diện và ngôn ngữ sử dụng trong workspace.",
    appearance: "Giao diện",
    appearanceHelp: "Chuyển giữa chế độ sáng và tối.",
    darkMode: "Chế độ tối",
    light: "Sáng",
    dark: "Tối",
    language: "Ngôn ngữ",
    languageHelp: "Chọn ngôn ngữ hiển thị cho các màn hình chính.",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
  },
};

export function SettingsPage({ role, settings, onChangeSettings, onLogout }: SettingsPageProps) {
  const t = copy[settings.language];
  const isAdmin = role === "admin";

  const updateTheme = (theme: AppTheme) => {
    onChangeSettings({ ...settings, theme });
  };

  const updateLanguage = (language: AppLanguage) => {
    onChangeSettings({ ...settings, language });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>{isAdmin ? "Workforce Suite" : "Employee Portal"}</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Settings navigation">
          {isAdmin ? (
            <>
              <Link className="nav-item" to="/dashboard">
                <LayoutDashboard size={18} />
                {t.dashboard}
              </Link>
              <Link className="nav-item" to="/employee">
                <Users size={18} />
                {t.employees}
              </Link>
              <Link className="nav-item" to="/schedule">
                <CalendarDays size={18} />
                {t.schedule}
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-item" to="/home">
                <House size={18} />
                {t.home}
              </Link>
              <Link className="nav-item" to="/schedule">
                <CalendarDays size={18} />
                {t.schedule}
              </Link>
              <Link className="nav-item" to="/profile">
                <UserRound size={18} />
                {t.profile}
              </Link>
            </>
          )}
          <Link className="nav-item active" to="/settings">
            <Settings size={18} />
            {t.settings}
          </Link>
          <button className="nav-item nav-button" onClick={onLogout} type="button">
            <LogOut size={18} />
            {t.logout}
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
          </div>
        </header>

        <section className="settings-grid">
          <article className="panel settings-panel">
            <div className="settings-icon">
              {settings.theme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div>
              <h2>{t.appearance}</h2>
              <p>{t.appearanceHelp}</p>
            </div>
            <div className="segmented-control settings-segment" role="tablist" aria-label={t.appearance}>
              <button
                className={settings.theme === "light" ? "selected" : ""}
                onClick={() => updateTheme("light")}
                type="button"
              >
                {t.light}
              </button>
              <button
                className={settings.theme === "dark" ? "selected" : ""}
                onClick={() => updateTheme("dark")}
                type="button"
              >
                {t.dark}
              </button>
            </div>
          </article>

          <article className="panel settings-panel">
            <div className="settings-icon">
              <Languages size={22} />
            </div>
            <div>
              <h2>{t.language}</h2>
              <p>{t.languageHelp}</p>
            </div>
            <div className="segmented-control settings-segment" role="tablist" aria-label={t.language}>
              <button
                className={settings.language === "en" ? "selected" : ""}
                onClick={() => updateLanguage("en")}
                type="button"
              >
                {t.english}
              </button>
              <button
                className={settings.language === "vi" ? "selected" : ""}
                onClick={() => updateLanguage("vi")}
                type="button"
              >
                {t.vietnamese}
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
