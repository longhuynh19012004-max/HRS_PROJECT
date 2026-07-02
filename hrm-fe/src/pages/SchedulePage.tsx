import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  House,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import { AppSettings } from "../types/settings";

type SchedulePageProps = {
  role: "admin" | "user";
  settings: AppSettings;
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
    eyebrow: "Work Calendar",
    title: "Schedule",
    today: "Today",
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekDaysFull: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    timeSlots: ["8:00 – 10:00", "10:00 – 12:00", "1:00 – 3:00", "3:00 – 5:00"],
    noEvents: "No events",
  },
  vi: {
    dashboard: "Bang dieu khien",
    employees: "Nhan vien",
    recruiting: "Tuyen dung",
    schedule: "Lich lam viec",
    documents: "Tai lieu",
    profile: "Ho so",
    home: "Trang chu",
    settings: "Cai dat",
    logout: "Dang xuat",
    eyebrow: "Lich cong viec",
    title: "Lich lam viec",
    today: "Hom nay",
    weekDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    weekDaysFull: [
      "Thu Hai",
      "Thu Ba",
      "Thu Tu",
      "Thu Nam",
      "Thu Sau",
      "Thu Bay",
      "Chu Nhat",
    ],
    timeSlots: ["8:00 – 10:00", "10:00 – 12:00", "1:00 – 3:00", "3:00 – 5:00"],
    noEvents: "Khong co su kien",
  },
};

type CalendarEvent = {
  title: string;
  detail: string;
  type: "Meeting" | "Check-in" | "Interview" | "Reminder";
  icon: typeof Video;
  color: string;
};

// slotIndex 0 = 8-10, 1 = 10-12, 2 = 1-3, 3 = 3-5
// dayIndex 0 = Monday ... 6 = Sunday
type ScheduleEntry = {
  dayIndex: number;
  slotIndex: number;
  event: CalendarEvent;
};

const scheduleData: ScheduleEntry[] = [
  {
    dayIndex: 0,
    slotIndex: 0,
    event: {
      title: "Daily team sync",
      detail: "Product Experience",
      type: "Meeting",
      icon: Video,
      color: "#0f766e",
    },
  },
  {
    dayIndex: 0,
    slotIndex: 2,
    event: {
      title: "Performance check-in",
      detail: "With Sophia Patel",
      type: "Check-in",
      icon: UserRound,
      color: "#7c3aed",
    },
  },
  {
    dayIndex: 1,
    slotIndex: 1,
    event: {
      title: "Backend interview",
      detail: "Platform hiring",
      type: "Interview",
      icon: BriefcaseBusiness,
      color: "#0369a1",
    },
  },
  {
    dayIndex: 1,
    slotIndex: 3,
    event: {
      title: "Payroll reminder",
      detail: "Review pending",
      type: "Reminder",
      icon: Clock3,
      color: "#b45309",
    },
  },
  {
    dayIndex: 2,
    slotIndex: 0,
    event: {
      title: "Sprint planning",
      detail: "Engineering team",
      type: "Meeting",
      icon: Video,
      color: "#0f766e",
    },
  },
  {
    dayIndex: 2,
    slotIndex: 2,
    event: {
      title: "Design review",
      detail: "UX team sync",
      type: "Meeting",
      icon: Video,
      color: "#0f766e",
    },
  },
  {
    dayIndex: 3,
    slotIndex: 1,
    event: {
      title: "1:1 with manager",
      detail: "Career growth",
      type: "Check-in",
      icon: UserRound,
      color: "#7c3aed",
    },
  },
  {
    dayIndex: 3,
    slotIndex: 3,
    event: {
      title: "Frontend interview",
      detail: "React candidate",
      type: "Interview",
      icon: BriefcaseBusiness,
      color: "#0369a1",
    },
  },
  {
    dayIndex: 4,
    slotIndex: 0,
    event: {
      title: "Weekly standup",
      detail: "All hands",
      type: "Meeting",
      icon: Video,
      color: "#0f766e",
    },
  },
  {
    dayIndex: 4,
    slotIndex: 2,
    event: {
      title: "Deadline reminder",
      detail: "Q3 report due",
      type: "Reminder",
      icon: Clock3,
      color: "#b45309",
    },
  },
];

function getWeekDates(referenceDate: Date): Date[] {
  const d = new Date(referenceDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatMonthYear(dates: Date[], lang: string): string {
  const first = dates[0];
  const last = dates[6];
  const opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
  const locale = lang === "vi" ? "vi-VN" : "en-US";

  if (first.getMonth() === last.getMonth()) {
    return first.toLocaleDateString(locale, opts);
  }
  const monthOpts: Intl.DateTimeFormatOptions = { month: "short" };
  return `${first.toLocaleDateString(locale, monthOpts)} – ${last.toLocaleDateString(locale, opts)}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function SchedulePage({ role, settings, onLogout }: SchedulePageProps) {
  const t = copy[settings.language];
  const isAdmin = role === "admin";
  const today = new Date();

  const [weekOffset, setWeekOffset] = useState(0);

  const referenceDate = new Date(today);
  referenceDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(referenceDate);

  const goToPrevWeek = () => setWeekOffset((o) => o - 1);
  const goToNextWeek = () => setWeekOffset((o) => o + 1);
  const goToToday = () => setWeekOffset(0);

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

        <nav className="nav-list" aria-label="Schedule navigation">
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
              <Link className="nav-item" to="/dashboard">
                <BriefcaseBusiness size={18} />
                {t.recruiting}
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-item" to="/home">
                <House size={18} />
                {t.home}
              </Link>
              <Link className="nav-item" to="/home">
                <FileText size={18} />
                {t.documents}
              </Link>
              <Link className="nav-item" to="/home">
                <UserRound size={18} />
                {t.profile}
              </Link>
            </>
          )}
          <Link className="nav-item active" to="/schedule">
            <CalendarDays size={18} />
            {t.schedule}
          </Link>
          <Link className="nav-item" to="/settings">
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
          <div className="cal-nav">
            <button
              className="cal-nav-btn"
              onClick={goToPrevWeek}
              type="button"
              aria-label="Previous week"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="cal-nav-label">
              {formatMonthYear(weekDates, settings.language)}
            </span>
            <button
              className="cal-nav-btn"
              onClick={goToNextWeek}
              type="button"
              aria-label="Next week"
            >
              <ChevronRight size={18} />
            </button>
            <button className="cal-today-btn" onClick={goToToday} type="button">
              {t.today}
            </button>
          </div>
        </header>

        <section className="cal-grid-wrapper">
          {/* ── Calendar grid ── */}
          <div className="cal-grid">
            {/* header row: empty corner + 7 day columns */}
            <div className="cal-corner" />
            {weekDates.map((date, i) => {
              const isToday = isSameDay(date, today);
              return (
                <div
                  className={`cal-day-header ${isToday ? "cal-today" : ""}`}
                  key={i}
                >
                  <span className="cal-day-name">{t.weekDays[i]}</span>
                  <span className={`cal-day-number ${isToday ? "cal-today-number" : ""}`}>
                    {date.getDate()}
                  </span>
                </div>
              );
            })}

            {/* body rows: one per time slot */}
            {t.timeSlots.map((slot, slotIdx) => (
              <>
                <div className="cal-time-label" key={`time-${slotIdx}`}>
                  {slot}
                </div>
                {weekDates.map((_date, dayIdx) => {
                  const entry = scheduleData.find(
                    (e) => e.dayIndex === dayIdx && e.slotIndex === slotIdx
                  );
                  const isToday = isSameDay(_date, today);

                  return (
                    <div
                      className={`cal-cell ${isToday ? "cal-cell-today" : ""}`}
                      key={`${slotIdx}-${dayIdx}`}
                    >
                      {entry ? (
                        <div
                          className="cal-event"
                          style={
                            {
                              "--event-color": entry.event.color,
                            } as React.CSSProperties
                          }
                        >
                          <div className="cal-event-icon">
                            <entry.event.icon size={15} />
                          </div>
                          <div className="cal-event-info">
                            <strong>{entry.event.title}</strong>
                            <span>{entry.event.detail}</span>
                          </div>
                          <span className="cal-event-type">{entry.event.type}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
