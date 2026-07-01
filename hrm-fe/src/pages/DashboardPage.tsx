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
import { getHomeOverview } from "../data/homeOverview";


const iconMap = {
  people: Users,
  time: Clock3,
  payroll: CircleDollarSign,
  retention: ShieldCheck,
};

type DashboardPageProps = {
  onLogout: () => void;
};

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["home-overview"],
    queryFn: getHomeOverview,
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
          <Link className="nav-item" to="/dashboard">
            <BriefcaseBusiness size={18} />
            Recruiting
          </Link>
          <Link className="nav-item" to="/dashboard">
            <CalendarDays size={18} />
            Schedule
          </Link>
          <Link className="nav-item" to="/dashboard">
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
            <h1>Good morning, Olivia</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-field">
              <Search size={18} />
              <input aria-label="Search employees" placeholder="Search employees, teams..." />
            </label>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
              <LogOut size={17} />
              Logout
            </button>
            <Link className="primary-button link-button" to="/dashboard/new">
              <Plus size={18} />
              Add Employee
            </Link>
          </div>
        </header>

        <section className="toolbar" aria-label="Dashboard controls">
          <div className="segmented-control" role="tablist" aria-label="Date range">
            <button className="selected">Week</button>
            <button>Month</button>
            <button>Quarter</button>
          </div>
          <div className="toolbar-actions">
            <button className="secondary-button">
              <Filter size={17} />
              Filter
            </button>
            <button className="secondary-button">
              <Download size={17} />
              Export
            </button>
          </div>
        </section>

        {isLoading || !data ? (
          <div className="loading-panel">Loading workforce overview...</div>
        ) : (
          <>
            <section className="metric-grid" aria-label="Key metrics">
              {data.metrics.map((metric) => {
                const Icon = iconMap[metric.icon];

                return (
                  <article className="metric-card" key={metric.label}>
                    <div className="metric-icon">
                      <Icon size={20} />
                    </div>
                    <p>{metric.label}</p>
                    <strong>{metric.value}</strong>
                    <span>
                      <TrendingUp size={15} />
                      {metric.trend}
                    </span>
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
                  {data.employees.map((employee) => (
                    <div className="table-row" role="row" key={employee.name}>
                      <span className="employee-cell">
                        <span className="avatar">{employee.initials}</span>
                        {employee.name}
                      </span>
                      <span>{employee.role}</span>
                      <span>{employee.team}</span>
                      <span>
                        <span className={`status-badge ${employee.status.toLowerCase()}`}>
                          {employee.status}
                        </span>
                      </span>
                    </div>
                  ))}
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
                  {data.activities.map((activity) => (
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
                {data.departments.map((department) => (
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
              <button className="primary-button" onClick={onLogout} type="button">
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
