import { Home, History, LogOut, Sparkles, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .dl2-sidebar {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    position: fixed;
    left: 0; top: 0;
    width: 240px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 16px;
    z-index: 50;
    box-shadow: 2px 0 16px rgba(0,0,0,0.06);
  }

  .dl2-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 8px 20px;
    border-bottom: 1px solid #f0fdf4;
    margin-bottom: 18px;
  }
  .dl2-logo-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(16,185,129,0.35);
  }
  .dl2-logo-text {
    font-size: 0.95rem;
    font-weight: 800;
    color: #064e3b;
    letter-spacing: -0.03em;
    display: block;
  }
  .dl2-logo-sub {
    font-size: 0.6rem;
    color: #9ca3af;
    margin-top: 1px;
    display: block;
  }

  .dl2-section-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d1d5db;
    padding: 0 10px;
    margin-bottom: 6px;
  }

  .dl2-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 10px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: left;
    position: relative;
  }
  .dl2-nav-btn:hover {
    background: #f0fdf4;
    color: #065f46;
  }
  .dl2-nav-btn.active {
    background: #ecfdf5;
    color: #059669;
    font-weight: 700;
  }
  .dl2-nav-btn.active::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 20px;
    background: #10b981;
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 8px rgba(16,185,129,0.5);
  }
  .dl2-nav-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6;
    flex-shrink: 0;
    transition: background 0.18s;
  }
  .dl2-nav-btn:hover .dl2-nav-icon {
    background: #d1fae5;
  }
  .dl2-nav-btn.active .dl2-nav-icon {
    background: #d1fae5;
  }

  .dl2-bottom {
    border-top: 1px solid #f3f4f6;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* User card — clickable, navigates to /profile */
  .dl2-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    margin-bottom: 6px;
    cursor: pointer;
    transition: all 0.18s;
    text-decoration: none;
  }
  .dl2-user-card:hover {
    background: #ecfdf5;
    border-color: #a7f3d0;
  }
  .dl2-user-card.active-profile {
    background: #ecfdf5;
    border-color: #34d399;
  }
  .dl2-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #059669);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px #a7f3d0;
  }
  .dl2-user-name {
    font-size: 0.82rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dl2-user-sub {
    font-size: 0.62rem;
    color: #10b981;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
  }
  .dl2-logout {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 10px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #f87171;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    text-align: left;
  }
  .dl2-logout:hover {
    background: #fff1f2;
    color: #ef4444;
  }
`;

if (typeof document !== "undefined") {
  const old = document.getElementById("dl-styles");
  if (old) old.remove();
  const old2 = document.getElementById("dl2-styles");
  if (old2) old2.remove();
  const s = document.createElement("style");
  s.id = "dl2-styles";
  s.textContent = SIDEBAR_CSS;
  document.head.appendChild(s);
}

// ── Only 2 nav items — profile is accessed via the bottom user card ──
const navItems = [
  { label: "Interview Dashboard", icon: Home,    path: "/dashboard" },
  { label: "Interview History",   icon: History, path: "/history"   },
];

const getStoredUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("user"))        ||
      JSON.parse(localStorage.getItem("userData"))    ||
      JSON.parse(localStorage.getItem("currentUser")) ||
      null
    );
  } catch {
    return null;
  }
};

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user        = getStoredUser();
  const initials    = user ? getInitials(user.firstName, user.lastName) : "U";
  const fullName    = user ? `${user.firstName} ${user.lastName}`.trim() : "User";
  const isOnProfile = location.pathname === "/profile";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── SIDEBAR ── */}
      <div className="dl2-sidebar">

        <div>
          {/* Logo */}
          <div className="dl2-logo">
            <div className="dl2-logo-icon">
              <Sparkles size={16} color="#fff" strokeWidth={2.2} />
            </div>
            <div>
              <span className="dl2-logo-text">InterviewAI</span>
              <span className="dl2-logo-sub">AI-powered coaching</span>
            </div>
          </div>

          {/* Nav */}
          <p className="dl2-section-label">Menu</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`dl2-nav-btn${isActive ? " active" : ""}`}
                >
                  <div className="dl2-nav-icon">
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      color={isActive ? "#059669" : "#6b7280"}
                    />
                  </div>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM: User card → /profile + Sign out ── */}
        <div className="dl2-bottom">

          {/* User card — acts as profile nav entry */}
          <div
            className={`dl2-user-card${isOnProfile ? " active-profile" : ""}`}
            onClick={() => navigate("/profile")}
            title="Smart Analytics & Profile"
          >
            <div className="dl2-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="dl2-user-name">{fullName}</div>
              <div className="dl2-user-sub">
                {isOnProfile ? "● Viewing profile" : "Smart Analytics →"}
              </div>
            </div>
            <UserCircle
              size={14}
              color={isOnProfile ? "#059669" : "#9ca3af"}
              strokeWidth={1.8}
              style={{ flexShrink: 0 }}
            />
          </div>

          <button
            className="dl2-logout"
            onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          >
            <LogOut size={14} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ marginLeft: 240, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;