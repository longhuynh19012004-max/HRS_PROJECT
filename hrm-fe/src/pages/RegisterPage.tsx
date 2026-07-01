import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

type RegisterPageProps = {
  onRegister: () => void;
};

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !company.trim() || !email.includes("@") || password.trim().length < 6) {
      setError("Complete all fields with a valid work email and a password with at least 6 characters.");
      return;
    }

    setError("");
    onRegister();
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
          <p className="eyebrow">Create Workspace</p>
          <h1>Register your HR workspace</h1>
          <p>Set up a frontend-only account to preview the employee management dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Olivia Martin"
              type="text"
              value={fullName}
            />
          </label>

          <label>
            Company
            <input
              autoComplete="organization"
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Acme People Team"
              type="text"
              value={company}
            />
          </label>

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
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button auth-submit" type="submit">
            <UserPlus size={18} />
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>

      <section className="auth-aside register-aside" aria-label="Registration summary">
        <div>
          <span>Fast Setup</span>
          <strong>Start managing your team</strong>
          <p>Create a workspace view for employee records, hiring signals, payroll summaries, and HR operations.</p>
        </div>
        <div className="auth-stat-grid">
          <article>
            <strong>4</strong>
            <span>Departments</span>
          </article>
          <article>
            <strong>15</strong>
            <span>Open roles</span>
          </article>
        </div>
      </section>
    </main>
  );
}
