import { useState, useMemo } from "react";
import { useLocation, useNavigate, Outlet, NavLink } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  Database,
  History,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [masterOpen, setMasterOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const {
    toggleTheme,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
    resetTheme,
    isDark,
  } = useTheme();

  const {
    notifications,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount,
  } = useNotification();

  const currentPath = location.pathname;

  const currentHeader = useMemo(() => {
    const headers = {
      "/admin/dashboard": {
        title: "DASHBOARD ADMIN",
        subtitle: "Ringkasan data dan aktivitas sistem MaizeFit",
      },
      "/admin/master": {
        title: "MASTER DATA",
        subtitle: "Pengelolaan data sistem MaizeFit",
      },
      "/admin/user": {
        title: "PENGGUNA",
        subtitle: "Kelola data pengguna yang terdaftar di MaizeFit",
      },
      "/admin/role": {
        title: "ROLE",
        subtitle: "Kelola peran dan hak akses pengguna",
      },
      "/admin/kecamatan": {
        title: "KECAMATAN",
        subtitle: "Kelola data kecamatan pada sistem MaizeFit",
      },
      "/admin/lahan": {
        title: "LAHAN",
        subtitle: "Kelola data lahan yang dinilai dalam MaizeFit",
      },
      "/admin/indikator": {
        title: "INDIKATOR",
        subtitle: "Kelola kriteria indikator penilaian kelayakan lahan",
      },
      "/admin/aturan": {
        title: "ATURAN",
        subtitle: "Kelola basis pengetahuan dan nilai Certainty Factor",
      },
      "/admin/riwayat": {
        title: "RIWAYAT PENILAIAN",
        subtitle: "Lihat riwayat penilaian kelayakan lahan",
      },
    };
    return headers[currentPath] || headers["/admin/dashboard"];
  }, [currentPath]);

  const handleLogoutAction = () => {
    logout();
    navigate("/login");
  };

  const isMasterActive = [
    "/admin/master",
    "/admin/user",
    "/admin/role",
    "/admin/kecamatan",
    "/admin/lahan",
    "/admin/indikator",
    "/admin/aturan",
  ].some((path) => currentPath.startsWith(path));

  return (
    <div className="admin-layout">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "mobile-open" : "sidebar-collapsed"
        }`}
      >
        <button
          className="mobile-sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>

        <div
          className="sidebar-logo"
          onClick={() => navigate("/admin/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/assets/logo.png"
            alt="Logo MaizeFit"
            className="sidebar-logo-image"
          />
          <span>MaizeFit</span>
        </div>

        <nav className="sidebar-menu">
          {/* DASHBOARD */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          {/* MASTER DATA */}
          <button
            type="button"
            className={`sidebar-item master-menu-toggle ${
              isMasterActive ? "parent-active" : ""
            }`}
            onClick={() => setMasterOpen(!masterOpen)}
          >
            <span
              className="sidebar-item-left"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/master");
              }}
            >
              <Database size={18} />
              <span>Master Data</span>
            </span>

            <ChevronDown
              size={17}
              className={`master-arrow ${masterOpen ? "open" : ""}`}
            />
          </button>

          {/* SUB MENU */}
          {masterOpen && (
            <div className="master-submenu">
              <NavLink
                to="/admin/user"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Pengguna</span>
              </NavLink>

              <NavLink
                to="/admin/role"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Role</span>
              </NavLink>

              <NavLink
                to="/admin/kecamatan"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Kecamatan</span>
              </NavLink>

              <NavLink
                to="/admin/lahan"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Lahan</span>
              </NavLink>

              <NavLink
                to="/admin/indikator"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Indikator</span>
              </NavLink>

              <NavLink
                to="/admin/aturan"
                className={({ isActive }) =>
                  `master-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="submenu-line">−</span>
                <span>Aturan</span>
              </NavLink>
            </div>
          )}

          {/* RIWAYAT */}
          <NavLink
            to="/admin/riwayat"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
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

      <main className="admin-content">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="header-menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Buka atau tutup sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="admin-header-title">
              <h2>{currentHeader.title}</h2>
              <p>{currentHeader.subtitle}</p>
            </div>
          </div>

          <div className="admin-header-right">
            {/* QUICK THEME TOGGLE */}
            <button
              type="button"
              className="notification-button"
              onClick={toggleTheme}
              aria-label="Ganti tema"
              title={`Ubah ke mode ${isDark ? "Terang" : "Gelap"}`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* NOTIFICATION */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="notification-button"
                aria-label="Notifikasi"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {notificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <strong>Notifikasi</strong>
                    {notifications.length > 0 && (
                      <button type="button" onClick={clearAllNotifications}>
                        Hapus semua
                      </button>
                    )}
                  </div>

                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        Belum ada notifikasi
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`notification-item ${
                            item.read ? "read" : "unread"
                          }`}
                          onClick={() => markAsRead(item.id)}
                        >
                          <div className="notification-item-content">
                            <span>{item.message}</span>
                          </div>

                          <button
                            type="button"
                            className="notification-delete"
                            onClick={(event) => {
                              event.stopPropagation();
                              clearNotification(item.id);
                            }}
                            aria-label="Hapus notifikasi"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="admin-profile-wrapper">
              <DropdownMenu
                open={profileOpen}
                onOpenChange={setProfileOpen}
              >
                <DropdownMenuTrigger
                  render={<button className="admin-profile" type="button" />}
                >
                  <div className="profile-icon">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>

                  <div className="profile-info">
                    <strong>{user?.name || "Admin"}</strong>
                    <span>{user?.role || "Administrator"}</span>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`profile-arrow ${profileOpen ? "open" : ""}`}
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={toggleTheme}>
                      {isDark ? <Sun size={16} /> : <Moon size={16} />}
                      <span>Tema: {isDark ? "Dark" : "Light"}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={resetTheme}>
                      <span>↻</span>
                      <span>Reset Tema</span>
                    </DropdownMenuItem>

                    <div className="theme-color-section">
                      <span className="theme-color-title">Warna Tema</span>

                      <label className="theme-color-picker">
                        <span>Primary</span>
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(event) =>
                            setPrimaryColor(event.target.value)
                          }
                        />
                      </label>

                      <label className="theme-color-picker">
                        <span>Secondary</span>
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(event) =>
                            setSecondaryColor(event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogoutAction();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* =====================================================
            PAGE OUTLET
        ===================================================== */}
        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
