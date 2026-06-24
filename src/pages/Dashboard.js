import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const res = await api.get("/api/stats"); setStats(res.data); }
    catch {} setLoading(false);
  };

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  if (loading) return <div className="loading"><span className="spinner" /> Loading dashboard...</div>;
  if (!stats) return <div className="empty-state"><p>Could not load dashboard data.</p></div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card teal"><div className="stat-label">Total Devices</div><div className="stat-value">{stats.total_devices}</div><div className="stat-sub">Registered hosts</div></div>
        <div className="stat-card green"><div className="stat-label">Online</div><div className="stat-value">{stats.online_devices}</div><div className="stat-sub">Responding to ping</div></div>
        <div className="stat-card red"><div className="stat-label">Offline</div><div className="stat-value">{stats.offline_devices}</div><div className="stat-sub">No response</div></div>
        <div className="stat-card blue"><div className="stat-label">Events</div><div className="stat-value">{stats.total_events}</div><div className="stat-sub">Total logged</div></div>
        <div className="stat-card yellow"><div className="stat-label">Critical</div><div className="stat-value">{stats.critical_events}</div><div className="stat-sub">High severity alerts</div></div>
        <div className="stat-card blue"><div className="stat-label">Users</div><div className="stat-value">{stats.total_users}</div><div className="stat-sub">System accounts</div></div>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Events</span>
          <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
        </div>
        {stats.recent_events.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><p>No events yet. Start scanning devices to generate events.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Type</th><th>Severity</th><th>Message</th><th>Source IP</th><th>Time</th></tr></thead>
              <tbody>
                {stats.recent_events.map(e => (
                  <tr key={e.id}>
                    <td><span className="mono" style={{ fontSize: 12 }}>{e.event_type}</span></td>
                    <td><span className={"badge-status badge-" + e.severity}>{e.severity}</span></td>
                    <td style={{ color: "var(--text-secondary)", maxWidth: 300 }}>{e.message}</td>
                    <td><span className="mono text-teal" style={{ fontSize: 12 }}>{e.source_ip || "—"}</span></td>
                    <td className="text-muted mono" style={{ fontSize: 11 }}>{new Date(e.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
