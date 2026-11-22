import { useState, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  History,
  ChevronDown,
  X,
} from "lucide-react";

const MASTER_PATHS = [
  "/admin/user",
  "/admin/role",
  "/admin/kecamatan",
  "/admin/lahan",
  "/admin/indikator",
  "/admin/aturan",
];

const MOBILE_BREAKPOINT = 768;

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [masterOpen, setMasterOpen] = useState(true);

  const isMasterActive = MASTER_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );

  // Tutup sidebar hanya jika sedang di viewport mobile
  const closeIfMobile = useCallback(() => {
    if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
      onClose();
    }
  }, [onClose]);

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "mobile-open" : "sidebar-collapsed"}`}
    >
      <button
        className="mobile-sidebar-close"
        onClick={onClose}
        aria-label="Tutup menu"
      >
        <X size={20} />
      </button>

      {/* LOGO */}
      <Link
        to="/admin/dashboard"
        className="sidebar-logo"
        onClick={closeIfMobile}
      >
        <img
          src="/assets/logo.png"
          alt="Logo MaizeFit"
          className="sidebar-logo-image"
        />
        <span>MaizeFit</span>
      </Link>

      {/* NAVIGATION */}
      <nav className="sidebar-menu">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
          onClick={closeIfMobile}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Master Data — toggle accordion */}
        <button
          type="button"
          className={`sidebar-item master-menu-toggle ${isMasterActive ? "parent-active" : ""}`}
          onClick={() => setMasterOpen((prev) => !prev)}
        >
          <span className="sidebar-item-left">
            <Database size={18} />
            <span>Master Data</span>
          </span>
          <ChevronDown
            size={17}
            className={`master-arrow ${masterOpen ? "open" : ""}`}
          />
        </button>

        {/* Sub-menu Master Data */}
        {masterOpen && (
          <div className="master-submenu">
            {[
              { to: "/admin/user", label: "Pengguna" },
              { to: "/admin/role", label: "Role" },
              { to: "/admin/kecamatan", label: "Kecamatan" },
              { to: "/admin/lahan", label: "Lahan" },
              { to: "/admin/indikator", label: "Indikator" },
              { to: "/admin/aturan", label: "Aturan" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
                onClick={closeIfMobile}
              >
                <span className="submenu-line">−</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Riwayat Penilaian */}
        <NavLink
          to="/admin/riwayat"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
          onClick={closeIfMobile}
        >
          <History size={18} />
          <span>Riwayat Penilaian</span>
        </NavLink>
      </nav>

      <img
        src="/assets/footer.png"
        alt=""
        className="sidebar-footer-decoration"
      />
    </aside>
  );
}

export default Sidebar;
