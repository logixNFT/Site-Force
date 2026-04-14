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

function getFocusPriority(bid) {
  const d = daysUntil(bid.due);
  if (bid.status === "bidding") return { tier: 1, label: "ACTIVELY BIDDING", color: "#2563EB", bg: "#1E3A8A" };
  if (d !== null && d <= 0) return { tier: 1, label: "PAST DUE — VERIFY", color: "#DC2626", bg: "#450A0A" };
  if (d !== null && d <= 3) return { tier: 1, label: "DUE IN \u22643 DAYS", color: "#DC2626", bg: "#450A0A" };
  if (d !== null && d <= 7) return { tier: 2, label: "DUE THIS WEEK", color: "#EA580C", bg: "#431407" };
  if (bid.status === "review") return { tier: 2, label: "REVIEW IN PROGRESS", color: "#D97706", bg: "#451A03" };
  if (bid.status === "tracking" && d !== null && d <= 14) return { tier: 3, label: "GO / NO-GO DECISION", color: "#A855F7", bg: "#2E1065" };
  return { tier: 3, label: "ACTION REQUIRED", color: "#64748B", bg: "#1E293B" };
}

function isFocusBid(bid) {
  if (["expired", "won", "lost", "nogo"].includes(bid.status)) return false;
  const d = daysUntil(bid.due);
  if (bid.status === "bidding") return true;
  if (bid.status === "review") return true;
  if (bid.status === "tracking" && d !== null && d <= 14) return true;
  return false;
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
  const [showFocus, setShowFocus] = useState(false);
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

  const todayBids = bids
    .filter(isFocusBid)
    .sort((a, b) => {
      const pa = getFocusPriority(a).tier;
      const pb = getFocusPriority(b).tier;
      if (pa !== pb) return pa - pb;
      const da = daysUntil(a.due);
      const db = daysUntil(b.due);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
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

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#0A0E17", color: "#E2E8F0", minHeight: "100vh", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1A1F2E; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        input, select { font-family: inherit; }

        .sf-header { padding: 20px 28px; }
        .sf-stats { display: flex; gap: 16px; margin-top: 20px; flex-wrap: wrap; }
        .sf-stat-card { flex: 1 1 120px; }
        .sf-pipeline { padding: 20px 28px; }
        .sf-sources-wrap { padding: 20px 28px; }

        .sf-filters {
          display: flex; gap: 10px; margin-bottom: 20px;
          flex-wrap: wrap; align-items: center;
        }
        .sf-search { flex: 1 1 200px; }
        .sf-filter-select { flex: 1 1 140px; }
        .sf-addbtn { flex-shrink: 0; }

        .sf-card { display: flex; align-items: flex-start; gap: 16px; }
        .sf-urgency { min-width: 56px; text-align: center; padding-top: 2px; flex-shrink: 0; }
        .sf-urgency-num { font-size: 22px; }
        .sf-urgency-label { font-size: 10px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
        .sf-status-col { min-width: 120px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

        /* Today's Focus FAB */
        .sf-fab {
          position: fixed; bottom: 24px; right: 20px; z-index: 50;
          background: linear-gradient(135deg, #F59E0B, #EF4444);
          color: #fff; border: none; border-radius: 28px;
          padding: 14px 20px; font-weight: 700; font-size: 14px;
          cursor: pointer; box-shadow: 0 4px 24px rgba(239,68,68,0.45);
          display: flex; align-items: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .sf-fab:active { transform: scale(0.96); }
        .sf-fab-badge {
          background: #fff; color: #DC2626; border-radius: 50%;
          width: 22px; height: 22px; display: flex; align-items: center;
          justify-content: center; font-size: 12px; font-weight: 800;
          flex-shrink: 0;
        }

        /* Modal overlay */
        .sf-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.65);
          z-index: 98; backdrop-filter: blur(3px);
          animation: sfFadeIn 0.2s ease;
        }
        @keyframes sfFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Bottom sheet (shared) */
        .sf-sheet {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 99;
          background: #0F172A; border-top: 1px solid #1E293B;
          border-radius: 20px 20px 0 0;
          max-height: 82vh; overflow-y: auto;
          padding-bottom: env(safe-area-inset-bottom, 16px);
          animation: sfSlideUp 0.28s cubic-bezier(0.32,0.72,0,1);
        }
        @keyframes sfSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .sf-sheet-handle {
          width: 40px; height: 4px; background: #334155; border-radius: 2px;
          margin: 12px auto 0;
        }
        .sf-sheet-inner { padding: 16px 20px 24px; }

        /* Desktop: centered modal */
        @media (min-width: 641px) {
          .sf-sheet {
            top: 50%; left: 50%; right: auto; bottom: auto;
            transform: translate(-50%, -50%);
            width: min(600px, 92vw); max-height: 80vh;
            border-radius: 16px; border: 1px solid #1E293B;
            animation: sfScaleIn 0.2s cubic-bezier(0.32,0.72,0,1);
          }
          @keyframes sfScaleIn {
            from { transform: translate(-50%, -48%) scale(0.96); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
          .sf-sheet-handle { display: none; }
          .sf-sheet-inner { padding: 24px 28px 28px; }
        }

        /* Focus bid card */
        .sf-focus-card {
          background: #131825; border-radius: 12px; padding: 16px;
          border: 1px solid #1E293B; margin-bottom: 10px;
        }
        .sf-focus-card:last-child { margin-bottom: 0; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .sf-header { padding: 14px 16px !important; }
          .sf-stats { gap: 10px !important; margin-top: 14px !important; }
          .sf-stat-card { flex: 1 1 calc(50% - 5px) !important; min-width: 0 !important; padding: 12px 14px !important; }
          .sf-pipeline { padding: 12px 16px 80px !important; }
          .sf-sources-wrap { padding: 12px 16px 80px !important; }

          .sf-filters { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .sf-search { grid-column: 1 / -1 !important; }
          .sf-addbtn { grid-column: 1 / -1 !important; width: 100% !important; }
          .sf-filter-select { flex: unset !important; width: 100% !important; }

          .sf-card { flex-direction: column !important; gap: 10px !important; }
          .sf-urgency { min-width: unset !important; text-align: left !important; padding-top: 0 !important; display: flex !important; flex-direction: row !important; align-items: center !important; gap: 6px !important; }
          .sf-urgency-num { font-size: 18px !important; }
          .sf-status-col { min-width: unset !important; width: 100% !important; flex-direction: row !important; align-items: center !important; }
          .sf-status-col select { width: 100% !important; padding: 10px 12px !important; font-size: 13px !important; }

          .sf-source-grid { grid-template-columns: 1fr !important; }
          .sf-agg-grid { grid-template-columns: 1fr !important; }

          .sf-focus-card { padding: 14px; }
        }
      `}</style>

      {/* Header */}
      <div className="sf-header" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>SF</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" }}>SiteForce</h1>
              <p style={{ fontSize: 12, color: "#64748B", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Public Bid Pipeline — South Florida Civil</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["pipeline", "sources"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                background: view === v ? "#F59E0B" : "#1E293B", color: view === v ? "#0F172A" : "#94A3B8",
                fontWeight: 600, fontSize: 13, transition: "all 0.2s"
              }}>{v === "pipeline" ? "Pipeline" : "Sources"}</button>
            ))}
            {/* Desktop focus button */}
            <button onClick={() => setShowFocus(true)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: todayBids.length > 0 ? "linear-gradient(135deg, #F59E0B, #EF4444)" : "#1E293B",
              color: todayBids.length > 0 ? "#fff" : "#94A3B8",
              fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8
            }}>
              Today's Focus
              {todayBids.length > 0 && (
                <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "1px 7px", fontSize: 12 }}>{todayBids.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="sf-stats">
          {[
            { label: "Total Tracked", value: stats.total, accent: "#64748B" },
            { label: "Active", value: stats.active, accent: "#3B82F6" },
            { label: "Due \u226414 Days", value: stats.dueSoon, accent: "#F59E0B" },
            { label: "Bidding", value: stats.bidding, accent: "#10B981" },
          ].map((s, i) => (
            <div key={i} className="sf-stat-card" style={{ background: "#131825", borderRadius: 10, padding: "14px 18px", borderLeft: `3px solid ${s.accent}` }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#F8FAFC", fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {view === "pipeline" ? (
        <div className="sf-pipeline">
          {/* Filters */}
          <div className="sf-filters">
            <input className="sf-search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search bids..."
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13, outline: "none" }} />
            <select className="sf-filter-select" value={filterSource} onChange={e => setFilterSource(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Sources</option>
              {PORTAL_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select className="sf-filter-select" value={filterScope} onChange={e => setFilterScope(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Scopes</option>
              {SCOPE_TAGS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="sf-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className="sf-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #1E293B", background: "#131825", color: "#E2E8F0", fontSize: 13 }}>
              <option value="due">Sort: Due Date</option>
              <option value="source">Sort: Source</option>
              <option value="status">Sort: Status</option>
            </select>
            <button className="sf-addbtn" onClick={() => setShowAddForm(!showAddForm)} style={{
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
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#0A0E17", color: "#E2E8F0", fontSize: 13 }} />
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
                <div key={bid.id} className="sf-card" style={{
                  background: "#131825", borderRadius: 10, padding: "16px 20px",
                  border: "1px solid #1E293B",
                  transition: "border-color 0.2s", borderLeftWidth: 3, borderLeftColor: src?.color || "#334155"
                }}>
                  <div className="sf-urgency">
                    {days !== null ? (
                      <>
                        <div className="sf-urgency-num" style={{ fontWeight: 700, color: urgencyColor(days), fontFamily: "'JetBrains Mono', monospace" }}>
                          {days < 0 ? "\u2014" : days}
                        </div>
                        <div className="sf-urgency-label">
                          {days < 0 ? "Past" : days === 0 ? "Today" : days === 1 ? "Day" : "Days"}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}>TBD</div>
                    )}
                  </div>

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

                  <div className="sf-status-col">
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
        <div className="sf-sources-wrap">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#94A3B8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Registered Portal Sources</h2>
          <div className="sf-source-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
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
            <div className="sf-agg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
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

      {/* Mobile FAB */}
      <button className="sf-fab" onClick={() => setShowFocus(true)}>
        <span>Today's Focus</span>
        {todayBids.length > 0 && <span className="sf-fab-badge">{todayBids.length}</span>}
      </button>

      {/* Today's Focus Modal */}
      {showFocus && (
        <>
          <div className="sf-overlay" onClick={() => setShowFocus(false)} />
          <div className="sf-sheet">
            <div className="sf-sheet-handle" />
            <div className="sf-sheet-inner">
              {/* Modal Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" }}>Today's Focus</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{today}</div>
                  {todayBids.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#10B981", marginTop: 6, fontWeight: 500 }}>All clear — no urgent bids right now.</div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>
                      <span style={{ color: "#F59E0B", fontWeight: 600 }}>{todayBids.length} bid{todayBids.length !== 1 ? "s" : ""}</span> need your attention
                    </div>
                  )}
                </div>
                <button onClick={() => setShowFocus(false)} style={{
                  background: "#1E293B", border: "none", color: "#94A3B8", borderRadius: 8,
                  width: 32, height: 32, fontSize: 18, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>×</button>
              </div>

              {/* Priority Tiers */}
              {[1, 2, 3].map(tier => {
                const tierBids = todayBids.filter(b => getFocusPriority(b).tier === tier);
                if (tierBids.length === 0) return null;
                const tierLabels = { 1: "Urgent", 2: "High Priority", 3: "Action Needed" };
                const tierColors = { 1: "#DC2626", 2: "#EA580C", 3: "#A855F7" };
                return (
                  <div key={tier} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: tierColors[tier], textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: tierColors[tier], display: "inline-block" }} />
                      {tierLabels[tier]}
                    </div>
                    {tierBids.map(bid => {
                      const days = daysUntil(bid.due);
                      const src = PORTAL_SOURCES.find(s => s.id === bid.source);
                      const stCfg = STATUS_CONFIG[bid.status];
                      const priority = getFocusPriority(bid);
                      return (
                        <div key={bid.id} className="sf-focus-card" style={{ borderLeft: `3px solid ${src?.color || "#334155"}` }}>
                          {/* Priority badge + countdown */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                              color: priority.color, background: priority.bg,
                              padding: "3px 8px", borderRadius: 4
                            }}>{priority.label}</span>
                            {days !== null && (
                              <span style={{
                                fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                                color: urgencyColor(days)
                              }}>
                                {days < 0 ? "OVERDUE" : days === 0 ? "DUE TODAY" : `${days}d left`}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9", lineHeight: 1.3, marginBottom: 6 }}>{bid.title}</div>

                          {/* Meta row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#64748B", background: "#0A0E17", padding: "2px 7px", borderRadius: 4 }}>
                              {bid.solicitation}
                            </span>
                            <span style={{ fontSize: 11, color: src?.color, fontWeight: 600 }}>{src?.name}</span>
                            <span style={{ fontSize: 10, color: "#64748B", background: "#1E293B", padding: "2px 6px", borderRadius: 4 }}>{bid.type}</span>
                          </div>

                          {/* Scope tags */}
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                            {bid.scope.map(s => (
                              <span key={s} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "#1E293B", color: "#94A3B8", fontWeight: 500 }}>{s}</span>
                            ))}
                          </div>

                          {bid.notes && (
                            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8, lineHeight: 1.4 }}>{bid.notes}</div>
                          )}

                          {/* Due date + status update */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                            {bid.due && (
                              <div style={{ fontSize: 12, color: "#475569" }}>
                                Due: <strong style={{ color: urgencyColor(days) }}>{new Date(bid.due + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong>
                              </div>
                            )}
                            <select value={bid.status} onChange={e => updateStatus(bid.id, e.target.value)} style={{
                              padding: "7px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600,
                              background: stCfg.bg, color: stCfg.color, cursor: "pointer", marginLeft: "auto"
                            }}>
                              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {todayBids.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#64748B" }}>Nothing urgent today</div>
                  <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Keep tracking and check back tomorrow.</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
