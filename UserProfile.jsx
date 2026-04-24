import { getHistory } from "../api/api";
import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Award, Target,
  User, Calendar, Mail, Clock, Zap, Star, AlertTriangle,
  CheckCircle, BookOpen, Flame, Shield
} from "lucide-react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Tooltip, Legend, Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler
);

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .up-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    padding: 36px 48px 60px;
  }
  .up-card {
    background: #fff;
    border: 1px solid #e2f0eb;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(16,185,129,0.05);
    padding: 28px;
  }
  .up-stat-card {
    background: #fff;
    border: 1px solid #e2f0eb;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(16,185,129,0.05);
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
  }
  .up-stat-card:hover {
    box-shadow: 0 6px 24px rgba(16,185,129,0.1);
    border-color: #a7f3d0;
    transform: translateY(-2px);
  }
  .up-section-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #10b981;
    margin-bottom: 4px;
  }
  .up-section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #0f2118;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }
  .up-tip-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #f0fdf4;
    transition: border-color 0.18s;
  }
  .up-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    padding: 3px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .up-progress-bar {
    height: 6px;
    background: #f0fdf4;
    border-radius: 99px;
    overflow: hidden;
    margin-top: 6px;
  }
  .up-avatar-ring {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800; color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 0 0 4px #d1fae5, 0 0 0 8px #a7f3d0;
    flex-shrink: 0;
  }
  .up-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #f0fdf4;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("up-styles")) {
  const s = document.createElement("style");
  s.id = "up-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const getScoreColor  = (s) => s >= 7 ? "#059669" : s >= 4 ? "#d97706" : "#dc2626";
const getScoreBg     = (s) => s >= 7 ? "#ecfdf5" : s >= 4 ? "#fffbeb" : "#fef2f2";
const getScoreBorder = (s) => s >= 7 ? "#6ee7b7" : s >= 4 ? "#fcd34d" : "#fca5a5";
const getScoreLabel  = (s) => s >= 8 ? "Excellent" : s >= 6 ? "Good" : s >= 4 ? "Average" : "Needs Work";

const formatDOB = (dob) => {
  if (!dob) return "—";
  const [d, m, y] = dob.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
};

const getAge = (dob) => {
  if (!dob) return null;
  const [d, m, y] = dob.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
};

/* ─── Analytics Engine ───────────────────────────────────────────────────── */
const computeAnalytics = (history) => {
  if (!history.length) return null;

  const scores = history.map(h => h.score);
  const avgScore   = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
  const bestScore  = Math.max(...scores);
  const totalSessions = history.length;

  // Role averages
  const roleMap = {};
  history.forEach(h => {
    if (!roleMap[h.role]) roleMap[h.role] = [];
    roleMap[h.role].push(h.score);
  });
  const roleAvgs = Object.entries(roleMap).map(([role, arr]) => ({
    role,
    avg: parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)),
    count: arr.length,
  }));
  const bestRole  = [...roleAvgs].sort((a, b) => b.avg - a.avg)[0];

  // Weak areas from feedback
  const areaMap = {};
  history.forEach(h => {
    h.feedback?.areasForImprovement?.forEach(a => {
      if (!areaMap[a.area]) areaMap[a.area] = { count: 0, feedback: a.feedback };
      areaMap[a.area].count++;
    });
  });
  const weakAreas = Object.entries(areaMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
    .map(([area, data]) => ({ area, ...data }));

  // Top strengths
  const strengthMap = {};
  history.forEach(h => {
    h.feedback?.strengths?.forEach(s => {
      if (!strengthMap[s]) strengthMap[s] = 0;
      strengthMap[s]++;
    });
  });
  const topStrengths = Object.entries(strengthMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s);

  // Score trend — last 7 sessions
  const recent = history.slice(-7);
  const trend  = recent.length >= 2
    ? recent[recent.length - 1].score - recent[0].score
    : 0;

  // Avg metrics
  const withFeedback = history.filter(h => h.feedback);
  let avgMetrics = null;
  if (withFeedback.length) {
    avgMetrics = {
      conceptCoverage: parseFloat((withFeedback.reduce((a, h) => a + h.feedback.conceptCoverage, 0) / withFeedback.length).toFixed(1)),
      communication:   parseFloat((withFeedback.reduce((a, h) => a + h.feedback.communication,   0) / withFeedback.length).toFixed(1)),
      confidence:      parseFloat((withFeedback.reduce((a, h) => a + h.feedback.confidence,      0) / withFeedback.length).toFixed(1)),
      cognitiveDepth:  parseFloat((withFeedback.reduce((a, h) => a + h.feedback.cognitiveDepth,  0) / withFeedback.length).toFixed(1)),
    };
  }

  // Personalised tips
  const tips = [];
  if (avgMetrics) {
    if (avgMetrics.conceptCoverage < 50) tips.push({ icon: BookOpen,    color: "#d97706", bg: "#fffbeb", border: "#fcd34d", title: "Study Core Concepts",      desc: "Your concept coverage is below 50%. Focus on role-specific terminology before your next session." });
    if (avgMetrics.communication < 5)   tips.push({ icon: Zap,          color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", title: "Structure Your Answers",   desc: "Use the STAR method (Situation, Task, Action, Result) to give more organised responses." });
    if (avgMetrics.confidence < 5)      tips.push({ icon: Shield,       color: "#0284c7", bg: "#eff6ff", border: "#bae6fd", title: "Build Confidence",         desc: "Practice answers out loud. Reducing filler words like 'um' and 'uh' will improve your score." });
    if (avgMetrics.cognitiveDepth < 5)  tips.push({ icon: Target,       color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", title: "Add Depth to Answers",     desc: "Support every answer with a real example. Use 'for example' or 'in my experience' to show depth." });
  }
  if (trend < 0)         tips.push({ icon: TrendingDown, color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", title: "Score Declining",    desc: "Your recent scores are trending down. Revisit weaker roles and aim for one session per day." });
  if (totalSessions < 3) tips.push({ icon: Flame,        color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", title: "Keep Practising",    desc: "Complete at least 5 sessions for meaningful analytics. Consistency is the fastest path to improvement." });
  if (!tips.length)      tips.push({ icon: Star,         color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", title: "You're on Track!",   desc: "Great performance across the board. Keep practising diverse roles to stay sharp." });

  return { avgScore, bestScore, totalSessions, bestRole, roleAvgs, weakAreas, topStrengths, trend, recent, avgMetrics, tips };
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const UserProfile = () => {
  const [user, setUser]           = useState(null);
  const [history, setHistory]     = useState([]);
  const [analytics, setAnalytics] = useState(null);

useEffect(() => {
  // User still loads from localStorage (set during login)
  const keys = ["user", "userData", "loggedInUser", "currentUser"];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw) { try { setUser(JSON.parse(raw)); break; } catch {} }
  }

  // History now loads from MongoDB
  const fetchData = async () => {
    try {
      const data = await getHistory();
      const history = Array.isArray(data) ? data : [];
      setHistory(history);
      setAnalytics(computeAnalytics(history));
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setHistory([]);
      setAnalytics(null);
    }
  };
  fetchData();
}, []);

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "User";

  const trendChartData = analytics ? {
    labels: analytics.recent.map((_, i) => `S${i + 1}`),
    datasets: [{
      label: "Score",
      data: analytics.recent.map(h => h.score),
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.08)",
      borderWidth: 2.5,
      pointBackgroundColor: analytics.recent.map(h => getScoreColor(h.score)),
      pointBorderColor: "#fff",
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }]
  } : null;

  const roleChartData = analytics?.roleAvgs?.length ? {
    labels: analytics.roleAvgs.map(r => r.role.length > 14 ? r.role.slice(0, 14) + "…" : r.role),
    datasets: [{
      label: "Avg Score",
      data: analytics.roleAvgs.map(r => r.avg),
      backgroundColor: analytics.roleAvgs.map(r =>
        r.avg >= 7 ? "rgba(16,185,129,0.7)" : r.avg >= 4 ? "rgba(217,119,6,0.7)" : "rgba(220,38,38,0.7)"
      ),
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null;

  const chartOptions = (yMax = 10) => ({
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: yMax, ticks: { stepSize: 2, color: "#9ca3af", font: { size: 11 } }, grid: { color: "rgba(16,185,129,0.06)" } },
      x: { ticks: { color: "#9ca3af", font: { size: 10 } }, grid: { display: false } },
    }
  });

  return (
    <div className="up-root">

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: 32 }}>
        <p className="up-section-label">Your account</p>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0f2118", letterSpacing: "-0.04em" }}>
          Profile & Analytics
        </h1>
      </div>

      {/* ── PROFILE + QUICK STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, marginBottom: 20 }}>

        {/* Profile card */}
        <div className="up-card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="up-avatar-ring">{initials}</div>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#0f2118", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {fullName}
              </h2>
              {analytics && (
                <span className="up-badge" style={{ background: getScoreBg(analytics.avgScore), border: `1px solid ${getScoreBorder(analytics.avgScore)}`, color: getScoreColor(analytics.avgScore) }}>
                  <Star size={10} /> {getScoreLabel(analytics.avgScore)} Performer
                </span>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: "#f0fdf4" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: Mail,     label: "Email",        value: user?.email || "—" },
              { icon: Calendar, label: "Date of Birth", value: user?.dob ? `${formatDOB(user.dob)} (Age ${getAge(user.dob)})` : "—" },
              { icon: Clock,    label: "First Session", value: history.length ? history[history.length - 1]?.date?.split(",")[0] : "—" },
              { icon: BarChart3, label: "Total Sessions", value: analytics ? `${analytics.totalSessions} interview${analytics.totalSessions !== 1 ? "s" : ""}` : "0 interviews" },
            ].map((item, i) => (
              <div key={i} className="up-info-row">
                <item.icon size={14} color="#10b981" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#9ca3af", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</p>
                  <p style={{ color: "#111827", fontSize: "0.82rem", fontWeight: 600 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1fr 1fr", gap: 14 }}>
          {[
            { icon: TrendingUp,   color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "Average Score",    value: analytics ? `${analytics.avgScore}/10` : "—",    sub: analytics ? getScoreLabel(analytics.avgScore) : "no data" },
            { icon: Award,        color: "#d97706", bg: "#fffbeb", border: "#fcd34d", label: "Best Score",       value: analytics ? `${analytics.bestScore}/10` : "—",   sub: "personal best" },
            { icon: Flame,        color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", label: "Best Role",        value: analytics?.bestRole?.role ?? "—",                sub: analytics?.bestRole ? `avg ${analytics.bestRole.avg}/10` : "no data", small: true },
            { icon: Target,       color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", label: "Score Trend",      value: analytics ? (analytics.trend > 0 ? `+${analytics.trend}` : `${analytics.trend}`) : "—", sub: analytics ? (analytics.trend > 0 ? "improving 📈" : analytics.trend < 0 ? "declining 📉" : "stable ➡️") : "no data", trendColor: analytics ? (analytics.trend > 0 ? "#059669" : analytics.trend < 0 ? "#dc2626" : "#6b7280") : "#6b7280" },
            { icon: CheckCircle,  color: "#0284c7", bg: "#eff6ff", border: "#bae6fd", label: "Roles Tried",      value: analytics ? analytics.roleAvgs.length : 0,       sub: "unique roles" },
            { icon: BarChart3,    color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "Sessions",         value: analytics?.totalSessions ?? 0,                   sub: "completed" },
          ].map((stat, i) => (
            <div key={i} className="up-stat-card">
              <div style={{ width: 34, height: 34, borderRadius: 9, background: stat.bg, border: `1px solid ${stat.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <stat.icon size={15} color={stat.color} />
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: stat.small ? "0.88rem" : "1.4rem", color: stat.trendColor || "#0f2118", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 3 }}>{stat.value}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{stat.label}</p>
              <p style={{ color: "#6b7280", fontSize: "0.7rem" }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ── */}
      {analytics && analytics.recent.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div className="up-card">
            <p className="up-section-label">Progress</p>
            <h3 className="up-section-title">Score Trend</h3>
            <Line data={trendChartData} options={chartOptions()} />
          </div>
          <div className="up-card">
            <p className="up-section-label">By Role</p>
            <h3 className="up-section-title">Role Performance</h3>
            {roleChartData
              ? <Bar data={roleChartData} options={chartOptions()} />
              : <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Complete more sessions to see role breakdown.</p>
            }
          </div>
        </div>
      )}

      {/* ── SKILL BREAKDOWN + WEAK AREAS + STRENGTHS ── */}
      {analytics?.avgMetrics && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>

          <div className="up-card">
            <p className="up-section-label">Averages</p>
            <h3 className="up-section-title">Skill Breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Concept Coverage", value: analytics.avgMetrics.conceptCoverage, display: `${(analytics.avgMetrics.conceptCoverage * 10).toFixed(0)}%` },
                { label: "Communication",    value: analytics.avgMetrics.communication,   display: `${analytics.avgMetrics.communication}/10` },
                { label: "Confidence",       value: analytics.avgMetrics.confidence,      display: `${analytics.avgMetrics.confidence}/10` },
                { label: "Cognitive Depth",  value: analytics.avgMetrics.cognitiveDepth,  display: `${analytics.avgMetrics.cognitiveDepth}/10` },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151" }}>{m.label}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: getScoreColor(m.value) }}>{m.display}</span>
                  </div>
                  <div className="up-progress-bar">
                    <div style={{ height: "100%", borderRadius: 99, width: `${(m.value / 10) * 100}%`, background: `linear-gradient(90deg, ${getScoreColor(m.value)}66, ${getScoreColor(m.value)})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="up-card">
            <p className="up-section-label" style={{ color: "#d97706" }}>Watch out</p>
            <h3 className="up-section-title">Weak Areas</h3>
            {analytics.weakAreas.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "0.84rem" }}>No weak areas detected yet. Keep going!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {analytics.weakAreas.map((w, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <AlertTriangle size={12} color="#d97706" />
                      <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#92400e" }}>{w.area}</span>
                      <span style={{ marginLeft: "auto", fontSize: "0.62rem", fontWeight: 700, color: "#d97706", background: "#fff", border: "1px solid #fcd34d", borderRadius: 999, padding: "1px 7px" }}>×{w.count}</span>
                    </div>
                    <p style={{ color: "#78350f", fontSize: "0.73rem", lineHeight: 1.5 }}>{w.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="up-card">
            <p className="up-section-label">You're good at</p>
            <h3 className="up-section-title">Top Strengths</h3>
            {analytics.topStrengths.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "0.84rem" }}>Complete more sessions to discover your strengths.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {analytics.topStrengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 800, color: "#059669" }}>
                      {i + 1}
                    </div>
                    <span style={{ color: "#374151", fontSize: "0.84rem", lineHeight: 1.55, fontWeight: 500 }}>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── IMPROVEMENT TIPS ── */}
      {analytics?.tips?.length > 0 && (
        <div className="up-card" style={{ marginBottom: 20 }}>
          <p className="up-section-label">Personalised</p>
          <h3 className="up-section-title">Improvement Tips</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {analytics.tips.map((tip, i) => (
              <div key={i} className="up-tip-card" style={{ borderColor: tip.border, background: tip.bg }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "#fff", border: `1px solid ${tip.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <tip.icon size={16} color={tip.color} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.84rem", color: "#111827", marginBottom: 3 }}>{tip.title}</p>
                  <p style={{ color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.55 }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RECENT SESSIONS ── */}
      <div className="up-card">
        <p className="up-section-label">History</p>
        <h3 className="up-section-title">Recent Sessions</h3>
        {history.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No sessions yet. Complete your first interview to see data here.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "#f9fafb", border: "1px solid #f0fdf4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: getScoreBg(h.score), border: `2px solid ${getScoreBorder(h.score)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: getScoreColor(h.score), lineHeight: 1 }}>{h.score}</span>
                    <span style={{ color: "#9ca3af", fontSize: "0.5rem" }}>/10</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>{h.role}</p>
                    <p style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{h.date}</p>
                  </div>
                </div>
                <span className="up-badge" style={{ background: getScoreBg(h.score), border: `1px solid ${getScoreBorder(h.score)}`, color: getScoreColor(h.score) }}>
                  {getScoreLabel(h.score)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;