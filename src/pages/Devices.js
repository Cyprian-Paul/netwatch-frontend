import React, { useEffect, useState, useContext } from "react";
import api from "../api/client";
import { AuthContext } from "../App";

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return React.createElement("div", {className: "toast toast-" + type}, msg);
}

export default function Devices() {
  const { user } = useContext(AuthContext);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [pinging, setPinging] = useState({});
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", ip_address: "", device_type: "host", location: "" });
  const [search, setSearch] = useState("");
  const showToast = (msg, type="success") => setToast({ msg, type });
  const load = async () => { try { const r = await api.get("/api/devices"); setDevices(r.data); } catch(e){} setLoading(false); };
  useEffect(() => { load(); }, []);
  const addDevice = async (e) => {
    e.preventDefault();
    try { await api.post("/api/devices", form); showToast("Device added"); setForm({ name:"", ip_address:"", device_type:"host", location:"" }); setShowAdd(false); load(); }
    catch (err) { showToast(err.response?.data?.error || "Failed", "error"); }
  };
  const ping = async (id) => {
    setPinging(p => ({ ...p, [id]: true }));
    try { const r = await api.post("/api/devices/" + id + "/ping"); showToast(r.data.ip + ": " + r.data.status + (r.data.latency ? " (" + r.data.latency + "ms)" : "")); load(); }
    catch (err) { showToast("Ping failed", "error"); }
    setPinging(p => ({ ...p, [id]: false }));
  };
  const deleteDevice = async (id) => {
    if (!window.confirm("Delete this device?")) return;
    try { await api.delete("/api/devices/" + id); showToast("Deleted"); load(); }
    catch { showToast("Failed", "error"); }
  };
  const filtered = devices.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.ip_address.includes(search));
  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="filter-bar">
        <input className="form-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-ghost btn-sm" onClick={() => devices.forEach(d => ping(d.id))}>Ping All</button>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Device</button>
      </div>
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">Add Device</div>
            <form onSubmit={addDevice}>
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Router-01" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">IP Address</label><input className="form-input" placeholder="192.168.1.1" value={form.ip_address} onChange={e => setForm({...form, ip_address:e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.device_type} onChange={e => setForm({...form, device_type:e.target.value})}><option value="host">Host</option><option value="router">Router</option><option value="switch">Switch</option><option value="firewall">Firewall</option><option value="server">Server</option></select></div>
                <div className="form-group"><label className="form-label">Location</label><input className="form-input" placeholder="Server Room" value={form.location} onChange={e => setForm({...form, location:e.target.value})} /></div>
              </div>
              <div style={{display:"flex",gap:10}}><button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary" style={{flex:1}}>Add Device</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header"><span className="card-title">Devices ({filtered.length})</span><button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button></div>
        {loading ? <div className="loading"><span className="spinner" /> Loading...</div> : filtered.length===0 ? <div className="empty-state"><p>No devices yet.</p></div> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>IP</th><th>Type</th><th>Location</th><th>Status</th><th>Latency</th><th>Last Seen</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(d => (
              <tr key={d.id}>
                <td style={{fontWeight:600}}>{d.name}</td>
                <td><span className="mono text-teal">{d.ip_address}</span></td>
                <td className="text-muted">{d.device_type}</td>
                <td className="text-muted">{d.location||"--"}</td>
                <td><span className={"badge-status badge-"+(d.status==="online"?"online":d.status==="offline"?"offline":"unknown")}>{d.status}</span></td>
                <td>{d.latency!=null ? <span className="latency">{d.latency}ms</span> : <span className="text-muted">--</span>}</td>
                <td className="text-muted" style={{fontSize:11}}>{d.last_seen ? new Date(d.last_seen).toLocaleString() : "--"}</td>
                <td><div style={{display:"flex",gap:6}}><button className="btn btn-ghost btn-sm" onClick={() => ping(d.id)} disabled={pinging[d.id]}>Ping</button>{user?.role==="admin" && <button className="btn btn-danger btn-sm" onClick={() => deleteDevice(d.id)}>Delete</button>}</div></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}