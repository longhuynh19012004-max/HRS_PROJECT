import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
import { NotificationBell } from "../components/NotificationBell";
import axiosClient from "../api/axiosClient";

type HomePageProps = {
  settings: AppSettings;
  onLogout: () => void;
};


const scheduleItems: { time: string; title: string; detail: string }[] = [];

const actionItems: { label: string; value: string; icon: typeof Plane }[] = [];

export function HomePage({ settings, onLogout }: HomePageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; position: string; department: string } | null>(null);
  useEffect(() => {
    axiosClient.get("/profile/me").then((res) => {
      setProfile(res.data.employee || null);
    }).catch(console.error);
  }, []);

  const { data: attendanceData } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await axiosClient.get("/attendance/today");
      return res.data;
    },
  });

  const checkinTime = attendanceData?.checkInTime || null;
  const checkoutTime = attendanceData?.checkOutTime || null;

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/attendance/check-in");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
      toast.success("Checked in successfully!");
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/attendance/check-out");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-today"] });
      toast.success("Checked out successfully!");
    },
  });

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Employee";
  const position = profile?.position || "Position";
  const department = profile?.department || "Department";
  const initials = profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() : "??";

  const handleCheckin = () => {
    if (!checkinTime) {
      checkInMutation.mutate();
    }
  };

  const handleCheckout = () => {
    if (checkinTime && !checkoutTime) {
      checkOutMutation.mutate();
    }
  };

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
          <Link className="nav-item" to="/settings">
            <Settings size={18} />
            Settings
          </Link>
          <button className="nav-item nav-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <main className="main-content user-home">
        <header className="topbar">
          <div>
            <p className="eyebrow">Employee Home</p>
            <h1>Employee portal</h1>
          </div>
          <div className="topbar-actions">
            <NotificationBell />
            <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        <section className="user-hero">
          <div>
            <p className="eyebrow">Employee Home</p>
            <h1>{"Welcome back, {name}".replace("{name}", fullName)}</h1>
            <p>Your personal workspace for schedule, leave, payroll, and HR requests.</p>
          </div>
          <div className="profile-summary">
            <div className="avatar large-avatar">{initials}</div>
            <div>
              <strong>{position}</strong>
              <span>{department}</span>
            </div>
          </div>
        </section>

      <section className="user-metric-grid" aria-label="Employee overview">
        <article
          className={`metric-card metric-card-action${checkinTime ? " metric-card-done" : ""}`}
          onClick={handleCheckin}
          role="button"
          tabIndex={0}
          style={{ cursor: checkinTime ? "default" : "pointer" }}
        >
          <div className="metric-icon">
            <CheckCircle2 size={20} />
          </div>
          <p>Check-in</p>
          <strong>{checkinTime || "--:--"}</strong>
          {!checkinTime && <span className="metric-card-hint">Tap to check in</span>}
          {checkinTime && <span className="metric-card-success">Checked in</span>}
        </article>
        <article
          className={`metric-card metric-card-action${checkoutTime ? " metric-card-done" : ""}${!checkinTime ? " metric-card-disabled" : ""}`}
          onClick={handleCheckout}
          role="button"
          tabIndex={0}
          style={{ cursor: !checkinTime || checkoutTime ? "default" : "pointer" }}
        >
          <div className="metric-icon">
            <LogOut size={20} style={{ transform: "rotate(180deg)" }} />
          </div>
          <p>Check-out</p>
          <strong>{checkoutTime || "--:--"}</strong>
          {!checkoutTime && !checkinTime && <span className="metric-card-hint">Check in first</span>}
          {!checkoutTime && checkinTime && <span className="metric-card-hint">Tap to check out</span>}
          {checkoutTime && <span className="metric-card-success">Checked out</span>}
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <Plane size={20} />
          </div>
          <p>Leave Balance</p>
          <strong>0d</strong>
          {"" && <span></span>}
        </article>
        <article className="metric-card">
          <div className="metric-icon">
            <CalendarDays size={20} />
          </div>
          <p>Overtime Hours</p>
          <strong>0h</strong>
          {"" && <span></span>}
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
    </div>
  );
}
