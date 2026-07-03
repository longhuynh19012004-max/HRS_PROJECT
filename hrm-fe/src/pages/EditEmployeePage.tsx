import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Save,
  Settings,
  UserRoundPlus,
  Users,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import toast, { Toaster } from "react-hot-toast";

type EditEmployeePageProps = {
  onLogout: () => void;
};

export function EditEmployeePage({ onLogout }: EditEmployeePageProps) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    startDate: "",
    location: "",
    salary: "",
    status: "",
  });

  // 1. Lấy dữ liệu cũ từ Database đổ vào Form
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await axiosClient.get(`/users/${id}`);
        const acc = response.data;
        const emp = acc.employee || {};

        setForm({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: acc.email || "",
          phone: emp.phone || "",
          department: emp.department || "Engineering",
          position: emp.position || "", // 🚀 HỨNG ĐÚNG TRƯỜNG POSITION TỪ BACKEND
          startDate: emp.startDate || "",
          location: emp.location || "",
          salary: String(emp.salary || ""),
          status: emp.status || "Active",
        });
      } catch (error) {
        toast.error("Không thể lấy dữ liệu nhân viên!");
      } finally {
        setIsFetching(false);
      }
    }
    fetchEmployee();
  }, [id]);

  const updateField = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // 2. Xử lý lưu dữ liệu (Cập nhật)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const toastId = toast.loading("Đang cập nhật...");

    try {
      setIsLoading(true);
      
      // 🚀 CHỈ BÓC TÁCH EMAIL RA (Vì email thuộc bảng Account không cho sửa ở đây)
      // payload lúc này sẽ giữ lại trường 'position' để gửi lên cho Backend lưu vào DB
      const { email, ...payload } = form;

      // Gửi 'payload' chuẩn chỉnh lên Backend
      await axiosClient.patch(`/users/${id}`, payload);
      
      // Xóa cache để làm mới trang danh sách nhân viên
      queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      
      toast.success("Cập nhật thành công!", { id: toastId });
      
      setTimeout(() => {
        navigate("/employee"); 
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Lỗi khi cập nhật";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="loading-panel">Đang tải dữ liệu nhân viên...</div>;

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div><strong>PeopleOps</strong><span>Workforce Suite</span></div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <Link className="nav-item" to="/dashboard">
            <LayoutDashboard size={18} />Dashboard
          </Link>
          <Link className="nav-item active" to="/employee">
            <Users size={18} />Employees
          </Link>
          <Link className="nav-item" to="/schedule">
            <CalendarDays size={18} />Schedule
          </Link>
          <Link className="nav-item" to="/settings">
            <Settings size={18} />Settings
          </Link>
          <button className="nav-item nav-button" onClick={onLogout} type="button">
            <LogOut size={18} />Logout
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">Employee Management</p><h1>Edit Employee</h1></div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" type="button">
              <Bell size={19} />
            </button>
            <Link className="secondary-button link-button" to="/employee"><ArrowLeft size={17} />Back</Link>
          </div>
        </header>

        <form className="employee-form-layout" onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <section className="panel employee-form-panel">
              <div className="panel-header"><h2>Profile details</h2></div>
              <div className="form-grid two-columns">
                <label>First name<input required value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} /></label>
                <label>Last name<input required value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} /></label>
                <label>Email (Chỉ xem)<input disabled value={form.email} style={{ backgroundColor: '#f1f5f9' }} /></label>
                <label>Phone<input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></label>
              </div>
            </section>

            <section className="panel employee-form-panel">
              <div className="panel-header"><h2>Job assignment</h2></div>
              <div className="form-grid two-columns">
                <label>Department
                  <select value={form.department} onChange={(e) => updateField("department", e.target.value)}>
                    <option value="People Operations">People Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </label>
                {/* 🚀 ĐỔI VALUE VÀ ONCHANGE THÀNH POSITION */}
                <label>Role / Position<input required value={form.position} onChange={(e) => updateField("position", e.target.value)} /></label>
                <label>Start date<input required type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} /></label>
                <label>Location<input value={form.location} onChange={(e) => updateField("location", e.target.value)} /></label>
              </div>
            </section>
          </div>

          <aside className="panel employee-summary-panel">
            <div className="summary-avatar"><UserRoundPlus size={28} /></div>
            {/* 🚀 ĐỔI THÀNH POSITION ĐỂ HIỂN THỊ TRÊN THẺ SUMMARY */}
            <div><h2>{form.firstName} {form.lastName}</h2><p>{form.position || "Chưa có chức vụ"}</p></div>
            <div className="form-grid">
              <label>Salary<input value={form.salary} onChange={(e) => updateField("salary", e.target.value)} /></label>
              <label>Status
                <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Leave">Leave</option>
                </select>
              </label>
            </div>
            <button className="primary-button form-submit-button" type="submit" disabled={isLoading} style={{ marginTop: '16px' }}>
              <Save size={18} /> {isLoading ? "Saving..." : "Update Changes"}
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
}