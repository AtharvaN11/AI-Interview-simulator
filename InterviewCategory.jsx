import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ic-card {
    position: relative;
    background: #ffffff;
    border: 1px solid #e2f0eb;
    border-radius: 20px;
    padding: 28px 24px 52px;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
    box-shadow: 0 2px 8px rgba(16,185,129,0.04), 0 1px 2px rgba(0,0,0,0.04);
  }
  .ic-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(236,253,245,0.9) 0%, rgba(255,255,255,0) 55%);
    opacity: 0;
    transition: opacity 0.22s ease;
    border-radius: 20px;
  }
  .ic-card:hover {
    border-color: #6ee7b7;
    box-shadow: 0 8px 32px rgba(16,185,129,0.14), 0 2px 8px rgba(16,185,129,0.08);
    transform: translateY(-3px);
  }
  .ic-card:hover::before { opacity: 1; }
  .ic-index {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #a7f3d0;
    position: absolute;
    top: 20px;
    right: 22px;
  }
  .ic-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border: 1px solid #a7f3d0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    transition: background 0.22s, box-shadow 0.22s;
    flex-shrink: 0;
  }
  .ic-card:hover .ic-icon-wrap {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    box-shadow: 0 0 0 6px rgba(167,243,208,0.25);
  }
  .ic-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #064e3b;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-bottom: 8px;
  }
  .ic-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    font-weight: 500;
    color: #6b7280;
    background: #f3f4f6;
    border-radius: 999px;
    padding: 3px 10px;
    transition: background 0.2s, color 0.2s;
  }
  .ic-card:hover .ic-pill {
    background: #d1fae5;
    color: #065f46;
  }
  .ic-arrow {
    position: absolute;
    bottom: 22px;
    right: 22px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.2s, transform 0.2s;
  }
  .ic-card:hover .ic-arrow {
    opacity: 1;
    transform: translateX(0);
  }
`;

if (typeof document !== "undefined" && !document.getElementById("ic-styles")) {
  const s = document.createElement("style");
  s.id = "ic-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const InterviewCategory = ({ interviewCategories, setSelectedCategory, setStep }) => {
  const entries = Object.entries(interviewCategories);

  return (
    <div style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 32 }}
      >
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#10b981",
          marginBottom: 10,
        }}>
          Step 1 of 2
        </p>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "2.1rem",
          color: "#0f2118",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: 8,
        }}>
          Choose your interview track
        </h2>
        <div style={{
          height: 1, width: 40,
          background: "linear-gradient(90deg, #a7f3d0, transparent)",
          margin: "8px 0 16px", borderRadius: 2,
        }} />
        <p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6 }}>
          Select the category that best matches the role you're preparing for. You'll pick a specific role next.
        </p>
      </motion.div>

      {/* Grid — 4 equal columns, fills 100% of whatever parent gives */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        width: "100%",
        boxSizing: "border-box",
      }}>
        {entries.map(([key, cat], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => { setSelectedCategory(key); setStep("role"); }}
            className="ic-card"
          >
            <span className="ic-index">0{i + 1}</span>
            <div className="ic-icon-wrap">
              <cat.icon style={{ width: 22, height: 22, color: "#059669", strokeWidth: 1.75 }} />
            </div>
            <h3 className="ic-card-title">{cat.title}</h3>
            <span className="ic-pill">
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#10b981", display: "inline-block", flexShrink: 0,
              }} />
              {cat.roles.length} role{cat.roles.length !== 1 ? "s" : ""}
            </span>
            <div className="ic-arrow">
              <ArrowRight style={{ width: 13, height: 13, color: "#059669" }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: entries.length * 0.09 + 0.2 }}
        style={{
          color: "#9ca3af", fontSize: "0.75rem", marginTop: 24,
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <span style={{ display: "inline-block", width: 18, height: 1, background: "#d1d5db", borderRadius: 2 }} />
        Click any card to explore roles in that category
      </motion.p>
    </div>
  );
};

export default InterviewCategory;