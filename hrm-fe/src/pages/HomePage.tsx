import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  Plane,
  UserRound,
} from "lucide-react";

type HomePageProps = {
  onLogout: () => void;
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

export function HomePage({ onLogout }: HomePageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  return (
    <main className="user-home">
      <header className="user-topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>Employee Portal</span>
          </div>
        </div>
        <div className="user-actions">
          <button className="icon-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <section className="user-hero">
        <div>
          <p className="eyebrow">Employee Home</p>
          <h1>Welcome back, Maya Chen</h1>
          <p>Your personal workspace for schedule, leave, payroll, and HR requests.</p>
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
          <p>Attendance</p>
          <strong>Present</strong>
          <span>Checked in at 08:54</span>
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <Plane size={20} />
          </div>
          <p>Leave Balance</p>
          <strong>12d</strong>
          <span>Annual leave available</span>
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <FileText size={20} />
          </div>
          <p>Documents</p>
          <strong>3</strong>
          <span>Need acknowledgement</span>
        </article>
      </section>

      <section className="user-content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Today Schedule</h2>
              <p>Meetings and HR reminders for your workday.</p>
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
              <h2>Quick Actions</h2>
              <p>Common employee self-service tasks.</p>
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
              <h2 id="home-logout-title">Sign out of employee portal?</h2>
              <p>You will return to the login screen and leave your employee home.</p>
            </div>
            <div className="confirm-actions">
              <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(false)} type="button">
                Cancel
              </button>
              <button className="primary-button" onClick={onLogout} type="button">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
