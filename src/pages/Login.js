import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import api from "../api/client";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      login(res.data.user, res.data.token);
    } catch (err) {
      setAttempts(a => a + 1);
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="restricted-bar">SYSTEM ACCESS RESTRICTED — AUTHORIZED USERS ONLY</div>
      <div className="login-grid-bg" />
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">O</div>
          <div className="login-brand-name">NetWatch <span>Pro</span></div>
        </div>
        <h1 className="login-headline">Real-time Network<br />Security Monitoring</h1>
        <p className="login-sub">Built for CCNA professionals who need live visibility into their network infrastructure.</p>
        <div className="feature-list">
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>ICMP Ping Monitoring</strong> — track latency and uptime across all devices</div></div>
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>TCP Port Scanner</strong> — identify open services on any IP in your range</div></div>
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>Event Log</strong> — full timeline of network activity and alerts</div></div>
          <div className="feature-item"><div className="feature-dot" /><div className="feature-text"><strong>Role-based Access</strong> — admin and viewer roles with full audit trail</div></div>
        </div>
        <div className="tech-tags">
          {["React", "Flask", "SQLite", "JWT", "ICMP", "TCP"].map(t => <span key={t} className="tech-tag">{t}</span>)}
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-wrap">
          <h2>Authenticate</h2>
          <p>Enter your credentials to access the monitoring dashboard.</p>
          {error && (
            <div className="login-error">
              {error}
              {attempts > 0 && <div className="attempts-warning">Attempt {attempts} of 5</div>}
            </div>
          )}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                    fontSize: 16, padding: 4
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Authenticating...</> : "Authenticate"}
            </button>
          </form>
          <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-secondary)", textAlign: "center" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              style={{ background: "none", border: "none", color: "var(--teal)", cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}