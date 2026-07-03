import { useMutation } from "@tanstack/react-query";
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
  Plane,
  Plus,
  Settings,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import { AppSettings } from "../types/settings";

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
    addSchedule: "Add Schedule",
    addScheduleDesc:
      "Assign a new schedule item to employees. Select one or multiple employees, pick the date, time slot, and details.",
    employee: "Employees (select one or multiple)",
    day: "Date",
    timeSlot: "Time Slot",
    eventTitle: "Event Title",
    eventDetail: "Detail",
    eventType: "Type",
    addBtn: "Add to Schedule",
    cancel: "Cancel",
    selectSlot: "Select time slot...",
    selectType: "Select type...",
    successMsg: "Schedule item added successfully for selected employee(s)!",
    recentlyAdded: "Recently Added",
    recentlyAddedDesc: "Items you've added this session.",
    noItemsYet: "No items added yet.",
    remove: "Remove",
    filterByEmployee: "Filter by Employee:",
    clearFilter: "Show All",
    requestLeave: "Request Leave",
    requestLeaveDesc: "Submit a new leave request. It will be shown on the calendar as pending approval.",
    startDate: "Start Date",
    endDate: "End Date",
    leaveType: "Leave Type",
    reason: "Reason",
    submitRequest: "Submit Leave Request",
    selectLeaveType: "Select leave type...",
    annualLeave: "Annual Leave",
    sickLeave: "Sick Leave",
    unpaidLeave: "Unpaid Leave",
    successLeaveMsg: "Leave request submitted successfully! Pending approval.",
    pending: "Pending",
    leaveHistory: "Leave History",
    leaveHistoryDesc: "Your submitted leave requests and their statuses.",
  },
  vi: {
    dashboard: "Bảng điều khiển",
    employees: "Nhân viên",
    recruiting: "Tuyển dụng",
    schedule: "Lịch làm việc",
    documents: "Tài liệu",
    profile: "Hồ sơ",
    home: "Trang chủ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    eyebrow: "Lịch công việc",
    title: "Lịch làm việc",
    today: "Hôm nay",
    weekDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    weekDaysFull: [
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
      "Chủ Nhật",
    ],
    timeSlots: ["8:00 – 10:00", "10:00 – 12:00", "1:00 – 3:00", "3:00 – 5:00"],
    noEvents: "Không có sự kiện",
    addSchedule: "Thêm lịch",
    addScheduleDesc:
      "Gán lịch làm việc mới cho nhân viên. Chọn một hoặc nhiều nhân viên, ngày, khung giờ và chi tiết sự kiện.",
    employee: "Nhân viên (chọn một hoặc nhiều người)",
    day: "Ngày",
    timeSlot: "Khung giờ",
    eventTitle: "Tiêu đề",
    eventDetail: "Chi tiết",
    eventType: "Loại",
    addBtn: "Thêm vào lịch",
    cancel: "Hủy",
    selectSlot: "Chọn khung giờ...",
    selectType: "Chọn loại...",
    successMsg: "Đã thêm lịch thành công cho các nhân viên được chọn!",
    recentlyAdded: "Mới thêm gần đây",
    recentlyAddedDesc: "Các mục bạn đã thêm trong phiên này.",
    noItemsYet: "Chưa có mục nào.",
    remove: "Xóa",
    filterByEmployee: "Lọc theo nhân viên:",
    clearFilter: "Tất cả",
    requestLeave: "Xin nghỉ phép",
    requestLeaveDesc: "Gửi yêu cầu nghỉ phép mới. Lịch trình sẽ hiển thị trạng thái chờ duyệt.",
    startDate: "Từ ngày",
    endDate: "Đến ngày",
    leaveType: "Loại nghỉ phép",
    reason: "Lý do xin nghỉ",
    submitRequest: "Gửi yêu cầu nghỉ phép",
    selectLeaveType: "Chọn loại nghỉ phép...",
    annualLeave: "Nghỉ phép năm",
    sickLeave: "Nghỉ bệnh",
    unpaidLeave: "Nghỉ không lương",
    successLeaveMsg: "Gửi yêu cầu nghỉ phép thành công! Đang chờ duyệt.",
    pending: "Chờ duyệt",
    leaveHistory: "Lịch sử xin nghỉ",
    leaveHistoryDesc: "Các yêu cầu nghỉ phép đã gửi và trạng thái.",
  },
};

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
  date: string; // "YYYY-MM-DD"
  slotIndex: number;
  event: CalendarEvent;
};

const typeConfig: Record<EventType, { icon: typeof Video; color: string }> = {
  Meeting: { icon: Video, color: "#0f766e" },
  "Check-in": { icon: UserRound, color: "#7c3aed" },
  Interview: { icon: BriefcaseBusiness, color: "#0369a1" },
  Reminder: { icon: Clock3, color: "#b45309" },
};

const employees: { name: string; initials: string; role: string; status: string }[] = [];

const currentWeekDates = getWeekDates(new Date());

const initialScheduleData: ScheduleEntry[] = [];

const emptyForm = {
  selectedEmployees: [] as string[],
  date: "", // "YYYY-MM-DD" format
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

const saveLeaveRequest = async (data: { request: LeaveRequest; entries: ScheduleEntry[] }) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 800));
};

export function SchedulePage({ role, settings, onLogout }: SchedulePageProps) {
  const t = copy[settings.language];
  const isAdmin = role === "admin";
  const today = new Date();

  const [weekOffset, setWeekOffset] = useState(0);
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialScheduleData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [successMsg, setSuccessMsg] = useState("");
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState(emptyLeaveForm);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [successLeaveMsg, setSuccessLeaveMsg] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const referenceDate = new Date(today);
  referenceDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(referenceDate);

  const scheduleMutation = useMutation({
    mutationFn: saveSchedule,
    onSuccess: (data: any) => {
      setEntries((prev) => [...prev, ...data.entries]);
      setAddedIds((prev) => [...prev, ...data.ids]);
      setSuccessMsg(t.successMsg);
      setForm({
        ...emptyForm,
        date: form.date,
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: saveLeaveRequest,
    onSuccess: (data: any) => {
      setLeaveRequests((prev) => [...prev, data.request]);
      setEntries((prev) => [...prev, ...data.entries]);
      setSuccessLeaveMsg(t.successLeaveMsg);
      setLeaveForm(emptyLeaveForm);
    },
  });

  const handleLeaveFormChange = (field: string, value: any) => {
    setLeaveForm((prev) => ({ ...prev, [field]: value }));
    if (successLeaveMsg) setSuccessLeaveMsg("");
  };

  const isLeaveFormValid =
    leaveForm.startDate &&
    leaveForm.endDate &&
    leaveForm.startDate <= leaveForm.endDate &&
    leaveForm.type &&
    leaveForm.reason;

  const handleLeaveSubmit = () => {
    if (!isLeaveFormValid || leaveForm.type === "") return;

    const newRequestId = `leave-${Date.now()}`;
    const newRequest: LeaveRequest = {
      id: newRequestId,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      type: leaveForm.type as LeaveType,
      reason: leaveForm.reason,
      status: "Pending",
    };

    setLeaveRequests((prev) => [...prev, newRequest]);

    const dates = getDatesInRange(leaveForm.startDate, leaveForm.endDate);
    const leaveColor = leaveForm.type === "Annual" ? "#0f766e" : leaveForm.type === "Sick" ? "#b91c1c" : "#b45309";
    const leaveTitleMap = {
      Annual: t.annualLeave,
      Sick: t.sickLeave,
      Unpaid: t.unpaidLeave,
    };
    const displayTitle = `${leaveTitleMap[leaveForm.type as LeaveType]} (${t.pending})`;

    const newEntries: ScheduleEntry[] = [];
    dates.forEach((dateStr, dateIdx) => {
      [0, 1, 2, 3].forEach((slotIdx) => {
        newEntries.push({
          id: `${newRequestId}-${dateIdx}-${slotIdx}`,
          date: dateStr,
          slotIndex: slotIdx,
          event: {
            title: displayTitle,
            detail: leaveForm.reason,
            type: "Reminder",
            icon: Plane,
            color: leaveColor,
            assignee: "Maya Chen",
          },
        });
      });
    });

    leaveMutation.mutate({ request: newRequest, entries: newEntries });
  };

  const handleCancelLeave = (requestId: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== requestId));
    setEntries((prev) => prev.filter((e) => !e.id.startsWith(requestId)));
  };

  const goToPrevWeek = () => setWeekOffset((o) => o - 1);
  const goToNextWeek = () => setWeekOffset((o) => o + 1);
  const goToToday = () => setWeekOffset(0);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (successMsg) setSuccessMsg("");
  };

  const handleToggleEmployeeSelection = (employeeName: string) => {
    const current = form.selectedEmployees;
    if (current.includes(employeeName)) {
      handleFormChange(
        "selectedEmployees",
        current.filter((name) => name !== employeeName)
      );
    } else {
      handleFormChange("selectedEmployees", [...current, employeeName]);
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
    form.selectedEmployees.length > 0 &&
    form.date !== "" &&
    form.slotIndex !== "" &&
    form.title &&
    form.type;

  const handleSubmit = () => {
    if (!isFormValid || form.type === "") return;

    const config = typeConfig[form.type as EventType];
    const newIds: string[] = [];
    const newEntries: ScheduleEntry[] = form.selectedEmployees.map((empName, index) => {
      const uniqueId = `added-${Date.now()}-${index}`;
      newIds.push(uniqueId);
      return {
        id: uniqueId,
        date: form.date, // "YYYY-MM-DD"
        slotIndex: Number(form.slotIndex),
        event: {
          title: form.title,
          detail: form.detail || empName,
          type: form.type as EventType,
          icon: config.icon,
          color: config.color,
          assignee: empName,
        },
      };
    });

    scheduleMutation.mutate({ entries: newEntries, ids: newIds });
  };

  const handleRemoveAdded = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setAddedIds((prev) => prev.filter((i) => i !== id));
  };

  const recentlyAdded = entries.filter((e) => addedIds.includes(e.id));

  // Filter entries to show in calendar grid
  const visibleEntries = entries.filter((entry) => {
    if (activeFilters.length === 0) return true;
    return entry.event.assignee && activeFilters.includes(entry.event.assignee);
  });

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
            </>
          ) : (
            <Link className="nav-item" to="/home">
              <House size={18} />
              {t.home}
            </Link>
          )}
          <Link className="nav-item active" to="/schedule">
            <CalendarDays size={18} />
            {t.schedule}
          </Link>
          {!isAdmin && (
            <Link className="nav-item" to="/profile">
              <UserRound size={18} />
              {t.profile}
            </Link>
          )}
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

        {/* ── Filter Bar ── */}
        <div className="cal-filter-wrapper">
          <div className="cal-filter-bar">
            <span>{t.filterByEmployee}</span>
            <div className="filter-pills">
              {employees.map((emp) => {
                const isActive = activeFilters.includes(emp.name);
                return (
                  <button
                    type="button"
                    key={emp.name}
                    className={`filter-pill ${isActive ? "active" : ""}`}
                    onClick={() => handleToggleFilter(emp.name)}
                  >
                    {emp.name}
                  </button>
                );
              })}
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  className="filter-pill-all"
                  onClick={handleClearFilters}
                >
                  {t.clearFilter}
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
                  <span className="cal-day-name">{t.weekDays[i]}</span>
                  <span
                    className={`cal-day-number ${isToday ? "cal-today-number" : ""}`}
                  >
                    {date.getDate()}
                  </span>
                </div>
              );
            })}

            {/* body rows: one per time slot */}
            {t.timeSlots.map((slot, slotIdx) => (
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
                  <strong>{t.addSchedule}</strong>
                  <span>{t.addScheduleDesc}</span>
                </div>
              </button>
            ) : (
              <div className="schedule-add-panel panel">
                <div className="panel-header">
                  <div>
                    <h2>{t.addSchedule}</h2>
                    <p>{t.addScheduleDesc}</p>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                      setSuccessMsg("");
                    }}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {successMsg && (
                  <div className="success-message">{successMsg}</div>
                )}

                <div className="schedule-add-form">
                  {/* Row 1: Employee Selection (Multi-select) */}
                  <div className="schedule-form-row-full">
                    <label style={{ display: "grid", gap: "8px", fontWeight: 800, fontSize: "14px" }}>
                      {t.employee}
                      <div className="employee-selector-group">
                        {employees.filter((emp) => emp.status !== "Leave").map((emp) => {
                          const isSelected = form.selectedEmployees.includes(emp.name);
                          return (
                            <button
                              type="button"
                              key={emp.name}
                              className={`employee-selector-pill ${isSelected ? "selected" : ""}`}
                              onClick={() => handleToggleEmployeeSelection(emp.name)}
                            >
                              <span className="avatar-mini">{emp.initials}</span>
                              <div className="emp-info">
                                <strong>{emp.name}</strong>
                                <span>{emp.role}</span>
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
                      {t.day}
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          handleFormChange("date", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      {t.timeSlot}
                      <select
                        value={form.slotIndex}
                        onChange={(e) =>
                          handleFormChange("slotIndex", e.target.value)
                        }
                      >
                        <option value="">{t.selectSlot}</option>
                        {t.timeSlots.map((slot, i) => (
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
                      {t.eventType}
                      <select
                        value={form.type}
                        onChange={(e) =>
                          handleFormChange("type", e.target.value)
                        }
                      >
                        <option value="">{t.selectType}</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Check-in">Check-in</option>
                        <option value="Interview">Interview</option>
                        <option value="Reminder">Reminder</option>
                      </select>
                    </label>
                    <label>
                      {t.eventTitle}
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
                      {t.eventDetail}
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
                      {scheduleMutation.isPending ? "Adding..." : t.addBtn}
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
                      {t.cancel}
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
                    <h2>{t.recentlyAdded}</h2>
                    <p>{t.recentlyAddedDesc}</p>
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
                            {t.timeSlots[entry.slotIndex]}
                          </span>
                        </div>
                        <span className="status-badge active">{entry.event.type}</span>
                        <button
                          className="schedule-recent-remove"
                          onClick={() => handleRemoveAdded(entry.id)}
                          type="button"
                          aria-label={t.remove}
                          title={t.remove}
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
                  <strong>{t.requestLeave}</strong>
                  <span>{t.requestLeaveDesc}</span>
                </div>
              </button>
            ) : (
              <div className="schedule-add-panel panel">
                <div className="panel-header">
                  <div>
                    <h2>{t.requestLeave}</h2>
                    <p>{t.requestLeaveDesc}</p>
                  </div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      setShowLeaveForm(false);
                      setLeaveForm(emptyLeaveForm);
                      setSuccessLeaveMsg("");
                    }}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {successLeaveMsg && (
                  <div className="success-message">{successLeaveMsg}</div>
                )}

                <div className="schedule-add-form">
                  {/* Row 1: Start Date + End Date */}
                  <div className="schedule-form-row">
                    <label>
                      {t.startDate}
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(e) =>
                          handleLeaveFormChange("startDate", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      {t.endDate}
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
                      {t.leaveType}
                      <select
                        value={leaveForm.type}
                        onChange={(e) =>
                          handleLeaveFormChange("type", e.target.value)
                        }
                      >
                        <option value="">{t.selectLeaveType}</option>
                        <option value="Annual">{t.annualLeave}</option>
                        <option value="Sick">{t.sickLeave}</option>
                        <option value="Unpaid">{t.unpaidLeave}</option>
                      </select>
                    </label>
                    <label>
                      {t.reason}
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
                      {leaveMutation.isPending ? "Submitting..." : t.submitRequest}
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
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Leave request history */}
            {leaveRequests.length > 0 && (
              <div className="schedule-recent panel">
                <div className="panel-header">
                  <div>
                    <h2>{t.leaveHistory}</h2>
                    <p>{t.leaveHistoryDesc}</p>
                  </div>
                </div>
                <div className="schedule-recent-list">
                  {leaveRequests.map((req) => {
                    const leaveColor = req.type === "Annual" ? "#0f766e" : req.type === "Sick" ? "#b91c1c" : "#b45309";
                    const leaveTitleMap = {
                      Annual: t.annualLeave,
                      Sick: t.sickLeave,
                      Unpaid: t.unpaidLeave,
                    };
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
                          <strong>{leaveTitleMap[req.type as LeaveType]}</strong>
                          <span>
                            {formatDisplayDate(req.startDate, settings.language)} – {formatDisplayDate(req.endDate, settings.language)} · {req.reason}
                          </span>
                        </div>
                        <span className="status-badge onboarding" style={{ color: "#d97706", background: "#fef3c7" }}>
                          {t.pending}
                        </span>
                        <button
                          className="schedule-recent-remove"
                          onClick={() => handleCancelLeave(req.id)}
                          type="button"
                          aria-label={t.remove}
                          title={t.remove}
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
      </main>
    </div>
  );
}
