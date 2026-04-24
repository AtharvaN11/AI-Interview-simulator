import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const InterviewRoles = ({
  selectedCategory,
  interviewCategories,
  setSelectedRole,
  selectedRole,
  setInterviewType,
  mapRoleToInterviewType,
  setStep
}) => {
  const roles = interviewCategories[selectedCategory].roles;

  return (
    <div style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Header — mirrors InterviewCategory header style */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 32 }}
      >
        {/* Back + eyebrow row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
          <button
            onClick={() => { setStep("category"); setSelectedRole(null); }}
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #a7f3d0",
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: "0.78rem",
              color: "#059669",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              transition: "all 0.18s",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#d1fae5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; }}
          >
            ← Back
          </button>

          <p style={{
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#10b981",
          }}>
            Step 2 of 2
          </p>
        </div>

        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "2.1rem",
          color: "#0f2118",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: 8,
        }}>
          Select your role
        </h2>

        {/* Divider accent — same as InterviewCategory */}
        <div style={{
          height: 1, width: 40,
          background: "linear-gradient(90deg, #a7f3d0, transparent)",
          margin: "8px 0 16px", borderRadius: 2,
        }} />

        <p style={{ color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.6 }}>
          Choose the specific role you're interviewing for.
          The AI will generate tailored questions for it.
        </p>
      </motion.div>

      {/* Role grid — 4 columns, same as category grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        width: "100%",
        boxSizing: "border-box",
      }}>
        {roles.map((role, i) => {
          const isSelected = selectedRole === role;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                setSelectedRole(role);
                setInterviewType(mapRoleToInterviewType(role));
              }}
              style={{
                position: "relative",
                background: isSelected ? "#ecfdf5" : "#ffffff",
                border: `1px solid ${isSelected ? "#34d399" : "#e2f0eb"}`,
                borderRadius: 20,
                padding: "24px 20px 44px",
                cursor: "pointer",
                overflow: "hidden",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(52,211,153,0.2), 0 6px 20px rgba(52,211,153,0.12)"
                  : "0 2px 8px rgba(16,185,129,0.04), 0 1px 2px rgba(0,0,0,0.04)",
                transition: "border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#6ee7b7";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.14), 0 2px 8px rgba(16,185,129,0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#e2f0eb";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(16,185,129,0.04), 0 1px 2px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {/* Subtle gradient wash — matches ic-card::before */}
              <div style={{
                position: "absolute", inset: 0,
                background: isSelected
                  ? "linear-gradient(135deg, rgba(209,250,229,0.6) 0%, rgba(255,255,255,0) 60%)"
                  : "none",
                borderRadius: 20,
                pointerEvents: "none",
              }} />

              {/* Selected indicator dot */}
              {isSelected && (
                <span style={{
                  position: "absolute", top: 18, right: 18,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
                }} />
              )}

              {/* Role name */}
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.92rem",
                color: isSelected ? "#064e3b" : "#0f2118",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                marginBottom: 8,
                paddingRight: isSelected ? 20 : 0,
              }}>
                {role}
              </h3>

              {/* Pill — mirrors ic-pill */}
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.72rem",
                fontWeight: 500,
                color: isSelected ? "#065f46" : "#6b7280",
                background: isSelected ? "#d1fae5" : "#f3f4f6",
                borderRadius: 999,
                padding: "3px 10px",
                transition: "background 0.2s, color 0.2s",
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: isSelected ? "#10b981" : "#9ca3af",
                  display: "inline-block", flexShrink: 0,
                }} />
                AI-tailored questions
              </span>

              {/* Arrow — mirrors ic-arrow, only on hover via CSS workaround */}
              <div style={{
                position: "absolute",
                bottom: 18, right: 18,
                width: 26, height: 26,
                borderRadius: "50%",
                background: isSelected ? "#d1fae5" : "#ecfdf5",
                border: `1px solid ${isSelected ? "#6ee7b7" : "#a7f3d0"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isSelected ? 1 : 0.4,
              }}>
                <ArrowRight style={{ width: 12, height: 12, color: "#059669" }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer hint — mirrors InterviewCategory footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: roles.length * 0.06 + 0.2 }}
        style={{
          color: "#9ca3af", fontSize: "0.75rem", marginTop: 24,
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <span style={{
          display: "inline-block", width: 18, height: 1,
          background: "#d1d5db", borderRadius: 2,
        }} />
        {selectedRole
          ? `"${selectedRole}" selected — click Begin Interview to start`
          : "Click a role to select it, then press Begin Interview"}
      </motion.p>
    </div>
  );
};

export default InterviewRoles;