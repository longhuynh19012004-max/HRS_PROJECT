import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Filter,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppSettings } from "../types/settings";
import { NotificationBell } from "../components/NotificationBell";
import axiosClient from "../api/axiosClient";

const iconMap = {
  people: Users,
  time: Clock3,
  payroll: CircleDollarSign,
  retention: ShieldCheck,
};

type DashboardPageProps = {
  settings: AppSettings;
  onLogout: () => void;
};


export function DashboardPage({ settings, onLogout }: DashboardPageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { data: overviewData, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["home-overview"],
    queryFn: async () => {
      const res = await axiosClient.get("/dashboard/overview");
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: realUsers, isLoading: isUsersLoading, isError: isUsersError } = useQuery({
    queryKey: ["real-users"],
    queryFn: async () => {
      const response = await axiosClient.get("/users");
      return response.data;
    },
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>Workforce Suite</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">

          <Link className="nav-item active" to="/dashboard">
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

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Employee Management</p>
            <h1>Good morning, Admin</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-field">
              <Search size={18} />
              <input aria-label="Search employees, teams..." placeholder="Search employees, teams..." />
            </label>
            <NotificationBell />
            <Link className="primary-button link-button" to="/dashboard/new">
              <Plus size={18} />
              Add Employee
            </Link>
          </div>
        </header>

        {isOverviewLoading || !overviewData ? (
          <div className="loading-panel">Loading workforce overview...</div>
        ) : (
          <>
            <section className="metric-grid" aria-label="Key metrics">
              {overviewData.metrics.map((metric) => {
                const Icon = iconMap[metric.icon as keyof typeof iconMap];
                return (
                  <article className="metric-card" key={metric.label}>
                    <div className="metric-icon">
                      <Icon size={20} />
                    </div>
                    <p>{metric.label}</p>
                    <strong>{metric.value}</strong>
                    {metric.trend && (
                      <span>
                        <TrendingUp size={15} />
                        {metric.trend}
                      </span>
                    )}
                  </article>
                );
              })}
            </section>

            <section className="dashboard-grid">
              <div className="panel employee-panel">
                <div className="panel-header">
                  <div>
                    <h2>Employee Directory</h2>
                    <p>Recently updated profiles and employment status.</p>
                  </div>
                  <button className="ghost-button">
                    Active
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="employee-table" role="table" aria-label="Employee directory">
                  <div className="table-row table-head" role="row">
                    <span>Employee</span>
                    <span>Role</span>
                    <span>Team</span>
                    <span>Status</span>
                  </div>

                  { }
                  {isUsersLoading && <div style={{ padding: 16 }}>Loading employee list...</div>}
                  {isUsersError && <div style={{ padding: 16, color: 'red' }}>Error loading data! Ensure you are an Admin and Token is valid.</div>}

                  {!isUsersLoading && !isUsersError && realUsers?.map((account: any) => {
                    const emp = account.employee || {};
                    const fullName = `${emp.firstName || 'New'} ${emp.lastName || 'Employee'}`.trim();
                    const initials = `${emp.firstName?.[0] || 'N'}${emp.lastName?.[0] || 'E'}`;
                    const status = emp.status || 'active';

                    return (
                      <div className="table-row" role="row" key={account.id}>
                        <span className="employee-cell">
                          <span className="avatar">{initials}</span>
                          <div>
                            <div>{fullName}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{account.email}</div>
                          </div>
                        </span>
                        <span>{emp.position || 'Not updated'}</span>
                        <span>{emp.department || 'Not assigned'}</span>
                        <span>
                          <span className={`status-badge ${status.toLowerCase()}`}>
                            {status}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel activity-panel">
                <div className="panel-header">
                  <div>
                    <h2>Today</h2>
                    <p>Operational signals for HR teams.</p>
                  </div>
                </div>
                <div className="activity-list">
                  {overviewData.activities.map((activity) => (
                    <article className="activity-item" key={activity.title}>
                      <time>{activity.time}</time>
                      <div>
                        <strong>{activity.title}</strong>
                        <p>{activity.detail}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel department-panel">
              <div className="panel-header">
                <div>
                  <h2>Department Overview</h2>
                  <p>Headcount, hiring needs, and current payroll allocation.</p>
                </div>
              </div>
              <div className="department-grid">
                {overviewData.departments.map((department) => (
                  <article className="department-card" key={department.name}>
                    <div>
                      <h3>{department.name}</h3>
                      <p>{department.headcount} employees</p>
                    </div>
                    <div className="department-meta">
                      <span>{department.openings} open roles</span>
                      <strong>{department.budget}</strong>
                    </div>
                    <div className="progress-track" aria-hidden="true">
                      <span style={{ width: `${Math.min(department.headcount, 90)}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ... (Keep Confirm Logout Dialog intact) ... */}
      {isLogoutConfirmOpen ? (
        <div className="confirm-backdrop" role="presentation">
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="dashboard-logout-title">
            <div className="logout-icon">
              <LogOut size={24} />
            </div>
            <div>
              <h2 id="dashboard-logout-title">Sign out of admin dashboard?</h2>
              <p>You will return to the login screen and leave the admin workspace.</p>
            </div>
            <div className="confirm-actions">
              <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(false)} type="button">
                Cancel
              </button>
              <button className="primary-button" onClick={() => {
                localStorage.removeItem('access_token');
                onLogout();
              }} type="button">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}