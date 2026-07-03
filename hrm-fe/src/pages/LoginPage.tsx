import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import axiosClient from "../api/axiosClient"; // Đảm bảo đường dẫn này đúng với project của bạn

type LoginPageProps = {
  // Cập nhật hàm để truyền cả email và role lấy từ Token ra ngoài
  onLogin: (email: string, role: "admin" | "user") => void; 
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@gmail.com"); // Bạn có thể sửa email mặc định tại đây để test nhanh
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@") || password.trim().length < 6) {
      setError("Enter a valid work email and a password with at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await axiosClient.post("/auth/login", { email, password });
      
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);

      const payloadBase64 = token.split(".")[1]; 
      const decodedPayload = JSON.parse(atob(payloadBase64)); 

      const rawRole = decodedPayload.systemRole || decodedPayload.role || "";
      const tokenRole = rawRole.toLowerCase() === "admin" ? "admin" : "user";

      console.log("=> Quyền hạn sau khi chuẩn hóa:", tokenRole);

      onLogin(email, tokenRole);
    } catch (err: any) {
      const backendError = err.response?.data?.message || "Login failed. Please check your credentials!";
      setError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>PeopleOps</strong>
            <span>Workforce Suite</span>
          </div>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Employee Management</p>
          <h1>Sign in to your workspace</h1>
          <p>Access your HR dashboard, employee directory, payroll signals, and team activity.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Work email
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button auth-submit" type="submit" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          New to PeopleOps? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-hint">
          Use <strong>admin@peopleops.com</strong> for admin dashboard access. Any other valid email opens the
          employee home.
        </p>
      </section>

      <section className="auth-aside" aria-label="Workspace summary">
        <div>
          <span>Today</span>
          <strong>248 employees</strong>
          <p>Workforce visibility for managers, people partners, and operations teams.</p>
        </div>
        <div className="auth-stat-grid">
          <article>
            <strong>94%</strong>
            <span>Retention</span>
          </article>
          <article>
            <strong>18d</strong>
            <span>Time to hire</span>
          </article>
        </div>
      </section>
    </main>
  );
}