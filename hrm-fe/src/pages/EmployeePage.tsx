import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  Filter,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { getHomeOverview } from "../data/homeOverview";

type EmployeePageProps = {
  onLogout: () => void;
};

export function EmployeePage({ onLogout }: EmployeePageProps) {
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
          <Link className="nav-item" to="/dashboard">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link className="nav-item active" to="/employee">
            <Users size={18} />
            Employees
          </Link>
          <Link className="nav-item" to="/dashboard">
            <BriefcaseBusiness size={18} />
            Recruiting
          </Link>
          <Link className="nav-item" to="/schedule">
            <CalendarDays size={18} />
            Schedule
          </Link>
          <Link className="nav-item" to="/settings">
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
            <p className="eyebrow">Employee Management</p>
            <h1>Employees</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-field">
              <Search size={18} />
              <input aria-label="Search employees" placeholder="Search employees, teams..." />
            </label>
            <button className="icon-button" aria-label="Notifications" type="button">
              <Bell size={19} />
            </button>
            <Link className="primary-button link-button" to="/dashboard/new">
              <Plus size={18} />
              Add Employee
            </Link>
          </div>
        </header>

        <section className="toolbar" aria-label="Employee controls">
          <div className="segmented-control" role="tablist" aria-label="Employee status">
            <button className="selected">All</button>
            <button>Active</button>
            <button>Leave</button>
          </div>
          <div className="toolbar-actions">
            <button className="secondary-button" type="button">
              <Filter size={17} />
              Filter
            </button>
            <button className="secondary-button" type="button">
              <Download size={17} />
              Export
            </button>
          </div>
        </section>

        <section className="panel employee-directory-panel">
          <div className="panel-header">
            <div>
              <h2>Employee Directory</h2>
              <p>All employee profiles, teams, roles, and employment status.</p>
            </div>
          </div>

          {isLoading || !data ? (
            <div className="loading-panel">Loading employees...</div>
          ) : (
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
          )}
        </section>
      </main>
    </div>
  );
}
