import { Radar } from "react-chartjs-2";
import { PlayCircle, BarChart3 } from "lucide-react";

const InterviewFeedback = ({ feedback, resetInterview, selectedRole }) => {
  if (!feedback) return null;

  const scoreColor = feedback.overallScore >= 7 ? "#059669" : feedback.overallScore >= 4 ? "#d97706" : "#dc2626";
  const scoreBg    = feedback.overallScore >= 7 ? "#ecfdf5" : feedback.overallScore >= 4 ? "#fffbeb" : "#fef2f2";
  const scoreBorder= feedback.overallScore >= 7 ? "#6ee7b7" : feedback.overallScore >= 4 ? "#fcd34d" : "#fca5a5";

  const radarData = {
    labels: ["Technical", "Communication", "Confidence", "Cognitive Depth"],
    datasets: [{
      label: "Your Performance",
      data: [
        feedback.conceptCoverage / 10,
        feedback.communication,
        feedback.confidence,
        feedback.cognitiveDepth
      ],
      backgroundColor: "rgba(16,185,129,0.1)",
      borderColor: "#10b981",
      borderWidth: 2.5,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#10b981",
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const metrics = [
    { label: "Concept Coverage", value: `${feedback.conceptCoverage}%`,  raw: feedback.conceptCoverage / 10 },
    { label: "Communication",    value: `${feedback.communication}/10`,  raw: feedback.communication },
    { label: "Confidence",       value: `${feedback.confidence}/10`,     raw: feedback.confidence },
    { label: "Cognitive Depth",  value: `${feedback.cognitiveDepth}/10`, raw: feedback.cognitiveDepth },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      padding: "36px 48px 60px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 64, height: 64, borderRadius: 18,
          background: "#ecfdf5", border: "1px solid #a7f3d0",
          marginBottom: 16, boxShadow: "0 4px 16px rgba(16,185,129,0.15)",
        }}>
          <BarChart3 style={{ width: 28, height: 28, color: "#059669" }} />
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: "2rem",
          color: "#0f2118", letterSpacing: "-0.04em",
          marginBottom: 8,
        }}>
          Interview Complete
        </h1>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Role:</span>
          <span style={{
            fontWeight: 700, fontSize: "0.9rem", color: "#059669",
            background: "#ecfdf5", border: "1px solid #a7f3d0",
            borderRadius: 999, padding: "2px 12px",
          }}>
            {selectedRole}
          </span>
        </div>

        {/* Score ring */}
        <div style={{
          display: "inline-flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          width: 110, height: 110, borderRadius: "50%",
          background: scoreBg,
          border: `3px solid ${scoreBorder}`,
          boxShadow: `0 0 32px ${scoreBorder}88`,
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: "2.2rem",
            color: scoreColor, lineHeight: 1,
          }}>
            {feedback.overallScore}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "0.72rem", marginTop: 2 }}>/ 10</span>
        </div>

        <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 14, maxWidth: 480, margin: "14px auto 0" }}>
          {feedback.summary}
        </p>
      </div>

      {/* ── METRIC CARDS ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14, marginBottom: 24,
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #e2f0eb", padding: "20px 18px",
            boxShadow: "0 2px 8px rgba(16,185,129,0.05)",
          }}>
            <p style={{
              fontWeight: 800, fontSize: "1.6rem",
              color: "#059669", marginBottom: 6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.03em",
            }}>
              {m.value}
            </p>
            <div style={{
              height: 3, background: "#f0fdf4",
              borderRadius: 99, marginBottom: 8, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${(m.raw / 10) * 100}%`,
                background: "linear-gradient(90deg, #34d399, #059669)",
              }} />
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── RADAR + STRENGTHS/IMPROVEMENTS ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 20, marginBottom: 20,
      }}>

        {/* Radar */}
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid #e2f0eb", padding: "28px 24px",
          boxShadow: "0 2px 8px rgba(16,185,129,0.05)",
        }}>
          <p style={{
            fontWeight: 700, fontSize: "0.68rem",
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#10b981", marginBottom: 4,
          }}>Performance</p>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: "1.05rem",
            color: "#0f2118", letterSpacing: "-0.02em", marginBottom: 20,
          }}>
            Radar Overview
          </h2>
          <Radar
            data={radarData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                r: {
                  min: 0, max: 10,
                  ticks: { stepSize: 2, color: "#9ca3af", backdropColor: "transparent", font: { size: 10 } },
                  grid: { color: "rgba(16,185,129,0.08)" },
                  angleLines: { color: "rgba(16,185,129,0.12)" },
                  pointLabels: { font: { size: 12, weight: "600" }, color: "#374151" }
                }
              }
            }}
          />
        </div>

        {/* Strengths + Improvements stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Strengths */}
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1px solid #e2f0eb", padding: "24px",
            boxShadow: "0 2px 8px rgba(16,185,129,0.05)", flex: 1,
          }}>
            <p style={{
              fontWeight: 700, fontSize: "0.68rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#10b981", marginBottom: 4,
            }}>What went well</p>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: "1.05rem",
              color: "#0f2118", letterSpacing: "-0.02em", marginBottom: 16,
            }}>Strengths</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {feedback.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: "#ecfdf5", border: "1px solid #a7f3d0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.6rem", color: "#059669", fontWeight: 700, marginTop: 1,
                  }}>✓</div>
                  <span style={{ color: "#374151", fontSize: "0.84rem", lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          {feedback.areasForImprovement.length > 0 && (
            <div style={{
              background: "#fff", borderRadius: 20,
              border: "1px solid #e2f0eb", padding: "24px",
              boxShadow: "0 2px 8px rgba(16,185,129,0.05)", flex: 1,
            }}>
              <p style={{
                fontWeight: 700, fontSize: "0.68rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#d97706", marginBottom: 4,
              }}>Room to grow</p>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: "1.05rem",
                color: "#0f2118", letterSpacing: "-0.02em", marginBottom: 16,
              }}>Improvements</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {feedback.areasForImprovement.map((area, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #fcd34d", paddingLeft: 14 }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 4,
                    }}>
                      <span style={{ fontWeight: 700, fontSize: "0.84rem", color: "#111827" }}>{area.area}</span>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600, color: "#d97706",
                        background: "#fffbeb", border: "1px solid #fcd34d",
                        borderRadius: 999, padding: "2px 8px",
                      }}>{area.score}/10</span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "0.78rem", lineHeight: 1.5 }}>{area.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── QUESTION ANALYSIS ── */}
      <div style={{
        background: "#fff", borderRadius: 20,
        border: "1px solid #e2f0eb", padding: "28px",
        boxShadow: "0 2px 8px rgba(16,185,129,0.05)",
        marginBottom: 24,
      }}>
        <p style={{
          fontWeight: 700, fontSize: "0.68rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#10b981", marginBottom: 4,
        }}>Breakdown</p>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: "1.1rem",
          color: "#0f2118", letterSpacing: "-0.02em", marginBottom: 20,
        }}>Question-by-Question Analysis</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {feedback.questionAnalysis.map((q, i) => (
            <div key={i} style={{
              padding: "18px 20px", borderRadius: 14,
              background: "#f9fafb", border: "1px solid #f0fdf4",
            }}>
              <p style={{
                fontWeight: 700, fontSize: "0.88rem",
                color: "#0f2118", marginBottom: 14, lineHeight: 1.45,
              }}>
                <span style={{ color: "#10b981", marginRight: 8 }}>Q{i + 1}</span>
                {q.question}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Rule Score",    value: `${q.ruleScore}/10`,   highlight: false },
                  { label: "ML Score",      value: `${q.mlScore}/10`,     highlight: false },
                  { label: "Hybrid Score",  value: `${q.hybridScore}/10`, highlight: true  },
                  { label: "Concept Match", value: `${q.conceptMatch}%`,  highlight: false },
                ].map((stat, j) => (
                  <div key={j} style={{
                    background: stat.highlight ? "#ecfdf5" : "#fff",
                    border: `1px solid ${stat.highlight ? "#a7f3d0" : "#e5e7eb"}`,
                    borderRadius: 10, padding: "8px 16px", textAlign: "center",
                    minWidth: 90,
                  }}>
                    <p style={{
                      fontWeight: 800, fontSize: "1rem",
                      color: stat.highlight ? "#059669" : "#111827",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      letterSpacing: "-0.02em", marginBottom: 2,
                    }}>{stat.value}</p>
                    <p style={{
                      color: "#9ca3af", fontSize: "0.62rem",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={resetInterview}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", border: "none",
          borderRadius: 14, padding: "17px 0",
          fontSize: "1rem",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
          boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
          transition: "transform 0.2s, box-shadow 0.2s",
          letterSpacing: "-0.01em",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.3)";
        }}
      >
        <PlayCircle style={{ width: 20, height: 20 }} />
        Start New Interview
      </button>

    </div>
  );
};

export default InterviewFeedback;