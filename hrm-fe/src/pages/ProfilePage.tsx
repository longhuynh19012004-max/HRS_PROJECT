import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  Camera,
  CheckCircle2,
  House,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  UserRound,
} from "lucide-react";
import { AppSettings } from "../types/settings";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import { NotificationBell } from "../components/NotificationBell";

type ProfilePageProps = {
  settings: AppSettings;
  onLogout: () => void;
};

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  startDate: string;
};

const initialProfile: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  location: "",
  startDate: "",
};

export function ProfilePage({ settings, onLogout }: ProfilePageProps) {
  const [form, setForm] = useState<ProfileForm>(initialProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get("/profile/me");
        const data = response.data;

        setForm({
          firstName: data.employee?.firstName || "",
          lastName: data.employee?.lastName || "",
          email: data.email || "",
          phone: data.employee?.phone || "",
          department: data.employee?.department || "",
          position: data.employee?.position || "",
          location: data.employee?.location || "",
          startDate: data.employee?.startDate || "",
        });
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load profile. Please try again.";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await axiosClient.patch("/profile/me", {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        department: form.department,
        position: form.position,
        location: form.location,
        startDate: form.startDate,
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save profile!";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setIsChangingPassword(true);
      await axiosClient.patch("/profile/me/password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to change password!";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Employee";
  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "?";

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
            Home
          </Link>
          <Link className="nav-item" to="/schedule">
            <CalendarDays size={18} />
            Schedule
          </Link>
          <Link className="nav-item active" to="/profile">
            <UserRound size={18} />
            Profile
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
            <p className="eyebrow">Personal Information</p>
            <h1>My Profile</h1>
          </div>
          <div className="topbar-actions">
            <NotificationBell />
            <button
              className="primary-button"
              onClick={handleSave}
              disabled={isLoading || isSaving}
              type="button"
            >
              {isSaving ? <Loader2 size={18} className="spin-icon" /> : <Save size={18} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="loading-panel" style={{ maxWidth: 1180, margin: "0 auto 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Loader2 size={18} className="spin-icon" />
            Loading profile...
          </div>
        )}

        {!isLoading && (
          <section className="profile-layout">
            {/* Profile Card */}
            <aside className="panel profile-card">
              <div className="profile-card-avatar">
                <div className="avatar profile-avatar">{initials}</div>
                <button className="profile-change-photo" type="button" aria-label="Change">
                  <Camera size={14} />
                </button>
              </div>
              <h2>{fullName}</h2>
              <p className="profile-card-role">{form.position}</p>
              <div className="profile-card-details">
                <span>
                  <Mail size={14} />
                  {form.email || "—"}
                </span>
                <span>
                  <Phone size={14} />
                  {form.phone || "—"}
                </span>
                <span>
                  <MapPin size={14} />
                  {form.location || "—"}
                </span>
              </div>
            </aside>

            {/* Edit Form */}
            <div className="profile-form-area">
              {/* Personal Information */}
              <article className="panel profile-form-panel">
                <div className="panel-header">
                  <div>
                    <h2>Personal Information</h2>
                    <p>Update your basic contact and identity details.</p>
                  </div>
                </div>
                <div className="form-grid two-columns">
                  <label>
                    First Name
                    <input
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </label>
                  <label>
                    Work Email
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                    />
                  </label>
                  <label>
                    Phone Number
                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </label>
                </div>
              </article>

              {/* Job Information */}
              <article className="panel profile-form-panel">
                <div className="panel-header">
                  <div>
                    <h2>Job Information</h2>
                    <p>Your current role and department details.</p>
                  </div>
                </div>
                <div className="form-grid two-columns">
                  <label>
                    Department
                    <select
                      value={form.department}
                      onChange={(e) => updateField("department", e.target.value)}
                    >
                      <option value="">— Select —</option>
                      <option>Experience</option>
                      <option>Engineering</option>
                      <option>People Operations</option>
                      <option>Sales</option>
                    </select>
                  </label>
                  <label>
                    Position
                    <input
                      value={form.position}
                      onChange={(e) => updateField("position", e.target.value)}
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                  </label>
                  <label>
                    Start Date
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </label>
                </div>
              </article>

              {/* Change Password */}
              <article className="panel profile-form-panel">
                <div className="panel-header">
                  <div>
                    <h2>
                      <KeyRound size={18} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 6 }} />
                      Change Password
                    </h2>
                    <p>Update your account password for security.</p>
                  </div>
                </div>



                <div className="form-grid two-columns">
                  <label style={{ gridColumn: "1 / -1" }}>
                    Current Password
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </label>
                  <label>
                    New Password
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </label>
                  <label>
                    Confirm New Password
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </label>
                </div>

                <button
                  className="primary-button"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                  type="button"
                  style={{ marginTop: 18 }}
                >
                  {isChangingPassword ? <Loader2 size={18} className="spin-icon" /> : <KeyRound size={18} />}
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
