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
import { NotificationBell } from "../components/NotificationBell";

type SettingsPageProps = {
  role: "admin" | "user";
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  onLogout: () => void;
};

export function SettingsPage({ role, settings, onChangeSettings, onLogout }: SettingsPageProps) {
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
                Dashboard
              </Link>
              <Link className="nav-item" to="/employee">
                <Users size={18} />
                Employees
              </Link>
              <Link className="nav-item" to="/schedule">
                <CalendarDays size={18} />
                Schedule
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-item" to="/home">
                <House size={18} />
                Home
              </Link>
              <Link className="nav-item" to="/schedule">
                <CalendarDays size={18} />
                Schedule
              </Link>
              <Link className="nav-item" to="/profile">
                <UserRound size={18} />
                Profile
              </Link>
            </>
          )}
          <Link className="nav-item active" to="/settings">
            <Settings size={18} />
            Settings
          </Link>
          <button className="nav-item nav-button" onClick={onLogout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Workspace Preferences</p>
            <h1>Settings</h1>
          </div>
          <div className="topbar-actions">
            <NotificationBell />
          </div>
        </header>

        <section className="settings-grid">
          <article className="panel settings-panel">
            <div className="settings-icon">
              {settings.theme === "dark" ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div>
              <h2>Appearance</h2>
              <p>Switch between light and dark mode.</p>
            </div>
            <div className="segmented-control settings-segment" role="tablist" aria-label="Appearance">
              <button
                className={settings.theme === "light" ? "selected" : ""}
                onClick={() => updateTheme("light")}
                type="button"
              >
                Light
              </button>
              <button
                className={settings.theme === "dark" ? "selected" : ""}
                onClick={() => updateTheme("dark")}
                type="button"
              >
                Dark
              </button>
            </div>
          </article>


        </section>
      </main>
    </div>
  );
}
