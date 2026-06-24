import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [severity, setSeverity] = useState("all");
  const load = async () => {
    const url = severity!=="all" ? "/api/events?severity="+severity+"&limit=200" : "/api/events?limit=200";
    try { const r = await api.get(url); setEvents(r.data); } catch(e){}
    setLoading(false);
  };
  useEffect(() => { load(); }, [severity]);
  const filtered = events.filter(e =>
    e.message.toLowerCase().includes(filter.toLowerCase()) ||
    (e.source_ip||"").includes(filter) ||
    e.event_type.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <div className="filter-bar">
        <input className="form-input" placeholder="Filter events..." value={filter} onChange={e => setFilter(e.target.value)} />
        <select className="form-select" style={{maxWidth:160}} value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Event Log ({filtered.length})</span></div>
        {loading ? <div className="loading"><span className="spinner" /> Loading...</div> : filtered.length===0 ? (
          <div className="empty-state"><p>No events found. Ping devices or run port scans to generate events.</p></div>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Time</th><th>Type</th><th>Severity</th><th>Message</th><th>Source IP</th></tr></thead>
            <tbody>{filtered.map(e => (
              <tr key={e.id}>
                <td className="mono text-muted" style={{fontSize:11}}>{new Date(e.created_at).toLocaleString()}</td>
                <td><span className="mono" style={{fontSize:11,color:"var(--text-secondary)"}}>{e.event_type}</span></td>
                <td><span className={"badge-status badge-"+e.severity}>{e.severity}</span></td>
                <td style={{color:"var(--text-secondary)",maxWidth:320,fontSize:13}}>{e.message}</td>
                <td><span className="mono text-teal" style={{fontSize:12}}>{e.source_ip||"--"}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}