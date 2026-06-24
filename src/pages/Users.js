import React, { useEffect, useState } from "react";
import api from "../api/client";

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return React.createElement("div", {className:"toast toast-"+type}, msg);
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ username:"", email:"", password:"", role:"viewer" });
  const showToast = (msg, type="success") => setToast({ msg, type });
  const load = async () => { try { const r = await api.get("/api/users"); setUsers(r.data); } catch(e){} setLoading(false); };
  useEffect(() => { load(); }, []);
  const addUser = async (e) => {
    e.preventDefault();
    try { await api.post("/api/users", form); showToast("User created"); setForm({username:"",email:"",password:"",role:"viewer"}); setShowAdd(false); load(); }
    catch (err) { showToast(err.response?.data?.error||"Failed","error"); }
  };
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await api.delete("/api/users/"+id); showToast("Deleted"); load(); }
    catch (err) { showToast(err.response?.data?.error||"Failed","error"); }
  };
  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="filter-bar"><button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ New User</button></div>
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">Create User</div>
            <form onSubmit={addUser}>
              <div className="form-group"><label className="form-label">Username</label><input className="form-input" placeholder="john_doe" value={form.username} onChange={e => setForm({...form,username:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Role</label><select className="form-select" value={form.role} onChange={e => setForm({...form,role:e.target.value})}><option value="viewer">Viewer</option><option value="admin">Admin</option></select></div>
              <div style={{display:"flex",gap:10}}><button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="btn btn-primary" style={{flex:1}}>Create</button></div>
            </form>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header"><span className="card-title">Users ({users.length})</span><button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button></div>
        {loading ? <div className="loading"><span className="spinner" /> Loading...</div> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>{users.map(u => (
              <tr key={u.id}>
                <td style={{fontWeight:600}}>{u.username}</td>
                <td className="text-muted">{u.email}</td>
                <td><span className={"badge-status badge-"+u.role}>{u.role}</span></td>
                <td className="text-muted mono" style={{fontSize:11}}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}