import React, { useState } from "react";
import api from "../api/client";

export default function PortScanner() {
  const [form, setForm] = useState({ target_ip:"", start_port:1, end_port:1024 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scan = async (e) => {
    e.preventDefault(); setError(""); setResult(null); setLoading(true);
    try { const r = await api.post("/api/scan/ports", form); setResult(r.data); }
    catch (err) { setError(err.response?.data?.error || "Scan failed."); }
    setLoading(false);
  };

  const presets = { Web:[80,1024], SSH:[22,22], RDP:[3389,3389], Database:[1433,5432], "All Common":[1,1024] };

  return (
    <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,alignItems:"start"}}>
      <div className="card">
        <div className="card-header"><span className="card-title">TCP Port Scanner</span></div>
        <form onSubmit={scan}>
          <div className="form-group"><label className="form-label">Target IP</label><input className="form-input" placeholder="192.168.1.1" value={form.target_ip} onChange={e => setForm({...form,target_ip:e.target.value})} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Start Port</label><input type="number" className="form-input" value={form.start_port} onChange={e => setForm({...form,start_port:parseInt(e.target.value)})} /></div>
            <div className="form-group"><label className="form-label">End Port</label><input type="number" className="form-input" value={form.end_port} onChange={e => setForm({...form,end_port:parseInt(e.target.value)})} /></div>
          </div>
          <div style={{marginBottom:16}}>
            <label className="form-label">Presets</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
              {Object.entries(presets).map(([name,range]) => (
                <button key={name} type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({...f,start_port:range[0],end_port:range[1]}))}>{name}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} disabled={loading}>
            {loading ? <><span className="spinner" /> Scanning...</> : "Scan Now"}
          </button>
        </form>
        <div style={{marginTop:16,padding:"10px 14px",background:"rgba(255,165,2,0.08)",border:"1px solid rgba(255,165,2,0.2)",borderRadius:8,fontSize:12,color:"var(--yellow)"}}>
          Only scan devices you own or have permission to scan.
        </div>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Results</span></div>
        {error && <div style={{background:"rgba(255,71,87,0.1)",border:"1px solid rgba(255,71,87,0.3)",color:"var(--red)",padding:"12px 16px",borderRadius:8,fontSize:13}}>{error}</div>}
        {loading && <div className="loading" style={{flexDirection:"column",gap:16}}><span className="spinner" style={{width:28,height:28}} /><div style={{textAlign:"center"}}>Scanning {form.target_ip}...</div></div>}
        {!loading && !result && !error && <div className="empty-state"><p>Enter a target IP and click Scan Now.</p></div>}
        {result && (
          <div>
            <div style={{display:"flex",gap:16,marginBottom:20}}>
              <div style={{flex:1,background:"var(--bg-700)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 16px"}}><div className="text-muted" style={{fontSize:11,marginBottom:4}}>TARGET</div><div className="mono text-teal" style={{fontSize:16,fontWeight:700}}>{result.target_ip}</div></div>
              <div style={{flex:1,background:"var(--bg-700)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 16px"}}><div className="text-muted" style={{fontSize:11,marginBottom:4}}>OPEN PORTS</div><div className="mono" style={{fontSize:24,fontWeight:700}}>{result.total_open}</div></div>
            </div>
            {result.open_ports.length===0 ? <div className="empty-state"><p>No open ports found.</p></div> : (
              <div className="table-wrap"><table>
                <thead><tr><th>Port</th><th>Service</th><th>Protocol</th></tr></thead>
                <tbody>{result.open_ports.map(p => (<tr key={p.port}><td><span className="mono text-teal" style={{fontWeight:700}}>{p.port}</span></td><td style={{textTransform:"uppercase",fontSize:12}}>{p.service}</td><td><span className="badge-status badge-info">TCP</span></td></tr>))}</tbody>
              </table></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}