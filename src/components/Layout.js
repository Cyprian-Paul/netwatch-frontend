import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import Dashboard from "../pages/Dashboard";
import Devices from "../pages/Devices";
import PortScanner from "../pages/PortScanner";
import Events from "../pages/Events";
import Users from "../pages/Users";
import AuditLog from "../pages/AuditLog";
import api from "../api/client";

const nav = [
  { path: "/", label: "Dashboard", icon: "▦", section: "monitor" },
  { path: "/devices", label: "Devices", icon: "⊡", section: "monitor" },
  { path: "/scanner", label: "Port Scanner", icon: "⊕", section: "monitor" },
  { path: "/events", label: "Event Log", icon: "≡", section: "monitor", badge: "events" },
  { path: "/users", label: "Users", icon: "◉", section: "admin", adminOnly: true },
  { path: "/audit", label: "Audit Log", icon: "⊟", section: "admin", adminOnly: true },
];

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [clock, setClock] = useState("");
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get("/api/events?severity=critical&limit=50")
      .then(res => setCriticalCount(res.data.length))
      .catch(() => {});
  }, [location.pathname]);

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  const currentPage = nav.find(n => isActive(n.path))?.label || "NetWatch Pro";

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⊙</div>
          <div className="logo-text">NetWatch <span>Pro</span></div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Monitor</div>
          {nav.filter(n => n.section === "monitor").map(item => (
            (!item.adminOnly || user?.role === "admin") && (
              <button key={item.path} className={"nav-item " + (isActive(item.path) ? "active" : "")} onClick={() => navigate(item.path)}>
                <span>{item.icon}</span>
                {item.label}
                {item.badge === "events" && criticalCount > 0 && <span className="badge">{criticalCount}</span>}
              </button>
            )
          ))}
          {user?.role === "admin" && (
            <>
              <div className="nav-section-label">Admin</div>
              {nav.filter(n => n.section === "admin").map(item => (
                <button key={item.path} className={"nav-item " + (isActive(item.path) ? "active" : "")} onClick={() => navigate(item.path)}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role?.toUpperCase()}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign out">⏻</button>
        </div>
      </aside>
      <main className="main-content">
        <div className="top-bar">
          <h1>{currentPage}</h1>
          <span className="status-pill status-live">LIVE</span>
          <span className="status-pill status-high">HIGH</span>
          <span className="clock">{clock}</span>
        </div>
        <div className="page-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/scanner" element={<PortScanner />} />
            <Route path="/events" element={<Events />} />
            <Route path="/users" element={<Users />} />
            <Route path="/audit" element={<AuditLog />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
