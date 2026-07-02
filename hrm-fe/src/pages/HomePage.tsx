import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  House,
  LogOut,
  Plane,
  Settings,
  UserRound,
} from "lucide-react";
import { AppSettings } from "../types/settings";

type HomePageProps = {
  settings: AppSettings;
  onLogout: () => void;
};

const copy = {
  en: {
    home: "Home",
    schedule: "Schedule",
    documents: "Documents",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    portal: "Employee portal",
    eyebrow: "Employee Home",
    welcome: "Welcome back, Maya Chen",
    intro: "Your personal workspace for schedule, leave, payroll, and HR requests.",
    attendance: "Check-in",
    present: "08:54",
    checkedIn: "",
    leaveBalance: "Leave Balance",
    leaveAvailable: "",
    checkout: "Check-out",
    checkoutTime: "18:00",
    checkoutStatus: "",
    todayScheduleCard: "Overtime Hours",
    eventsCount: "8.5h",
    nextEvent: "",
    todaySchedule: "Today Schedule",
    scheduleHelp: "Meetings and HR reminders for your workday.",
    quickActions: "Quick Actions",
    quickHelp: "Common employee self-service tasks.",
    signOutTitle: "Sign out of employee portal?",
    signOutHelp: "You will return to the login screen and leave your employee home.",
    cancel: "Cancel",
    signOut: "Sign Out",
  },
  vi: {
    home: "Trang chủ",
    schedule: "Lịch làm việc",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    portal: "Cổng nhân viên",
    eyebrow: "Trang chủ nhân viên",
    welcome: "Chào mừng trở lại, Maya Chen",
    intro: "Không gian cá nhân cho lịch làm việc, nghỉ phép, bảng lương và yêu cầu HR.",
    attendance: "Check-in",
    present: "08:54",
    checkedIn: "",
    checkout: "Check-out",
    checkoutTime: "18:00",
    checkoutStatus: "",
    leaveBalance: "Ngày phép",
    leaveAvailable: "",
    todayScheduleCard: "Số giờ tăng ca",
    eventsCount: "8.5h",
    nextEvent: "",
    todaySchedule: "Lịch hôm nay",
    scheduleHelp: "Cuộc họp và nhắc việc HR trong ngày.",
    quickActions: "Thao tác nhanh",
    quickHelp: "Các tác vụ tự phục vụ thường dùng.",
    signOutTitle: "Đăng xuất khỏi cổng nhân viên?",
    signOutHelp: "Bạn sẽ quay lại màn hình đăng nhập.",
    cancel: "Hủy",
    signOut: "Đăng xuất",
  },
};

const scheduleItems = [
  { time: "09:00", title: "Daily team sync", detail: "Product Experience team" },
  { time: "11:30", title: "Performance check-in", detail: "With Sophia Patel" },
  { time: "15:00", title: "Design review", detail: "Q3 onboarding flow" },
];

const actionItems = [
  { label: "Request Leave", value: "12 days available", icon: Plane },
  { label: "View Payslip", value: "June payroll ready", icon: FileText },
  { label: "Update Profile", value: "2 fields missing", icon: UserRound },
];

export function HomePage({ settings, onLogout }: HomePageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const t = copy[settings.language];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>Employee Portal</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Employee navigation">
          <Link className="nav-item active" to="/home">
            <House size={18} />
            {t.home}
          </Link>
          <Link className="nav-item" to="/schedule">
            <CalendarDays size={18} />
            {t.schedule}
          </Link>
          <Link className="nav-item" to="/home">
            <UserRound size={18} />
            {t.profile}
          </Link>
          <Link className="nav-item" to="/settings">
            <Settings size={18} />
            {t.settings}
          </Link>
          <button className="nav-item nav-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
            <LogOut size={18} />
            {t.logout}
          </button>
        </nav>
      </aside>

      <main className="main-content user-home">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.portal}</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" type="button">
              <Bell size={19} />
            </button>
            <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
              <LogOut size={17} />
              {t.logout}
            </button>
          </div>
        </header>

        <section className="user-hero">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.welcome}</h1>
            <p>{t.intro}</p>
          </div>
          <div className="profile-summary">
            <div className="avatar large-avatar">MC</div>
            <div>
              <strong>Product Designer</strong>
              <span>Experience Team</span>
            </div>
          </div>
        </section>

      <section className="user-metric-grid" aria-label="Employee overview">
        <article className="metric-card">
          <div className="metric-icon">
            <CheckCircle2 size={20} />
          </div>
          <p>{t.attendance}</p>
          <strong>{t.present}</strong>
          {t.checkedIn && <span>{t.checkedIn}</span>}
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <LogOut size={20} style={{ transform: "rotate(180deg)" }} />
          </div>
          <p>{t.checkout}</p>
          <strong>{t.checkoutTime}</strong>
          {t.checkoutStatus && <span>{t.checkoutStatus}</span>}
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <Plane size={20} />
          </div>
          <p>{t.leaveBalance}</p>
          <strong>12d</strong>
          {t.leaveAvailable && <span>{t.leaveAvailable}</span>}
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <CalendarDays size={20} />
          </div>
          <p>{t.todayScheduleCard}</p>
          <strong>{t.eventsCount}</strong>
          {t.nextEvent && <span>{t.nextEvent}</span>}
        </article>
      </section>

      <section className="user-content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.todaySchedule}</h2>
              <p>{t.scheduleHelp}</p>
            </div>
            <CalendarDays size={20} />
          </div>
          <div className="schedule-list">
            {scheduleItems.map((item) => (
              <article className="schedule-item" key={item.title}>
                <time>{item.time}</time>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>{t.quickActions}</h2>
              <p>{t.quickHelp}</p>
            </div>
            <Clock3 size={20} />
          </div>
          <div className="quick-action-list">
            {actionItems.map((item) => {
              const Icon = item.icon;

              return (
                <button className="quick-action" key={item.label} type="button">
                  <span className="metric-icon">
                    <Icon size={19} />
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.value}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      {isLogoutConfirmOpen ? (
        <div className="confirm-backdrop" role="presentation">
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="home-logout-title">
            <div className="logout-icon">
              <LogOut size={24} />
            </div>
            <div>
              <h2 id="home-logout-title">{t.signOutTitle}</h2>
              <p>{t.signOutHelp}</p>
            </div>
            <div className="confirm-actions">
              <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(false)} type="button">
                {t.cancel}
              </button>
              <button className="primary-button" onClick={onLogout} type="button">
                <LogOut size={18} />
                {t.signOut}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      </main>
    </div>
  );
}
