import { useState } from "react";

const PORTAL_SOURCES = [
  { id: "broward", name: "Broward County", color: "#1F4E79", url: "https://broward.bonfirehub.com" },
  { id: "mdc", name: "Miami-Dade County", color: "#C0392B", url: "https://www.miamidade.gov/apps/ISD/stratproc" },
  { id: "pbc", name: "Palm Beach County", color: "#27AE60", url: "https://pbcvssp.pbc.gov" },
  { id: "fdot", name: "FDOT District 4", color: "#F39C12", url: "https://www.fdot.gov/contracts/district-offices/d4" },
  { id: "ftl", name: "Fort Lauderdale", color: "#8E44AD", url: "https://www.fortlauderdale.gov" },
  { id: "sfwmd", name: "SFWMD", color: "#2980B9", url: "https://procurementcalendar.sfwmd.gov" },
  { id: "wpb", name: "West Palm Beach", color: "#16A085", url: "https://network.demandstar.com" },
  { id: "hollywood", name: "Hollywood", color: "#D35400", url: "https://www.hollywoodfl.org/bids" },
];

const SCOPE_TAGS = [
  "Roadway", "Drainage", "Stormwater", "Utility", "Site Prep", "Bridge",
  "Traffic", "Demo", "Environmental", "CEI", "CM-at-Risk", "General Civil"
];

const INITIAL_BIDS = [
  { id: 1, solicitation: "PNC2131527C2", title: "Canal Pump Station (S-45) Improvements", source: "broward", type: "ITB", scope: ["Drainage", "Stormwater"], estValue: null, posted: "2026-04-02", due: "2026-04-10", status: "review", notes: "Capital project — check BPRO" },
  { id: 2, solicitation: "PNC2130221C1", title: "Broadview Park Drainage Green Infrastructure", source: "broward", type: "ITB", scope: ["Drainage", "Roadway", "Stormwater"], estValue: null, posted: null, due: null, status: "tracking", notes: "Pervious pavement, pump station, barrier wall" },
  { id: 3, solicitation: "TRN2131796B1", title: "Misc Traffic and Roadway Construction", source: "broward", type: "ITB", scope: ["Roadway", "Traffic"], estValue: null, posted: null, due: "2026-04-09", status: "review", notes: "Annual contract — multiple task orders" },
  { id: 4, solicitation: "PNC2130540C1", title: "Canal Structure S-27 Improvements", source: "broward", type: "ITB", scope: ["Drainage"], estValue: null, posted: null, due: null, status: "tracking", notes: "" },
  { id: 5, solicitation: "PNC2131658C1", title: "BSO Stockade Membrane Structures Demolition", source: "broward", type: "ITB", scope: ["Demo"], estValue: null, posted: "2026-04-09", due: "2026-04-30", status: "tracking", notes: "" },
  { id: 6, solicitation: "OPN2131278B1", title: "Guardrail, Fence & Accessories F&I", source: "broward", type: "ITB", scope: ["Traffic"], estValue: null, posted: "2026-04-09", due: "2026-04-17", status: "tracking", notes: "" },
  { id: 7, solicitation: "RPQ-FS18", title: "Fire Rescue Station #18 Phase I — Site Prep", source: "mdc", type: "RPQ", scope: ["Site Prep", "Environmental"], estValue: null, posted: null, due: "2026-03-26", status: "expired", notes: "Excavation, contaminated soil disposal" },
  { id: 8, solicitation: "MCC-7040", title: "Misc Construction Contracts (Ongoing Registration)", source: "mdc", type: "MCC", scope: ["General Civil"], estValue: null, posted: null, due: null, status: "tracking", notes: "Register for work order eligibility" },
  { id: 9, solicitation: "FDOT-SR25", title: "SR 25/US-27 Resurfacing & Intersection Improvements", source: "fdot", type: "ITB", scope: ["Roadway", "Drainage"], estValue: null, posted: null, due: null, status: "tracking", notes: "Stormwater drainage + paving" },
  { id: 10, solicitation: "WPB-HOWARD", title: "Howard Park Community Center Demo + Construction", source: "wpb", type: "ITB", scope: ["Demo", "Site Prep"], estValue: null, posted: "2026-02-13", due: "2026-04-09", status: "review", notes: "Full site demo + new construction" },
  { id: 11, solicitation: "PBC-WTP2", title: "Water Treatment Plant No. 2 Expansion (CM)", source: "pbc", type: "RFP", scope: ["Utility", "CM-at-Risk"], estValue: null, posted: null, due: null, status: "tracking", notes: "CM-at-Risk via Water Utilities" },
  { id: 12, solicitation: "PBC-TORRY", title: "Torry Island Swing Bridge Repairs", source: "pbc", type: "ITB", scope: ["Bridge"], estValue: null, posted: null, due: null, status: "tracking", notes: "Engineering & Public Works" },
  { id: 13, solicitation: "WPARK-CNTYLN", title: "County Line Rd (NE 215th St) Roadway Improvements", source: "broward", type: "RFQ", scope: ["Roadway", "Drainage"], estValue: null, posted: null, due: null, status: "tracking", notes: "Widening, resurfacing, drainage, ADA" },
  { id: 14, solicitation: "PNC2130260P1", title: "Professional Civil Engineering — Parks & Rec", source: "broward", type: "RFP", scope: ["CEI", "General Civil"], estValue: null, posted: null, due: null, status: "tracking", notes: "" },
  { id: 15, solicitation: "PBC-SEWER10", title: "Sewer Collection System Connection (10 Homes)", source: "pbc", type: "ITB", scope: ["Utility"], estValue: null, posted: "2026-03-01", due: "2026-04-09", status: "review", notes: "Earthwork + paving" },
];

const STATUS_CONFIG = {
  tracking: { label: "Tracking", color: "#6B7280", bg: "#F3F4F6" },
  review: { label: "Under Review", color: "#D97706", bg: "#FEF3C7" },
  bidding: { label: "Bidding", color: "#2563EB", bg: "#DBEAFE" },
  submitted: { label: "Submitted", color: "#059669", bg: "#D1FAE5" },
  won: { label: "Won", color: "#10B981", bg: "#A7F3D0" },
  lost: { label: "Lost", color: "#EF4444", bg: "#FEE2E2" },
  expired: { label: "Expired", color: "#9CA3AF", bg: "#E5E7EB" },
  nogo: { label: "No-Go", color: "#6B7280", bg: "#E5E7EB" },
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d - now) / 86400000);
}

function urgencyColor(days) {
  if (days === null) return "#6B7280";
  if (days < 0) return "#9CA3AF";
  if (days <= 3) return "#DC2626";
  if (days <= 7) return "#EA580C";
  if (days <= 14) return "#D97706";
  if (days <= 30) return "#2563EB";
  return "#059669";
}

export default function SiteForceBidPipeline() {
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [filterSource, setFilterSource] = useState("all");
  const [filterScope, setFilterScope] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("due");
  const [view, setView] = useState("pipeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBid, setNewBid] = useState({ solicitation: "", title: "", source: "broward", type: "ITB", scope: [], due: "", notes: "", status: "tracking" });

  const filtered = bids.filter(b => {
    if (filterSource !== "all" && b.source !== filterSource) return false;
    if (filterScope !== "all" && !b.scope.includes(filterScope)) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (searchTerm && !b.title.toLowerCase().includes(searchTerm.toLowerCase()) && !b.solicitation.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "due") {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    }
    if (sortBy === "source") return a.source.localeCompare(b.source);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  const stats = {
    total: bids.length,
    active: bids.filter(b => !["expired", "nogo", "lost", "won"].includes(b.status)).length,
    dueSoon: bids.filter(b => { const d = daysUntil(b.due); return d !== null && d >= 0 && d <= 14; }).length,
    bidding: bids.filter(b => b.status === "bidding").length,
  };

  const sourceStats = PORTAL_SOURCES.map(s => ({
    ...s,
    count: bids.filter(b => b.source === s.id).length,
    active: bids.filter(b => b.source === s.id && !["expired", "nogo", "lost"].includes(b.status)).length,
  }));

  const updateStatus = (id, newStatus) => {
    setBids(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const addBid = () => {
    if (!newBid.title) return;
    setBids(prev => [...prev, { ...newBid, id: Math.max(...prev.map(b => b.id)) + 1, estValue: null, posted: null }]);
    setNewBid({ solicitation: "", title: "", source: "broward", type: "ITB", scope: [], due: "", notes: "", status: "tracking" });
    setShowAddForm(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#0A0E17", color: "#E2E8F0", minHeight: "100vh", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1A1F2E; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        input, select { font-family: inherit; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderBottom: "1px solid #1E293B", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>SF</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" }}>SiteForce</h1>
              <p style={{ fontSize: 12, color: "#64748B", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Public Bid Pipeline — South Florida Civil</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["pipeline", "sources"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                background: view === v ? "#F59E0B" : "#1E293B", color: view === v ? "#0F172A" : "#94A3B8",
                fontWeight: 600, fontSize: 13, transition: "all 0.2s"
              }}>{v === "pipeline" ? "Pipeline" : "Sources"}</button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total Tracked", value: stats.total, accent: "#64748B" },
            { label: "Active", value: stats.active, accent: "#3B82F6" },
            { label: "Due \u226414 Days", value: stats.dueSoon, accent: "#F59E0B" },
            { label: "Bidding", value: stats.bidding, accent: "#10B981" },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 120px", background: "#131825", borderRadius: 10, padding: "14px 18px", borderLeft: `3px solid ${s.accent}` }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {view === "pipeline" ? (
        <div style={{ padding: "20px 28px" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search bids..."
              style={{ flex: "1 1 200px", padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13, outline: "none" }} />
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Sources</option>
              {PORTAL_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filterScope} onChange={e => setFilterScope(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Scopes</option>
              {SCOPE_TAGS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="due">Sort: Due Date</option>
              <option value="source">Sort: Source</option>
              <option value="status">Sort: Status</option>
            </select>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{
              padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "#F59E0B", color: "#0F172A", fontWeight: 600, fontSize: 13
            }}>+ Add Bid</button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div style={{ background: "#131825", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #1E293B" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                <input placeholder="Solicitation #" value={newBid.solicitation} onChange={e => setNewBid(p => ({ ...p, solicitation: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13 }} />
                <input placeholder="Project Title" value={newBid.title} onChange={e => setNewBid(p => ({ ...p, title: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13, gridColumn: "span 2" }} />
                <select value={newBid.source} onChange={e => setNewBid(p => ({ ...p, source: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13 }}>
                  {PORTAL_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="date" value={newBid.due} onChange={e => setNewBid(p => ({ ...p, due: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13 }} />
                <input placeholder="Notes" value={newBid.notes} onChange={e => setNewBid(p => ({ ...p, notes: e.target.value }))}
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13 }} />
                <button onClick={addBid} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: "#10B981", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
              </div>
            </div>
          )}

          {/* Bid Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(bid => {
              const days = daysUntil(bid.due);
              const src = PORTAL_SOURCES.find(s => s.id === bid.source);
              const stCfg = STATUS_CONFIG[bid.status];
              return (
                <div key={bid.id} style={{
                  background: "#131825", borderRadius: 10, padding: "16px 20px",
                  border: "1px solid #1E293B", display: "flex", alignItems: "flex-start", gap: 16,
                  transition: "border-color 0.2s", borderLeftWidth: 3, borderLeftColor: src?.color || "#334155"
                }}>
                  {/* Urgency */}
                  <div style={{ minWidth: 56, textAlign: "center", paddingTop: 2 }}>
                    {days !== null ? (
                      <>
                        <div style={{ fontSize: 22, fontWeight: 700, color: urgencyColor(days), fontFamily: "'JetBrains Mono', monospace" }}>
                          {days < 0 ? "\u2014" : days}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {days < 0 ? "Past" : days === 0 ? "Today" : days === 1 ? "Day" : "Days"}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}>TBD</div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#64748B", background: "#0A0E17", padding: "2px 8px", borderRadius: 4 }}>
                        {bid.solicitation}
                      </span>
                      <span style={{ fontSize: 11, color: src?.color, fontWeight: 600 }}>{src?.name}</span>
                      <span style={{ fontSize: 10, color: "#64748B", background: "#1E293B", padding: "2px 6px", borderRadius: 4 }}>{bid.type}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9", marginTop: 4, lineHeight: 1.3 }}>{bid.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {bid.scope.map(s => (
                        <span key={s} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "#1E293B", color: "#94A3B8", fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                    {bid.notes && <div style={{ fontSize: 12, color: "#64748B", marginTop: 6, lineHeight: 1.4 }}>{bid.notes}</div>}
                    {bid.due && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Due: {new Date(bid.due + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>}
                  </div>

                  {/* Status */}
                  <div style={{ minWidth: 120, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <select value={bid.status} onChange={e => updateStatus(bid.id, e.target.value)} style={{
                      padding: "6px 10px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600,
                      background: stCfg.bg, color: stCfg.color, cursor: "pointer", textAlign: "center"
                    }}>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>No bids match your filters.</div>
          )}
        </div>
      ) : (
        /* Sources View */
        <div style={{ padding: "20px 28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#94A3B8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Registered Portal Sources</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {sourceStats.map(s => (
              <div key={s.id} style={{ background: "#131825", borderRadius: 10, padding: 20, border: "1px solid #1E293B", borderLeftWidth: 4, borderLeftColor: s.color }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#F1F5F9" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{s.count} tracked / {s.active} active</div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: s.color, marginTop: 8, display: "inline-block", textDecoration: "none" }}>
                  Open Portal →
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, background: "#131825", borderRadius: 10, padding: 20, border: "1px solid #1E293B" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B", marginBottom: 12 }}>Aggregator Services</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {[
                { name: "DemandStar", url: "https://network.demandstar.com", note: "Broward, WPB, Hollywood, SFWMD" },
                { name: "BidNet Direct", url: "https://www.bidnetdirect.com", note: "City of Miami + others" },
                { name: "ConstructionBidSource", url: "https://www.constructionbidsource.com", note: "Filter by county + GEC trade" },
                { name: "GovWin IQ", url: "https://iq.govwin.com", note: "Pre-RFP intelligence (paid)" },
                { name: "GovCB.com", url: "https://www.govcb.com", note: "Free browsing, email alerts" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#0A0E17", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{a.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
