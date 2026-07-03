import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Thêm useNavigate để chuyển trang sau khi lưu
import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  Save,
  Settings,
  UserRoundPlus,
  Users,
} from "lucide-react";
import axiosClient from "../api/axiosClient"; // 👈 Import cục gọi API của chúng ta

type AddEmployeePageProps = {
  onLogout: () => void;
};

type EmployeeForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  startDate: string;
  location: string;
  salary: string;
  status: string;
};

const initialForm: EmployeeForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "People Operations",
  role: "",
  startDate: "",
  location: "Ho Chi Minh City",
  salary: "",
  status: "Active", // Sửa mặc định thành Active cho hợp lý
};

export function AddEmployeePage({ onLogout }: AddEmployeePageProps) {
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [isSaved, setIsSaved] = useState(false);
  
  // 🚀 Thêm State để quản lý trạng thái Loading và Lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const employeeName = useMemo(() => {
    const name = `${form.firstName} ${form.lastName}`.trim();
    return name || "New employee";
  }, [form.firstName, form.lastName]);

  const updateField = (field: keyof EmployeeForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
    setError(""); // Xóa lỗi khi người dùng bắt đầu gõ lại
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      setIsLoading(true);
      setError("");
      setIsSaved(false);


      const { role, ...payload } = form;
      
      await axiosClient.post("/users", payload); 

      // 2. Hiển thị thông báo thành công
      setIsSaved(true);

      // 3. Chuyển hướng người dùng về trang Danh sách sau 1.5 giây
      setTimeout(() => {
        navigate("/employee");
      }, 1500);

    } catch (err: any) {
      // Bắt lỗi từ Backend
      const backendError = err.response?.data?.message || "Có lỗi xảy ra khi tạo nhân viên!";
      
      // Nếu Backend trả về mảng lỗi (Validation Pipe), nối chúng lại để hiển thị
      if (Array.isArray(backendError)) {
        setError(backendError.join(", "));
      } else {
        setError(backendError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* ... (GIỮ NGUYÊN PHẦN BRAND VÀ NAV CỦA BẠN) ... */}
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
            <h1>Add employee</h1>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" type="button">
              <Bell size={19} />
            </button>
            <Link className="secondary-button link-button" to="/employee">
              <ArrowLeft size={17} />
              Back
            </Link>
          </div>
        </header>

        <form className="employee-form-layout" onSubmit={handleSubmit}>
          {/* CỘT BÊN TRÁI: THÔNG TIN CHI TIẾT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <section className="panel employee-form-panel" aria-labelledby="profile-title">
              <div className="panel-header">
                <div>
                  <h2 id="profile-title">Profile details</h2>
                  <p>Core contact information used across the employee record.</p>
                </div>
              </div>

              <div className="form-grid two-columns">
                <label>
                  First name
                  <input
                    required
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                  />
                </label>
                <label>
                  Last name
                  <input
                    required
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                  />
                </label>
                <label>
                  Email
                  <span className="input-with-icon">
                    <Mail size={17} />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                    />
                  </span>
                </label>
                <label>
                  Phone
                  <span className="input-with-icon">
                    <Phone size={17} />
                    <input
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                    />
                  </span>
                </label>
              </div>
            </section>

            <section className="panel employee-form-panel" aria-labelledby="job-title">
              <div className="panel-header">
                <div>
                  <h2 id="job-title">Job assignment</h2>
                  <p>Department, role, start date, and reporting line.</p>
                </div>
              </div>

              <div className="form-grid two-columns">
                <label>
                  Department
                  <select value={form.department} onChange={(event) => updateField("department", event.target.value)}>
                    <option value="People Operations">People Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </label>
                <label>
                  Role
                  <input
                    required
                    value={form.role}
                    onChange={(event) => updateField("role", event.target.value)}
                  />
                </label>
                <label>
                  Start date
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(event) => updateField("startDate", event.target.value)}
                  />
                </label>
                <label>
                  Location
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* CỘT BÊN PHẢI: SUMMARY VÀ NÚT SUBMIT */}
          <aside className="panel employee-summary-panel" aria-label="Employee summary">
            <div className="summary-avatar">
              <UserRoundPlus size={28} />
            </div>
            <div>
              <h2>{employeeName}</h2>
              <p>{form.role || "Role not assigned"}</p>
            </div>

            <div className="summary-list">
              <span>
                Department
                <strong>{form.department}</strong>
              </span>
              <span>
                Status
                <strong>{form.status}</strong>
              </span>
            </div>

            <div className="form-grid">
              <label>
                Salary
                <input
                  required
                  inputMode="numeric"
                  placeholder="VD: 15000000"
                  value={form.salary}
                  onChange={(event) => updateField("salary", event.target.value)}
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Active">Active</option>
                  <option value="Leave">Leave</option>
                </select>
              </label>
            </div>

            {/* Hiển thị lỗi hoặc thành công */}
            {error && (
              <div className="error-message" style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
                ❌ {error}
              </div>
            )}
            
            {isSaved && !error && (
              <div className="success-message" role="status" style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <CheckCircle2 size={18} />
                Tạo nhân viên thành công!
              </div>
            )}

            <button 
              className="primary-button form-submit-button" 
              type="submit"
              disabled={isLoading}
              style={{ marginTop: '16px' }}
            >
              <Save size={18} />
              {isLoading ? "Đang lưu..." : "Save Employee"}
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
}