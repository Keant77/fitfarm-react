import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import MapLahan from "../components/MapLahan";
import MasterData from "./MasterData";
import User from "./User";
import Role from "./Role";
import Kecamatan from "./kecamatan";
import Lahan from "./Lahan";
import RiwayatPenilaian from "./RiwayatPenilaian";
import { useAdvancedTheme } from "../context/AdvancedThemeContext";
import { useNotification } from "../context/NotificationContext";
import { StatCard } from "../components/ui/stat-card";

import {
  LayoutDashboard,
  Database,
  History,
  Users,
  Wheat,
  Gauge,
  Target,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  MapPinned,
  Menu,
  Moon,
  X,
} from "lucide-react";


function AdminDashboard({ onLogout }) {
  const [masterOpen, setMasterOpen] = useState(true);
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem("maizefit_halaman");
    const validPages = ["dashboard", "master", "user", "role", "kecamatan", "lahan", "riwayat"];
    return validPages.includes(savedPage) ? savedPage : "dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const {
  toggleTheme: toggleAdvancedTheme,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
   resetTheme,
  isDark: isAdvancedDark,
} = useAdvancedTheme();

const {
  notifications,
  markAsRead,
  clearNotification,
  clearAllNotifications,
  unreadCount,
} = useNotification();

 const handlePageChange = (page) => {
  setActivePage(page);
  localStorage.setItem("maizefit_halaman", page);
};

  const pageHeaders = {
    dashboard: { title: "DASHBOARD ADMIN", subtitle: "Ringkasan data dan aktivitas sistem MaizeFit" },
    master: { title: "MASTER DATA", subtitle: "Pengelolaan data sistem MaizeFit" },
    user: { title: "PENGGUNA", subtitle: "Kelola data pengguna yang terdaftar di MaizeFit" },
    role: { title: "ROLE", subtitle: "Kelola peran dan hak akses pengguna" },
    kecamatan: { title: "KECAMATAN", subtitle: "Kelola data kecamatan pada sistem MaizeFit" },
    lahan: { title: "LAHAN", subtitle: "Kelola data lahan yang dinilai dalam MaizeFit" },
    riwayat: { title: "RIWAYAT PENILAIAN", subtitle: "Lihat riwayat penilaian kelayakan lahan" },
  };
  const currentHeader = pageHeaders[activePage] || pageHeaders.dashboard;


  const dashboardStats = [
    {
      title: "Jumlah Pengguna",
      value: "1",
      icon: Users,
      type: "green",
    },
    {
      title: "Jumlah Lahan",
      value: "10",
      icon: Wheat,
      type: "yellow",
    },
    {
      title: "Jumlah Kecamatan",
      value: "31",
      icon: MapPinned,
      type: "green",
    },
    {
      title: "Jumlah Indikator",
      value: "5",
      icon: Gauge,
      type: "green",
    },
    {
      title: "Jumlah Aturan",
      value: "15",
      icon: Target,
      type: "green",
    },
  ];


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

        {/* MOBILE CLOSE */}
        <button
          className="mobile-sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>


        {/* LOGO */}
        <div className="sidebar-logo">
         <img
           src="/assets/logo.png"
           alt="Logo MaizeFit"
           className="sidebar-logo-image"
         />

        <span>MaizeFit</span>
      </div>


        {/* MENU */}
        <nav className="sidebar-menu">

          {/* DASHBOARD */}
          <button
            className={`sidebar-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => handlePageChange("dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          {/* MASTER DATA */}
          <button
            className={`sidebar-item master-menu-toggle ${
              ["user", "role", "kecamatan", "lahan"].includes(activePage)
                ? "parent-active"
                : ""
            }`}
            onClick={() => setMasterOpen(!masterOpen)}
          >
            <span className="sidebar-item-left">
              <Database size={18} />
              <span>Master Data</span>
            </span>

            <ChevronDown
              size={17}
              className={`master-arrow ${
                masterOpen ? "open" : ""
              }`}
            />
          </button>


          {/* SUB MENU */}
          {masterOpen && (
            <div className="master-submenu">

              <button
                type="button"
                className={`master-submenu-item ${activePage === "user" ? "active" : ""}`}
                onClick={() => handlePageChange("user")}
              >
                <span className="submenu-line">−</span>
                <span>Pengguna</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "role" ? "active" : ""
                }`}
                onClick={() => handlePageChange("role")}
              >
                <span className="submenu-line">−</span>
                <span>Role</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "kecamatan" ? "active" : ""
                }`}
                onClick={() => handlePageChange("kecamatan")}
              >
                <span className="submenu-line">−</span>
                <span>Kecamatan</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "lahan" ? "active" : ""
                }`}
                onClick={() => handlePageChange("lahan")}
              >
                <span className="submenu-line">−</span>
                <span>Lahan</span>
              </button>

            </div>
          )}


          {/* RIWAYAT */}
          <button
            className={`sidebar-item ${
              activePage === "riwayat" ? "active" : ""
            }`}
            onClick={() => handlePageChange("riwayat")}
          >
            <History size={18} />
            <span>Riwayat Penilaian</span>
          </button>

        </nav>

        {/* FOOTER SIDEBAR */}
        <img
         src="/assets/footer.png"
         alt=""
         className="sidebar-footer-decoration"
        />

        </aside>

      <main className="admin-content">

           {/* HEADER */}
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

    <p>
      {currentHeader.subtitle}
    </p>
  </div>

</div>


              {/* HEADER RIGHT */}
              <div className="admin-header-right">

                {/* NOTIFICATION */}
                <div className="notification-wrapper">
  <button
    type="button"
    className="notification-button"
    aria-label="Notifikasi"
    onClick={() =>
      setNotificationOpen(!notificationOpen)
    }
  >
    <Bell size={19} />

    {unreadCount > 0 && (
      <span className="notification-badge">
        {unreadCount}
      </span>
    )}
  </button>

  {notificationOpen && (
    <div className="notification-dropdown">
      <div className="notification-header">
        <strong>Notifikasi</strong>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearAllNotifications}
          >
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


                {/* PROFILE + DROPDOWN */}
<div className="admin-profile-wrapper">

  <DropdownMenu
  open={profileOpen}
  onOpenChange={setProfileOpen}
>
  <DropdownMenuTrigger
    render={
      <button
        className="admin-profile"
        type="button"
      />
    }
  >
    <div className="profile-icon">
      A
    </div>

    <div className="profile-info">
      <strong>Admin</strong>
      <span>Administrator</span>
    </div>

    <ChevronDown
      size={16}
      className={`profile-arrow ${
        profileOpen ? "open" : ""
      }`}
    />
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-48"
  >

    <DropdownMenuGroup>

      {/* TEMA */}
      <DropdownMenuItem
        onClick={toggleAdvancedTheme}
      >
        <Moon size={16} />
        <span>
        Tema: {isAdvancedDark ? "Dark" : "Light"}
        </span>
      </DropdownMenuItem>

      <DropdownMenuItem
         onClick={resetTheme}
      >
        <span>↻</span>
        <span>Reset Tema</span>
      </DropdownMenuItem>

      <div className="theme-color-section">
  <span className="theme-color-title">
    Warna Tema
  </span>

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

      {/* LOGOUT */}
      <DropdownMenuItem
        variant="destructive"
        onClick={() => {
          setProfileOpen(false);
          onLogout();
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
            DASHBOARD
        ===================================================== */}

        {activePage === "dashboard" && (
          <>

            {/* =================================================
                STAT CARDS
            ================================================= */}

<section className="dashboard-grid">
  {dashboardStats.map((item) => {
    return (
      <StatCard
        key={item.title}
        title={item.title}
        value={item.value}
        icon={item.icon}
        type={item.type}
      />
    );
  })}
</section>


            {/* =================================================
                MAP
            ================================================= */}

            <section className="map-placeholder">

              {/* MAP HEADER */}
              <div className="map-header">

                <div className="map-title">

                  <MapPinned
                    size={18}
                    strokeWidth={2}
                  />

                  <h3>
                    Peta Lahan MaizeFit
                  </h3>

                </div>


                <button
                  className="map-see-all"
                  type="button"
                >
                  <MapPinned size={14} />

                  <span>Lihat Semua</span>

                  <ChevronRight size={14} />
                </button>

              </div>


              {/* MAP */}
              <div className="map-container">
                <MapLahan />
              </div>

            </section>

          </>
        )}


        {/* =====================================================
            MASTER DATA
        ===================================================== */}

        {activePage === "master" && (
          <MasterData />
        )}


        {/* USER */}
        {activePage === "user" && (
          <User />
        )}


        {/* ROLE */}
        {activePage === "role" && (
          <Role />
        )}


        {/* KECAMATAN */}
        {activePage === "kecamatan" && (
          <Kecamatan />
        )}


        {/* LAHAN */}
        {activePage === "lahan" && (
          <Lahan />
        )}


        {/* RIWAYAT */}
        {activePage === "riwayat" && (
          <RiwayatPenilaian />
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
