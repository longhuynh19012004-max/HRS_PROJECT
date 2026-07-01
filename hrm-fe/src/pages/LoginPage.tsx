import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

type LoginPageProps = {
  onLogin: (email: string) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("olivia@peopleops.com");
  const [password, setPassword] = useState("peopleops");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@") || password.trim().length < 6) {
      setError("Enter a valid work email and a password with at least 6 characters.");
      return;
    }

    setError("");
    onLogin(email);
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

          <button className="primary-button auth-submit" type="submit">
            <LogIn size={18} />
            Sign In
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
