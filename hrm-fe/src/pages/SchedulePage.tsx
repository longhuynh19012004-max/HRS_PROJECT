import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  Plane,
  Plus,
  Settings,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
  Check,
} from "lucide-react";
import { AppSettings } from "../types/settings";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import { NotificationBell } from "../components/NotificationBell";

type SchedulePageProps = {
  role: "admin" | "user";
  settings: AppSettings;
  onLogout: () => void;
};

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function formatDisplayDate(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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


type EventType = "Meeting" | "Check-in" | "Interview" | "Reminder";

type CalendarEvent = {
  title: string;
  detail: string;
  type: EventType;
  icon: typeof Video;
  color: string;
  assignee?: string;
};

type ScheduleEntry = {
  id: string;
  date: string;
  slotIndex: number;
  event: CalendarEvent;
};

const typeConfig: Record<EventType, { icon: typeof Video; color: string }> = {
  Meeting: { icon: Video, color: "#0f766e" },
  "Check-in": { icon: UserRound, color: "#7c3aed" },
  Interview: { icon: BriefcaseBusiness, color: "#0369a1" },
  Reminder: { icon: Clock3, color: "#b45309" },
};

const currentWeekDates = getWeekDates(new Date());

const initialScheduleData: ScheduleEntry[] = [];

const emptyForm = {
  selectedDepartments: [] as string[],
  date: "",
  slotIndex: "",
  title: "",
  detail: "",
  type: "" as "" | EventType,
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDatesInRange(startStr: string, endStr: string): string[] {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const dates: string[] = [];

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];

  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

type LeaveType = "Annual" | "Sick" | "Unpaid";

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: "Pending" | "Approved";
};

const emptyLeaveForm = {
  startDate: "",
  endDate: "",
  type: "" as "" | LeaveType,
  reason: "",
};

const saveSchedule = async (data: { entries: ScheduleEntry[]; ids: string[] }) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 800));
};


export function SchedulePage({ role, settings, onLogout }: SchedulePageProps) {
  const isAdmin = role === "admin";
  const today = new Date();

  const [weekOffset, setWeekOffset] = useState(0);
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialScheduleData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState(emptyLeaveForm);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [profile, setProfile] = useState<{ firstName: string; lastName: string } | null>(null);

  const [employeesList, setEmployeesList] = useState<{ name: string; initials: string; role: string; status: string; department: string }[]>([]);

  useEffect(() => {
    axiosClient.get("/profile/me")
      .then((res) => {
        setProfile(res.data.employee || null);
      })
      .catch(console.error);

    const leaveEndpoint = role === "admin" ? "/leave-requests" : "/leave-requests/me";
    axiosClient.get(leaveEndpoint)
      .then((res) => {
        setLeaveRequests(res.data);
      })
      .catch(console.error);

    axiosClient.get("/schedules")
      .then((res) => {
        const mappedEntries: ScheduleEntry[] = res.data.map((dbSchedule: any) => {
          const config = typeConfig[dbSchedule.type as EventType] || typeConfig["Meeting"];
          return {
            id: dbSchedule.id,
            date: dbSchedule.date,
            slotIndex: dbSchedule.slotIndex,
            event: {
              title: dbSchedule.title,
              detail: dbSchedule.detail || "",
              type: dbSchedule.type as EventType,
              icon: config.icon,
              color: config.color,
              assignee: dbSchedule.assigneeName,
            }
          };
        });
        setEntries(mappedEntries);
      })
      .catch(console.error);

    if (isAdmin) {
      axiosClient.get("/users")
        .then((res) => {
          const list = res.data.map((acc: any) => {
            const emp = acc.employee || {};
            const fn = emp.firstName || "Unknown";
            const ln = emp.lastName || "Employee";
            return {
              name: `${fn} ${ln}`.trim(),
              initials: `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase(),
              role: emp.position || "Position",
              status: emp.status || "active",
              department: emp.department || "Unassigned",
            };
          });
          setEmployeesList(list);
        })
        .catch(console.error);
    }
  }, [isAdmin]);

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Current User";

  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const referenceDate = new Date(today);
  referenceDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(referenceDate);

  const scheduleMutation = useMutation({
    mutationFn: async (data: { entries: ScheduleEntry[]; ids: string[] }) => {
      const payload = data.entries.map(e => ({
        id: e.id,
        date: e.date,
        slotIndex: e.slotIndex,
        title: e.event.title,
        detail: e.event.detail,
        type: e.event.type,
        assigneeName: e.event.assignee || "",
      }));
      await axiosClient.post("/schedules", payload);
      return data;
    },
    onSuccess: (data: any) => {
      setEntries((prev) => [...prev, ...data.entries]);
      setAddedIds((prev) => [...prev, ...data.ids]);
      toast.success("Schedule item added successfully for selected employee(s)!");
      setForm({
        ...emptyForm,
        date: form.date,
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async (data: { payload: Omit<LeaveRequest, "id" | "status"> }) => {
      const res = await axiosClient.post("/leave-requests", data.payload);
      return res.data;
    },
    onSuccess: (newRequest: LeaveRequest) => {
      setLeaveRequests((prev) => [newRequest, ...prev]);
      toast.success("Leave request submitted successfully! Pending approval.");
      setLeaveForm(emptyLeaveForm);
    },
  });

  const updateLeaveStatusMutation = useMutation({
    mutationFn: async (data: { id: string; status: "Approved" | "Rejected" }) => {
      const res = await axiosClient.patch(`/leave-requests/${data.id}/status`, { status: data.status });
      return res.data;
    },
    onSuccess: (updatedRequest: LeaveRequest) => {
      setLeaveRequests((prev) => prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)));
    },
  });

  const handleLeaveFormChange = (field: string, value: any) => {
    setLeaveForm((prev) => ({ ...prev, [field]: value }));
  };

  const isLeaveFormValid =
    leaveForm.startDate &&
    leaveForm.endDate &&
    leaveForm.startDate <= leaveForm.endDate &&
    leaveForm.type &&
    leaveForm.reason;

  const handleLeaveSubmit = () => {
    if (!isLeaveFormValid || leaveForm.type === "") return;

    const payload = {
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      type: leaveForm.type as LeaveType,
      reason: leaveForm.reason,
    };

    leaveMutation.mutate({ payload });
  };

  const handleCancelLeave = (requestId: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const goToPrevWeek = () => setWeekOffset((o) => o - 1);
  const goToNextWeek = () => setWeekOffset((o) => o + 1);
  const goToToday = () => setWeekOffset(0);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDepartmentSelection = (deptName: string) => {
    const current = form.selectedDepartments;
    if (current.includes(deptName)) {
      handleFormChange(
        "selectedDepartments",
        current.filter((name) => name !== deptName)
      );
    } else {
      handleFormChange("selectedDepartments", [...current, deptName]);
    }
  };

  const handleToggleFilter = (employeeName: string) => {
    setActiveFilters((prev) =>
      prev.includes(employeeName)
        ? prev.filter((n) => n !== employeeName)
        : [...prev, employeeName]
    );
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const isFormValid =
    form.selectedDepartments.length > 0 &&
    form.date !== "" &&
    form.slotIndex !== "" &&
    form.title &&
    form.type;

  const handleSubmit = () => {
    if (!isFormValid || form.type === "") return;

    const config = typeConfig[form.type as EventType];
    const newIds: string[] = [];
    const newEntries: ScheduleEntry[] = form.selectedDepartments.map((deptName, index) => {
      const uniqueId = `added-${Date.now()}-${index}`;
      newIds.push(uniqueId);
      return {
        id: uniqueId,
        date: form.date,
        slotIndex: Number(form.slotIndex),
        event: {
          title: form.title,
          detail: form.detail || deptName,
          type: form.type as EventType,
          icon: config.icon,
          color: config.color,
          assignee: deptName,
        },
      };
    });

    scheduleMutation.mutate({ entries: newEntries, ids: newIds });
  };

  const handleRemoveAdded = (id: string) => {
    // Delete in background
    if (!id.startsWith("leave-")) {
      axiosClient.delete(`/schedules/${id}`).catch(console.error);
    }
    
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setAddedIds((prev) => prev.filter((i) => i !== id));
  };

  const recentlyAdded = entries.filter((e) => addedIds.includes(e.id));

  const visibleEntries = entries.filter((entry) => {
    if (activeFilters.length === 0) return true;
    return entry.event.assignee && activeFilters.includes(entry.event.assignee);
  });

  const uniqueDepartments = Array.from(new Set(employeesList.map(e => e.department).filter(Boolean)));

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
                Dashboard
              </Link>
              <Link className="nav-item" to="/employee">
                <Users size={18} />
                Employees
              </Link>
            </>
          ) : (
            <Link className="nav-item" to="/home">
              <House size={18} />
              Home
            </Link>
          )}
          <Link className="nav-item active" to="/schedule">
            <CalendarDays size={18} />
            Schedule
          </Link>
          {!isAdmin && (
            <Link className="nav-item" to="/profile">
              <UserRound size={18} />
              Profile
            </Link>
          )}
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
            <p className="eyebrow">Work Calendar</p>
            <h1>Schedule</h1>
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
              Today
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* ── Filter Bar ── */}
        <div className="cal-filter-wrapper">
          <div className="cal-filter-bar">
            <span>Filter by Department</span>
            <div className="filter-pills">
              {uniqueDepartments.map((deptName) => {
                const isActive = activeFilters.includes(deptName);
                return (
                  <button
                    type="button"
                    key={deptName}
                    className={`filter-pill ${isActive ? "active" : ""}`}
                    onClick={() => handleToggleFilter(deptName)}
                  >
                    {deptName}
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  className="filter-pill-all"
                  onClick={handleClearFilters}
                >
                  Show All
                </button>
              )}
            </div>
          </div>
        </div>

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
                  <span className="cal-day-name">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
                  <span
                    className={`cal-day-number ${isToday ? "cal-today-number" : ""}`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            })}

            {/* body rows: one per time slot */}
            {["8:00 – 10:00","10:00 – 12:00","1:00 – 3:00","3:00 – 5:00"].map((slot, slotIdx) => (
              <div className="cal-row" key={`row-${slotIdx}`}>
                <div className="cal-time-label">{slot}</div>
                {weekDates.map((_date, dayIdx) => {
                  const targetDateStr = formatDateString(_date);
                  const cellEntries = visibleEntries.filter(
                    (e) => e.date === targetDateStr && e.slotIndex === slotIdx
                  );
                  const isToday = isSameDay(_date, today);

                  return (
                    <div
                      className={`cal-cell ${isToday ? "cal-cell-today" : ""}`}
                      key={`${slotIdx}-${dayIdx}`}
                    >
                      {cellEntries.map((entry) => (
                        <div
                          className="cal-event"
                          key={entry.id}
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
                            {entry.event.assignee && (
                              <span className="cal-event-assignee-badge">
                                {entry.event.assignee}
                              </span>
                            )}
                          </div>
                          <span className="cal-event-type">{entry.event.type}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── Admin: Add Schedule Section ── */}
        {isAdmin && (
          <section className="schedule-admin-section">
            {!showForm ? (
              <button
                className="schedule-add-trigger"
                onClick={() => setShowForm(true)}
                type="button"
              >
                <div className="schedule-add-trigger-icon">
                  <Plus size={20} />
                </div>
                <div>
                  <strong>Add Schedule</strong>
                  <span>Assign a new schedule item to employees. Select one or multiple employees, pick the date, time slot, and details.</span>
                </div>
              </button>
            ) : (
              <div className="schedule-add-panel panel">
                <div className="panel-header">
                  <div>
                    <h2>Add Schedule</h2>
                    <p>Assign a new schedule item to employees. Select one or multiple employees, pick the date, time slot, and details.</p>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                    }}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>


                <div className="schedule-add-form">
                  {/* Row 1: Department Selection (Multi-select) */}
                  <div className="schedule-form-row-full">
                    <label style={{ display: "grid", gap: "8px", fontWeight: 800, fontSize: "14px" }}>
                      Departments (select one or multiple)
                      <div className="employee-selector-group">
                        {uniqueDepartments.map((deptName) => {
                          const isSelected = form.selectedDepartments.includes(deptName);
                          return (
                            <button
                              type="button"
                              key={deptName}
                              className={`employee-selector-pill ${isSelected ? "selected" : ""}`}
                              onClick={() => handleToggleDepartmentSelection(deptName)}
                            >
                              <span className="avatar-mini">{deptName.charAt(0)}</span>
                              <div className="emp-info">
                                <strong>{deptName}</strong>
                                <span>Department</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </label>
                  </div>

                  {/* Row 2: Date + Time Slot */}
                  <div className="schedule-form-row">
                    <label>
                      Date
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          handleFormChange("date", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Time Slot
                      <select
                        value={form.slotIndex}
                        onChange={(e) =>
                          handleFormChange("slotIndex", e.target.value)
                        }
                      >
                        <option value="">Select time slot...</option>
                        {["8:00 – 10:00","10:00 – 12:00","1:00 – 3:00","3:00 – 5:00"].map((slot, i) => (
                          <option key={i} value={i}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Row 3: Type + Title */}
                  <div className="schedule-form-row">
                    <label>
                      Type
                      <select
                        value={form.type}
                        onChange={(e) =>
                          handleFormChange("type", e.target.value)
                        }
                      >
                        <option value="">Select type...</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Check-in">Check-in</option>
                        <option value="Interview">Interview</option>
                        <option value="Reminder">Reminder</option>
                      </select>
                    </label>
                    <label>
                      Event Title
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  {/* Row 4: Detail */}
                  <div className="schedule-form-row">
                    <label style={{ gridColumn: "span 2" }}>
                      Detail
                      <input
                        type="text"
                        value={form.detail}
                        onChange={(e) =>
                          handleFormChange("detail", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="schedule-form-actions">
                    <button
                      className="primary-button"
                      onClick={handleSubmit}
                      disabled={!isFormValid || scheduleMutation.isPending}
                      type="button"
                    >
                      <Plus size={16} />
                      {scheduleMutation.isPending ? "Adding..." : "Add to Schedule"}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setShowForm(false);
                        setForm(emptyForm);
                        setSuccessMsg("");
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recently added items list */}
            {recentlyAdded.length > 0 && (
              <div className="schedule-recent panel">
                <div className="panel-header">
                  <div>
                    <h2>Recently Added</h2>
                    <p>Items you've added this session.</p>
                  </div>
                </div>
                <div className="schedule-recent-list">
                  {recentlyAdded.map((entry) => {
                    const Icon = entry.event.icon;
                    return (
                      <div className="schedule-recent-item" key={entry.id}>
                        <div
                          className="schedule-recent-icon"
                          style={
                            {
                              "--event-color": entry.event.color,
                            } as React.CSSProperties
                          }
                        >
                          <Icon size={16} />
                        </div>
                        <div className="schedule-recent-info">
                          <strong>{entry.event.title}</strong>
                          <span>
                            {entry.event.assignee} ·{" "}
                            {formatDisplayDate(entry.date, settings.language)} ·{" "}
                            {["8:00 – 10:00","10:00 – 12:00","1:00 – 3:00","3:00 – 5:00"][entry.slotIndex]}
                          </span>
                        </div>
                        <span className="status-badge active">{entry.event.type}</span>
                        <button
                          className="schedule-recent-remove"
                          onClick={() => handleRemoveAdded(entry.id)}
                          type="button"
                          aria-label="Remove"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Employee: Request Leave Section ── */}
        {!isAdmin && (
          <section className="schedule-admin-section">
            {!showLeaveForm ? (
              <button
                className="schedule-add-trigger"
                onClick={() => setShowLeaveForm(true)}
                type="button"
              >
                <div className="schedule-add-trigger-icon">
                  <Plane size={20} />
                </div>
                <div>
                  <strong>Request Leave</strong>
                  <span>Submit a new leave request. It will be shown on the calendar as pending approval.</span>
                </div>
              </button>
            ) : (
              <div className="schedule-add-panel panel">
                <div className="panel-header">
                  <div>
                    <h2>Request Leave</h2>
                    <p>Submit a new leave request. It will be shown on the calendar as pending approval.</p>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      setShowLeaveForm(false);
                      setLeaveForm(emptyLeaveForm);
                    }}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>


                <div className="schedule-add-form">
                  {/* Row 1: Start Date + End Date */}
                  <div className="schedule-form-row">
                    <label>
                      Start Date
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) =>
                          handleLeaveFormChange("startDate", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      End Date
                      <input
                        type="date"
                        value={leaveForm.endDate}
                        onChange={(e) =>
                          handleLeaveFormChange("endDate", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  {/* Row 2: Leave Type + Reason */}
                  <div className="schedule-form-row">
                    <label>
                      Leave Type
                      <select
                        value={leaveForm.type}
                        onChange={(e) =>
                          handleLeaveFormChange("type", e.target.value)
                        }
                      >
                        <option value="">Select leave type...</option>
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Unpaid">Unpaid Leave</option>
                      </select>
                    </label>
                    <label>
                      Reason
                      <input
                        type="text"
                        value={leaveForm.reason}
                        onChange={(e) =>
                          handleLeaveFormChange("reason", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="schedule-form-actions">
                    <button
                      className="primary-button"
                      onClick={handleLeaveSubmit}
                      disabled={!isLeaveFormValid || leaveMutation.isPending}
                      type="button"
                    >
                      <Plane size={16} />
                      {leaveMutation.isPending ? "Submitting..." : "Submit Leave Request"}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setShowLeaveForm(false);
                        setLeaveForm(emptyLeaveForm);
                        setSuccessLeaveMsg("");
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Leave request history (Visible to Both User and Admin) */}
        {leaveRequests.length > 0 && (
          <section className="schedule-admin-section">
            <div className="schedule-recent panel">
              <div className="panel-header">
                <div>
                  <h2>Leave History</h2>
                  <p>{isAdmin ? "Manage all employee leave requests." : "Your submitted leave requests and their statuses."}</p>
                </div>
              </div>
              <div className="schedule-recent-list">
                {leaveRequests.map((req: any) => {
                  const leaveColor = req.type === "Annual" ? "#0f766e" : req.type === "Sick" ? "#b91c1c" : "#b45309";
                  const leaveTitleMap = {
                    Annual: "Annual Leave",
                    Sick: "Sick Leave",
                    Unpaid: "Unpaid Leave",
                  };
                  
                  const employeeName = req.employee 
                    ? `${req.employee.firstName} ${req.employee.lastName}` 
                    : "";
                    
                  const displayTitle = isAdmin 
                    ? `${employeeName} - ${leaveTitleMap[req.type as LeaveType]}`
                    : leaveTitleMap[req.type as LeaveType];

                  const statusColor = req.status === "Approved" ? "#16a34a" : req.status === "Rejected" ? "#dc2626" : "#d97706";
                  const statusBg = req.status === "Approved" ? "#dcfce7" : req.status === "Rejected" ? "#fee2e2" : "#fef3c7";

                  return (
                    <div className="schedule-recent-item" key={req.id}>
                      <div
                        className="schedule-recent-icon"
                        style={
                          {
                            "--event-color": leaveColor,
                          } as React.CSSProperties
                        }
                      >
                        <Plane size={16} />
                      </div>
                      <div className="schedule-recent-info">
                        <strong>{displayTitle}</strong>
                        <span>
                          {formatDisplayDate(req.startDate, settings.language)} – {formatDisplayDate(req.endDate, settings.language)} · {req.reason}
                        </span>
                      </div>
                      <span className="status-badge onboarding" style={{ color: statusColor, background: statusBg }}>
                        {req.status}
                      </span>
                      
                      {!isAdmin && req.status === "Pending" && (
                        <button
                          className="schedule-recent-remove"
                          onClick={() => handleCancelLeave(req.id)}
                          type="button"
                          aria-label="Remove"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      
                      {isAdmin && req.status === "Pending" && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="schedule-recent-remove"
                            style={{ color: "#16a34a", background: "#dcfce7" }}
                            onClick={() => updateLeaveStatusMutation.mutate({ id: req.id, status: "Approved" })}
                            type="button"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className="schedule-recent-remove"
                            style={{ color: "#dc2626", background: "#fee2e2" }}
                            onClick={() => updateLeaveStatusMutation.mutate({ id: req.id, status: "Rejected" })}
                            type="button"
                            title="Reject"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
