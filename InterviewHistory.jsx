import { getHistory, deleteInterview, deleteAllHistory } from "../api/api";
import { useEffect, useState } from "react";
import { BarChart3, ChevronDown, ChevronUp, PlayCircle, Clock, Briefcase, Trophy, Trash2 } from "lucide-react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const HISTORY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ih-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    padding: 36px 48px 60px;
  }

  .ih-card {
    background: #fff;
    border: 1px solid #e2f0eb;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(16,185,129,0.05);
    overflow: hidden;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .ih-card:hover {
    box-shadow: 0 6px 24px rgba(16,185,129,0.1);
    border-color: #a7f3d0;
  }

  .ih-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    cursor: pointer;
    user-select: none;
  }

  .ih-expand-body {
    border-top: 1px solid #f0fdf4;
    padding: 28px 24px;
    background: #fafffe;
  }

  .ih-score-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 4px 14px;
    font-weight: 700;
    font-size: 0.85rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ih-metric-card {
    background: #f9fafb;
    border: 1px solid #f0fdf4;
    border-radius: 12px;
    padding: 14px 16px;
    text-align: center;
  }

  .ih-q-card {
    background: #f9fafb;
    border: 1px solid #f0fdf4;
    border-radius: 12px;
    padding: 16px 18px;
  }

  .ih-stat-chip {
    border-radius: 8px;
    padding: 6px 12px;
    text-align: center;
    min-width: 80px;
  }

  .ih-empty {
    text-align: center;
    padding: 80px 24px;
  }

  .ih-delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    color: #d1d5db;
    transition: all 0.18s;
    display: flex; align-items: center; justify-content: center;
  }
  .ih-delete-btn:hover {
    background: #fef2f2;
    color: #ef4444;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("ih-styles")) {
  const s = document.createElement("style");
  s.id = "ih-styles";
  s.textContent = HISTORY_CSS;
  document.head.appendChild(s);
}

const scoreColor  = (s) => s >= 7 ? "#059669" : s >= 4 ? "#d97706" : "#dc2626";
const scoreBg     = (s) => s >= 7 ? "#ecfdf5" : s >= 4 ? "#fffbeb" : "#fef2f2";
const scoreBorder = (s) => s >= 7 ? "#6ee7b7" : s >= 4 ? "#fcd34d" : "#fca5a5";

const ExpandedReport = ({ item }) => {
  if (!item.feedback) {
    return (
      <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
        Full report not available for this session. Future sessions will include complete reports.
      </p>
    );
  }

  const f = item.feedback;

  const radarData = {
    labels: ["Technical", "Communication", "Confidence", "Cognitive Depth"],
    datasets: [{
      label: "Performance",
      data: [f.conceptCoverage / 10, f.communication, f.confidence, f.cognitiveDepth],
      backgroundColor: "rgba(16,185,129,0.1)",
      borderColor: "#10b981",
      borderWidth: 2,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#fff",
      pointRadius: 4,
    }]
  };

  const metrics = [
    { label: "Concept Coverage", value: `${f.conceptCoverage}%`,  raw: f.conceptCoverage / 10 },
    { label: "Communication",    value: `${f.communication}/10`,  raw: f.communication },
    { label: "Confidence",       value: `${f.confidence}/10`,     raw: f.confidence },
    { label: "Cognitive Depth",  value: `${f.cognitiveDepth}/10`, raw: f.cognitiveDepth },
  ];

  return (
    <div className="ih-expand-body">

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} className="ih-metric-card">
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: "1.4rem",
              color: "#059669", marginBottom: 4, letterSpacing: "-0.03em",
            }}>{m.value}</p>
            <div style={{ height: 3, background: "#f0fdf4", borderRadius: 99, marginBottom: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${(m.raw / 10) * 100}%`,
                background: "linear-gradient(90deg, #34d399, #059669)",
              }} />
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Radar + Strengths/Improvements */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Radar */}
        <div style={{ background: "#fff", border: "1px solid #e2f0eb", borderRadius: 16, padding: "20px" }}>
          <p style={{ color: "#10b981", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Performance</p>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#0f2118", marginBottom: 16 }}>Radar Overview</h3>
          <Radar data={radarData} options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              r: {
                min: 0, max: 10,
                ticks: { stepSize: 2, color: "#9ca3af", backdropColor: "transparent", font: { size: 9 } },
                grid: { color: "rgba(16,185,129,0.08)" },
                angleLines: { color: "rgba(16,185,129,0.1)" },
                pointLabels: { font: { size: 11, weight: "600" }, color: "#374151" }
              }
            }
          }} />
        </div>

        {/* Strengths + Improvements */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #e2f0eb", borderRadius: 16, padding: "20px", flex: 1 }}>
            <p style={{ color: "#10b981", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>What went well</p>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#0f2118", marginBottom: 12 }}>Strengths</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {f.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: "#ecfdf5", border: "1px solid #a7f3d0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.55rem", color: "#059669", fontWeight: 700, marginTop: 1,
                  }}>✓</div>
                  <span style={{ color: "#374151", fontSize: "0.8rem", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {f.areasForImprovement?.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #e2f0eb", borderRadius: 16, padding: "20px", flex: 1 }}>
              <p style={{ color: "#d97706", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Room to grow</p>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#0f2118", marginBottom: 12 }}>Improvements</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {f.areasForImprovement.map((area, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #fcd34d", paddingLeft: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#111827" }}>{area.area}</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#d97706", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 999, padding: "1px 7px" }}>{area.score}/10</span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "0.74rem", lineHeight: 1.5 }}>{area.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Analysis */}
      {f.questionAnalysis?.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #e2f0eb", borderRadius: 16, padding: "20px" }}>
          <p style={{ color: "#10b981", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>Breakdown</p>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#0f2118", marginBottom: 16 }}>Question-by-Question</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {f.questionAnalysis.map((q, i) => (
              <div key={i} className="ih-q-card">
                <p style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0f2118", marginBottom: 10, lineHeight: 1.4 }}>
                  <span style={{ color: "#10b981", marginRight: 6 }}>Q{i + 1}</span>{q.question}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "Rule",    value: `${q.ruleScore}/10`,   hl: false },
                    { label: "ML",      value: `${q.mlScore}/10`,     hl: false },
                    { label: "Hybrid",  value: `${q.hybridScore}/10`, hl: true  },
                    { label: "Concepts",value: `${q.conceptMatch}%`,  hl: false },
                  ].map((stat, j) => (
                    <div key={j} className="ih-stat-chip" style={{
                      background: stat.hl ? "#ecfdf5" : "#fff",
                      border: `1px solid ${stat.hl ? "#a7f3d0" : "#e5e7eb"}`,
                    }}>
                      <p style={{ fontWeight: 800, fontSize: "0.9rem", color: stat.hl ? "#059669" : "#111827", letterSpacing: "-0.02em", marginBottom: 1 }}>{stat.value}</p>
                      <p style={{ color: "#9ca3af", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const InterviewHistory = () => {
  const [history, setHistory]       = useState([]);
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setHistory([]);
    }
  };
  fetchHistory();
}, []);

const deleteEntry = async (id) => {
  try {
    await deleteInterview(id);
    setHistory(prev => prev.filter(item => item._id !== id));
    setExpandedIdx(null);
  } catch (err) {
    console.error("Failed to delete:", err);
  }
};

const clearAll = async () => {
  try {
    await deleteAllHistory();
    setHistory([]);
    setExpandedIdx(null);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
};

  return (
    <div className="ih-root">

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          fontSize: "0.68rem", fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#10b981", marginBottom: 8,
        }}>Your sessions</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: "2rem",
            color: "#0f2118", letterSpacing: "-0.04em",
          }}>Interview History</h1>

          {history.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "transparent", border: "1px solid #fca5a5",
                borderRadius: 10, padding: "7px 14px",
                color: "#ef4444", fontSize: "0.78rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {/* Stats row */}
        {history.length > 0 && (
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            {[
              { label: "Total Sessions", value: history.length },
              { label: "Best Score",     value: `${Math.max(...history.map(h => h.score))}/10` },
              { label: "Avg Score",      value: `${(history.reduce((a, h) => a + h.score, 0) / history.length).toFixed(1)}/10` },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e2f0eb",
                borderRadius: 14, padding: "14px 20px",
                boxShadow: "0 2px 8px rgba(16,185,129,0.05)",
              }}>
                <p style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: "1.4rem",
                  color: "#059669", letterSpacing: "-0.03em",
                }}>{stat.value}</p>
                <p style={{ color: "#9ca3af", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── EMPTY STATE ── */}
      {history.length === 0 ? (
        <div className="ih-empty">
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "#ecfdf5", border: "1px solid #a7f3d0",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <BarChart3 style={{ width: 28, height: 28, color: "#10b981" }} />
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: "1.3rem",
            color: "#0f2118", marginBottom: 8,
          }}>No interviews yet</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
            Complete your first interview session to see your history here.
          </p>
        </div>
      ) : (

        /* ── HISTORY LIST ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {history.map((item, idx) => {
            const isOpen = expandedIdx === idx;
            const sc = item.score;

            return (
              <div key={idx} className="ih-card">

                {/* Card header — always visible */}
                <div
                  className="ih-card-header"
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                >
                  {/* Left */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Score circle */}
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                      background: scoreBg(sc), border: `2px solid ${scoreBorder(sc)}`,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 12px ${scoreBorder(sc)}66`,
                    }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: scoreColor(sc), lineHeight: 1 }}>{sc}</span>
                      <span style={{ color: "#9ca3af", fontSize: "0.55rem" }}>/10</span>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 700, fontSize: "0.95rem", color: "#0f2118",
                        }}>{item.role}</span>
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 600,
                          color: "#059669", background: "#ecfdf5",
                          border: "1px solid #a7f3d0", borderRadius: 999,
                          padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>{item.interviewType}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontSize: "0.75rem" }}>
                          <Clock size={11} /> {item.date}
                        </span>
                        {item.feedback && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981", fontSize: "0.72rem", fontWeight: 600 }}>
                            <BarChart3 size={11} /> Full report available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      className="ih-delete-btn"
                      onClick={e => { e.stopPropagation(); deleteEntry(item._id); }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "#f0fdf4", border: "1px solid #a7f3d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#059669", transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      <ChevronDown size={15} />
                    </div>
                  </div>
                </div>

                {/* Expanded full report */}
                {isOpen && <ExpandedReport item={item} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;