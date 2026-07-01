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
import { AppSettings } from "../types/settings";


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

const copy = {
  en: {
    dashboard: "Dashboard",
    employees: "Employees",
    recruiting: "Recruiting",
    schedule: "Schedule",
    settings: "Settings",
    logout: "Logout",
    eyebrow: "Employee Management",
    greeting: "Good morning, Olivia",
    search: "Search employees, teams...",
    addEmployee: "Add Employee",
    filter: "Filter",
    export: "Export",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    directory: "Employee Directory",
    directoryHelp: "Recently updated profiles and employment status.",
    today: "Today",
    todayHelp: "Operational signals for HR teams.",
    department: "Department Overview",
    departmentHelp: "Headcount, hiring needs, and current payroll allocation.",
    signOutTitle: "Sign out of admin dashboard?",
    signOutHelp: "You will return to the login screen and leave the admin workspace.",
    cancel: "Cancel",
    signOut: "Sign Out",
  },
  vi: {
    dashboard: "Bảng điều khiển",
    employees: "Nhân viên",
    recruiting: "Tuyển dụng",
    schedule: "Lịch làm việc",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    eyebrow: "Quản lý nhân viên",
    greeting: "Chào buổi sáng, Olivia",
    search: "Tìm nhân viên, phòng ban...",
    addEmployee: "Thêm nhân viên",
    filter: "Lọc",
    export: "Xuất file",
    week: "Tuần",
    month: "Tháng",
    quarter: "Quý",
    directory: "Danh sách nhân viên",
    directoryHelp: "Hồ sơ được cập nhật gần đây và trạng thái làm việc.",
    today: "Hôm nay",
    todayHelp: "Tín hiệu vận hành cho đội ngũ HR.",
    department: "Tổng quan phòng ban",
    departmentHelp: "Số lượng nhân sự, nhu cầu tuyển dụng và phân bổ lương.",
    signOutTitle: "Đăng xuất khỏi dashboard admin?",
    signOutHelp: "Bạn sẽ quay lại màn hình đăng nhập và rời workspace admin.",
    cancel: "Hủy",
    signOut: "Đăng xuất",
  },
};

export function DashboardPage({ settings, onLogout }: DashboardPageProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const t = copy[settings.language];
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
            {t.dashboard}
          </Link>
          <Link className="nav-item" to="/employee">
            <Users size={18} />
            {t.employees}
          </Link>
          <Link className="nav-item" to="/dashboard">
            <BriefcaseBusiness size={18} />
            {t.recruiting}
          </Link>
          <Link className="nav-item" to="/dashboard">
            <CalendarDays size={18} />
            {t.schedule}
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

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.greeting}</h1>
          </div>

          <div className="topbar-actions">
            <label className="search-field">
              <Search size={18} />
              <input aria-label={t.search} placeholder={t.search} />
            </label>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="secondary-button" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
              <LogOut size={17} />
              {t.logout}
            </button>
            <Link className="primary-button link-button" to="/dashboard/new">
              <Plus size={18} />
              {t.addEmployee}
            </Link>
          </div>
        </header>

        <section className="toolbar" aria-label="Dashboard controls">
          <div className="segmented-control" role="tablist" aria-label="Date range">
            <button className="selected">{t.week}</button>
            <button>{t.month}</button>
            <button>{t.quarter}</button>
          </div>
          <div className="toolbar-actions">
            <button className="secondary-button">
              <Filter size={17} />
              {t.filter}
            </button>
            <button className="secondary-button">
              <Download size={17} />
              {t.export}
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
                    <h2>{t.directory}</h2>
                    <p>{t.directoryHelp}</p>
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
                    <h2>{t.today}</h2>
                    <p>{t.todayHelp}</p>
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
                  <h2>{t.department}</h2>
                  <p>{t.departmentHelp}</p>
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
              <h2 id="dashboard-logout-title">{t.signOutTitle}</h2>
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
    </div>
  );
}
