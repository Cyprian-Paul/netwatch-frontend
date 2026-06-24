import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const load = async () => { try { const r = await api.get("/api/audit?limit=200"); setLogs(r.data); } catch(e){} setLoading(false); };
  useEffect(() => { load(); }, []);
  const filtered = logs.filter(l =>
    (l.username||"").toLowerCase().includes(filter.toLowerCase()) ||
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    (l.target||"").includes(filter)
  );
  const colors = { LOGIN:"#2ed573", ADD_DEVICE:"#00e5c3", DELETE_DEVICE:"#ff4757", PORT_SCAN:"#1e90ff", CREATE_USER:"#00e5c3", DELETE_USER:"#ff4757" };
  return (
    <div>
      <div className="filter-bar">
        <input className="form-input" placeholder="Filter by user, action, target..." value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Audit Trail ({filtered.length})</span></div>
        {loading ? <div className="loading"><span className="spinner" /> Loading...</div> : filtered.length===0 ? (
          <div className="empty-state"><p>No audit records yet.</p></div>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Target</th><th>IP</th></tr></thead>
            <tbody>{filtered.map(l => (
              <tr key={l.id}>
                <td className="mono text-muted" style={{fontSize:11}}>{new Date(l.created_at).toLocaleString()}</td>
                <td style={{fontWeight:600,fontSize:13}}>{l.username||"--"}</td>
                <td><span className="mono" style={{fontSize:11,color:colors[l.action]||"#7fb3d3",background:"rgba(255,255,255,0.04)",padding:"2px 6px",borderRadius:4}}>{l.action}</span></td>
                <td className="mono text-teal" style={{fontSize:12}}>{l.target||"--"}</td>
                <td className="mono text-muted" style={{fontSize:12}}>{l.ip_address||"--"}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}