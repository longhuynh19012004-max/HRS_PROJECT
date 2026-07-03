import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Download,
  Filter,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
  Edit,
  RotateCcw
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import toast, { Toaster } from 'react-hot-toast'; 

type EmployeePageProps = {
  onLogout: () => void;
};

export function EmployeePage({ onLogout }: EmployeePageProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // 🔄 GỌI API TỪ BACKEND
  const { data, isLoading, error } = useQuery<any[]>({
    queryKey: ["employees-list", showDeleted],
    queryFn: async () => {
      // Khớp tham số includeDeleted với users.controller.ts của bạn
      const url = showDeleted ? "/users?includeDeleted=true" : "/users"; 
      const response = await axiosClient.get(url);
      return response.data;
    },
  });

  const accounts = Array.isArray(data) ? data : [];

  // 🗑️ HÀM XÓA (Soft Delete)
  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA nhân viên ${name}?`)) return;
    
    const toastId = toast.loading("Đang xử lý...");
    
    try {
      await axiosClient.delete(`/users/${id}`);
      queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      toast.success(`Đã xóa nhân viên ${name}!`, { id: toastId });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Không thể xóa nhân viên này.";
      toast.error(`Lỗi: ${Array.isArray(msg) ? msg.join(", ") : msg}`, { id: toastId });
    }
  };

  // ♻️ HÀM KHÔI PHỤC (Restore)
  const handleRestore = async (id: string | number, name: string) => {
    if (!window.confirm(`Bạn muốn KHÔI PHỤC tài khoản ${name}?`)) return;
    
    const toastId = toast.loading("Đang xử lý...");

    try {
      await axiosClient.patch(`/users/${id}/restore`);
      queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      toast.success(`Khôi phục thành công ${name}!`, { id: toastId });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Không thể khôi phục.";
      toast.error(`Lỗi: ${Array.isArray(msg) ? msg.join(", ") : msg}`, { id: toastId });
    }
  };

  // 🔍 HÀM LỌC DANH SÁCH (Tìm kiếm & Phân loại Đã xóa/Chưa xóa)
  const filteredAccounts = accounts.filter((acc) => {
    if (!acc) return false;

    // 1. Phân loại theo trạng thái xóa
    const isDeleted = acc.deletedAt != null; 
    
    if (showDeleted) {
      // Đang xem Thùng Rác -> Nếu tài khoản chưa xóa thì giấu đi
      if (!isDeleted) return false;
    } else {
      // Đang xem Bình Thường -> Nếu tài khoản đã xóa thì giấu đi
      if (isDeleted) return false;
    }

    // 2. Tìm kiếm theo tên hoặc email
    const emp = acc.employee || {};
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
    const email = (acc.email || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    
    return fullName.includes(search) || email.includes(search);
  });

  const getInitials = (firstName: string, lastName: string) => {
    const f = firstName ? firstName.charAt(0).toUpperCase() : "";
    const l = lastName ? lastName.charAt(0).toUpperCase() : "";
    return f + l || "EE";
  };

  const gridTemplate = "2.5fr 2fr 1.5fr 1fr 100px";

  return (
    <div className="app-shell">
      {/* Cấu hình thư viện thông báo góc phải trên */}
      <Toaster position="top-right" reverseOrder={false} />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>Workforce Suite</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <Link className="nav-item" to="/dashboard"><LayoutDashboard size={18} />Dashboard</Link>
          <Link className="nav-item active" to="/employee"><Users size={18} />Employees</Link>
          <Link className="nav-item" to="/schedule"><CalendarDays size={18} />Schedule</Link>
          <Link className="nav-item" to="/settings"><Settings size={18} />Settings</Link>
          <button className="nav-item nav-button" onClick={onLogout} type="button"><LogOut size={18} />Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Employee Management</p>
            <h1>Employees</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button"><Bell size={19} /></button>
            <Link className="primary-button link-button" to="/dashboard/new"><Plus size={17} />Add Employee</Link>
          </div>
        </header>

        <section className="controls-bar" aria-label="Table controls">
          <span className="search-field">
            <Search size={18} />
            <input
              placeholder="Tìm kiếm nhân viên theo tên hoặc email..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </span>

          <div className="button-group">
            <button 
              className={showDeleted ? "primary-button" : "secondary-button"} 
              type="button"
              onClick={() => setShowDeleted(!showDeleted)}
              style={{ backgroundColor: showDeleted ? '#f1f5f9' : '', color: showDeleted ? '#0f172a' : '' }}
            >
              {showDeleted ? "Đang xem: Đã xóa" : "Xem tài khoản đã xóa"}
            </button>
            <button className="secondary-button" type="button"><Filter size={17} />Filter</button>
            <button className="secondary-button" type="button"><Download size={17} />Export</button>
          </div>
        </section>

        <section className="panel employee-directory-panel">
          <div className="panel-header">
            <div>
              <h2>Employee Directory</h2>
              <p>All employee profiles, teams, roles, and employment status from database.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-panel">Đang tải danh sách nhân viên từ Backend...</div>
          ) : error ? (
            <div className="loading-panel" style={{ color: "red" }}>Không thể kết nối API.</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="loading-panel">Không có dữ liệu.</div>
          ) : (
            <div className="employee-table" role="table">
              <div className="table-row table-head" role="row" style={{ display: 'grid', gridTemplateColumns: gridTemplate }}>
                <span>Employee</span>
                <span>Email</span>
                <span>Department</span>
                <span>Status</span>
                <span style={{ textAlign: "center" }}>Actions</span>
              </div>
              
              {filteredAccounts.map((account) => {
                const emp = account.employee || account; 
                const fName = emp.firstName || "";
                const lName = emp.lastName || "";
                const fullName = `${fName} ${lName}`.trim() || "Chưa cập nhật tên";
                
                const isDeleted = account.deletedAt != null; 
                const statusStr = isDeleted ? "Deleted" : (emp.status || "Active");

                return (
                  <div className="table-row" role="row" key={account.id} style={{ display: 'grid', gridTemplateColumns: gridTemplate }}>
                    <span className="employee-cell">
                      <span className="avatar">
                        {getInitials(fName, lName)}
                      </span>
                      <div>
                        <strong>{fullName}</strong>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{account.role || emp.role || 'user'}</div>
                      </div>
                    </span>
                    <span>{account.email || "---"}</span>
                    <span>{emp.department || "---"}</span>
                    <span>
                      <span className={`status-badge ${statusStr.toLowerCase()}`}>
                        {statusStr}
                      </span>
                    </span>
                    
                    <span style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
                      {isDeleted ? (
                        <button
                          onClick={() => handleRestore(account.id, fullName)}
                          style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}
                          title="Khôi phục tài khoản"
                        >
                          <RotateCcw size={18} />
                        </button>
                      ) : (
                        <>
                          <Link
                            to={`/dashboard/edit/${account.id}`}
                            style={{ color: "#0ea5e9" }}
                            title="Sửa thông tin"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(account.id, fullName)}
                            style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer" }}
                            title="Xóa nhân viên"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}