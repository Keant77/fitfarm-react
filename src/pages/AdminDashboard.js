import { useState } from "react";

import MapLahan from "../components/MapLahan";
import MasterData from "./MasterData";
import User from "./User";
import Role from "./Role";
import Kecamatan from "./kecamatan";
import Lahan from "./Lahan";
import RiwayatPenilaian from "./RiwayatPenilaian";

import { Card, CardContent } from "../components/ui/card";

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
  UserRound,
  ShieldCheck,
  MapPinned,
  Menu,
  X,
} from "lucide-react";


function AdminDashboard({ onLogout }) {
  const [masterOpen, setMasterOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMasterMenu = (menu) => {
    setActivePage(menu);
    setSidebarOpen(false);
  };


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
          sidebarOpen ? "mobile-open" : ""
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
            onClick={() => {
              setActivePage("dashboard");
              setSidebarOpen(false);
            }}
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
                className={`master-submenu-item ${
                  activePage === "user" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("user")}
              >
                <span className="submenu-line">−</span>
                <UserRound size={15} />
                <span>Pengguna</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "role" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("role")}
              >
                <span className="submenu-line">−</span>
                <ShieldCheck size={15} />
                <span>Role</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "kecamatan" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("kecamatan")}
              >
                <span className="submenu-line">−</span>
                <MapPinned size={15} />
                <span>Kecamatan</span>
              </button>


              <button
                className={`master-submenu-item ${
                  activePage === "lahan" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("lahan")}
              >
                <span className="submenu-line">−</span>
                <MapPinned size={15} />
                <span>Lahan</span>
              </button>

            </div>
          )}


          {/* RIWAYAT */}
          <button
            className={`sidebar-item ${
              activePage === "riwayat" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("riwayat");
              setSidebarOpen(false);
            }}
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-content">

        {/* MOBILE MENU */}
        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activePage === "dashboard" && (
          <>

            {/* HEADER */}
            <header className="admin-header">

              <div className="admin-header-left">
                <h2>DASHBOARD ADMIN</h2>

                <p>
                  Selamat datang di sistem MaizeFit
                </p>
              </div>


              {/* HEADER RIGHT */}
              <div className="admin-header-right">

                {/* NOTIFICATION */}
                <button
                  className="notification-button"
                  aria-label="Notifikasi"
                >
                  <Bell size={19} />
                  <span className="notification-dot" />
                </button>


                {/* PROFILE + DROPDOWN */}
<div className="admin-profile-wrapper">

  <button
    className="admin-profile"
    type="button"
    onClick={() =>
      setProfileOpen(!profileOpen)
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

  </button>

  {profileOpen && (
    <div className="admin-profile-dropdown">

      <button
        type="button"
        className="profile-dropdown-item"
        onClick={() => {
          setProfileOpen(false);
          onLogout();
        }}
      >
        <LogOut size={17} />
        <span>Logout</span>
      </button>

    </div>
  )}

</div>

              </div>

            </header>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="dashboard-grid">

              {dashboardStats.map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className={`dashboard-card dashboard-card-${item.type}`}
                  >

                    <CardContent className="dashboard-card-content">

                      {/* ICON */}
                      <div className="dashboard-card-icon">
                        <Icon size={24} strokeWidth={2} />
                      </div>


                      {/* INFO */}
                      <div className="dashboard-card-info">

                        <div className="dashboard-card-title">
                          {item.title}
                        </div>

                        <div className="dashboard-number">
                          {item.value}
                        </div>

                      </div>


                      {/* SMALL ARROW */}
                      <button
                        className="dashboard-card-arrow"
                        aria-label={`Detail ${item.title}`}
                      >
                        <ChevronRight size={14} />
                      </button>

                    </CardContent>

                  </Card>
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