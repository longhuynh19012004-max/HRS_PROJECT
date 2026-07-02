import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  House,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  UserRound,
} from "lucide-react";
import { AppSettings } from "../types/settings";

type ProfilePageProps = {
  settings: AppSettings;
  onLogout: () => void;
};

const copy = {
  en: {
    home: "Home",
    schedule: "Schedule",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    eyebrow: "Personal Information",
    title: "My Profile",
    description: "View and update your personal details. Changes are saved locally.",
    personalInfo: "Personal Information",
    personalInfoHelp: "Update your basic contact and identity details.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Work Email",
    phone: "Phone Number",
    jobInfo: "Job Information",
    jobInfoHelp: "Your current role and department details.",
    department: "Department",
    role: "Role",
    location: "Location",
    startDate: "Start Date",
    saveChanges: "Save Changes",
    saved: "Profile updated successfully!",
    avatarLabel: "Profile Photo",
    changePhoto: "Change",
  },
  vi: {
    home: "Trang chủ",
    schedule: "Lịch làm việc",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    eyebrow: "Thông tin cá nhân",
    title: "Hồ sơ của tôi",
    description: "Xem và cập nhật thông tin cá nhân. Thay đổi được lưu cục bộ.",
    personalInfo: "Thông tin cá nhân",
    personalInfoHelp: "Cập nhật các thông tin liên hệ và định danh cơ bản.",
    firstName: "Họ",
    lastName: "Tên",
    email: "Email công việc",
    phone: "Số điện thoại",
    jobInfo: "Thông tin công việc",
    jobInfoHelp: "Vị trí và phòng ban hiện tại.",
    department: "Phòng ban",
    role: "Chức danh",
    location: "Địa điểm",
    startDate: "Ngày bắt đầu",
    saveChanges: "Lưu thay đổi",
    saved: "Cập nhật hồ sơ thành công!",
    avatarLabel: "Ảnh đại diện",
    changePhoto: "Đổi ảnh",
  },
};

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  location: string;
  startDate: string;
};

const initialProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  location: "",
  startDate: "",
};

export function ProfilePage({ settings, onLogout }: ProfilePageProps) {
  const t = copy[settings.language];
  const [form, setForm] = useState<ProfileForm>(initialProfile);
  const [isSaved, setIsSaved] = useState(false);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Employee";
  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();

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

        <nav className="nav-list" aria-label="Profile navigation">
          <Link className="nav-item" to="/home">
            <House size={18} />
            {t.home}
          </Link>
          <Link className="nav-item" to="/schedule">
            <CalendarDays size={18} />
            {t.schedule}
          </Link>
          <Link className="nav-item active" to="/profile">
            <UserRound size={18} />
            {t.profile}
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
          <div className="topbar-actions">
            <button
              className="primary-button"
              onClick={handleSave}
              type="button"
            >
              <Save size={18} />
              {t.saveChanges}
            </button>
          </div>
        </header>

        {isSaved && (
          <div className="success-message" role="status" style={{ maxWidth: 1180, margin: "0 auto 16px" }}>
            <CheckCircle2 size={18} />
            {t.saved}
          </div>
        )}

        <section className="profile-layout">
          {/* Profile Card */}
          <aside className="panel profile-card">
            <div className="profile-card-avatar">
              <div className="avatar profile-avatar">{initials}</div>
              <button className="profile-change-photo" type="button" aria-label={t.changePhoto}>
                <Camera size={14} />
              </button>
            </div>
            <h2>{fullName}</h2>
            <p className="profile-card-role">{form.role}</p>
            <div className="profile-card-details">
              <span>
                <Mail size={14} />
                {form.email}
              </span>
              <span>
                <Phone size={14} />
                {form.phone}
              </span>
              <span>
                <MapPin size={14} />
                {form.location}
              </span>
            </div>
          </aside>

          {/* Edit Form */}
          <div className="profile-form-area">
            <article className="panel profile-form-panel">
              <div className="panel-header">
                <div>
                  <h2>{t.personalInfo}</h2>
                  <p>{t.personalInfoHelp}</p>
                </div>
              </div>
              <div className="form-grid two-columns">
                <label>
                  {t.firstName}
                  <input
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </label>
                <label>
                  {t.lastName}
                  <input
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </label>
                <label>
                  {t.email}
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </label>
                <label>
                  {t.phone}
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </label>
              </div>
            </article>

            <article className="panel profile-form-panel">
              <div className="panel-header">
                <div>
                  <h2>{t.jobInfo}</h2>
                  <p>{t.jobInfoHelp}</p>
                </div>
              </div>
              <div className="form-grid two-columns">
                <label>
                  {t.department}
                  <select
                    value={form.department}
                    onChange={(e) => updateField("department", e.target.value)}
                  >
                    <option>Experience</option>
                    <option>Engineering</option>
                    <option>People Operations</option>
                    <option>Sales</option>
                  </select>
                </label>
                <label>
                  {t.role}
                  <input
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                  />
                </label>
                <label>
                  {t.location}
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </label>
                <label>
                  {t.startDate}
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </label>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
