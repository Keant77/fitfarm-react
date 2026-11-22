import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, ChevronDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { NotificationPanel } from "./NotificationPanel";

const ROUTE_HEADERS = {
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

export function AdminHeader({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  const currentHeader = useMemo(
    () => ROUTE_HEADERS[location.pathname] ?? ROUTE_HEADERS["/admin/dashboard"],
    [location.pathname]
  );

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      {/* LEFT — hamburger + page title */}
      <div className="admin-header-left">
        <button
          type="button"
          className="header-menu-button"
          onClick={onToggleSidebar}
          aria-label="Buka atau tutup sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="admin-header-title">
          <h2>{currentHeader.title}</h2>
          <p>{currentHeader.subtitle}</p>
        </div>
      </div>

      {/* RIGHT — theme, notifikasi, profil */}
      <div className="admin-header-right">
        {/* Quick theme toggle */}
        <button
          type="button"
          className="notification-button"
          onClick={toggleTheme}
          aria-label="Ganti tema"
          title={`Ubah ke mode ${isDark ? "Terang" : "Gelap"}`}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notification bell */}
        <NotificationPanel
          isOpen={notificationOpen}
          onToggle={() => setNotificationOpen((prev) => !prev)}
        />

        {/* Profile dropdown */}
        <div className="admin-profile-wrapper">
          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
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
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </label>
                  <label className="theme-color-picker">
                    <span>Secondary</span>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </label>
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
