import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password
      });
      setSuccess("Account created successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally { setLoading(false); }
  };

  const passwordsMatch = form.confirm_password && form.password === form.confirm_password;
  const passwordsMismatch = form.confirm_password && form.password !== form.confirm_password;

  return (
    <div className="login-page">
      <div className="restricted-bar">SYSTEM ACCESS RESTRICTED — AUTHORIZED USERS ONLY</div>
      <div className="login-grid-bg" />
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">O</div>
          <div className="login-brand-name">NetWatch <span>Pro</span></div>
        </div>
        <h1 className="login-headline">Join NetWatch<br />Pro Today</h1>
        <p className="login-sub">Create your account to start monitoring your network infrastructure in real time.</p>
        <div className="feature-list">
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>Free to use</strong> — no credit card required</div></div>
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>Secure</strong> — bcrypt password hashing and JWT auth</div></div>
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>Full access</strong> — ping devices, scan ports, view logs</div></div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-wrap">
          <h2>Create Account</h2>
          <p>Fill in the details below to register.</p>

          {error && <div className="login-error">{error}</div>}
          {success && (
            <div style={{ background: "rgba(46,213,115,0.1)", border: "1px solid rgba(46,213,115,0.3)", color: "var(--green)", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {success}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                placeholder="Choose a username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, padding: 4 }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-input"
                  placeholder="Repeat your password"
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  style={{ paddingRight: 44, borderColor: passwordsMismatch ? "var(--red)" : passwordsMatch ? "var(--green)" : undefined }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, padding: 4 }}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {passwordsMismatch && <div style={{ color: "var(--red)", fontSize: 11, marginTop: 4 }}>Passwords do not match</div>}
              {passwordsMatch && <div style={{ color: "var(--green)", fontSize: 11, marginTop: 4 }}>Passwords match</div>}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-secondary)", textAlign: "center" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{ background: "none", border: "none", color: "var(--teal)", cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}