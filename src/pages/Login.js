import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import api from "../api/client";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
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
      <div className="restricted-bar">⚠ SYSTEM ACCESS RESTRICTED — AUTHORIZED USERS ONLY</div>
      <div className="login-grid-bg" />
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">⊙</div>
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
          {error && <div className="login-error">{error}{attempts > 0 && <div className="attempts-warning">Attempt {attempts} of 5</div>}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="admin" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={loading}>
              {loading ? <><span className="spinner" /> Authenticating...</> : "Authenticate"}
            </button>
          </form>
          <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            Default: <span className="mono text-teal">admin</span> / <span className="mono text-teal">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
