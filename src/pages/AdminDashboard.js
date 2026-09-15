import { useState } from "react";
import MapLahan from "../components/MapLahan";
import MasterData from "./MasterData";
import User from "./User";
import Role from "./Role";
import Kecamatan from "./kecamatan";
import Lahan from "./Lahan";
import RiwayatPenilaian from "./RiwayatPenilaian";
import { StatCard } from "../components/ui/stat-card";

function AdminDashboard({ onLogout }) {
  const [masterOpen, setMasterOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  const handleMasterMenu = (menu) => {
    setActivePage(menu);
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">
          FITFARM
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">

          {/* DASHBOARD */}
          <button
            className={`sidebar-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          {/* MASTER DATA */}
          <button
            className="sidebar-item master-menu-toggle"
            onClick={() => setMasterOpen(!masterOpen)}
          >
            <span>Master Data</span>

            <span
              className={`master-arrow ${
                masterOpen ? "open" : ""
              }`}
            >
              ˅
            </span>
          </button>

          {/* SUB MENU MASTER DATA */}
          {masterOpen && (
            <div className="master-submenu">

              <button
                className={`master-submenu-item ${
                  activePage === "user" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("user")}
              >
                <span>−</span>
                Pengguna
              </button>

              <button
                className={`master-submenu-item ${
                  activePage === "role" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("role")}
              >
                <span>−</span>
                Role
              </button>

              <button
                className={`master-submenu-item ${
                  activePage === "kecamatan" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("kecamatan")}
              >
                <span>−</span>
                Kecamatan
              </button>

              <button
                className={`master-submenu-item ${
                  activePage === "lahan" ? "active" : ""
                }`}
                onClick={() => handleMasterMenu("lahan")}
              >
                <span>−</span>
                Lahan
              </button>

            </div>
          )}

          {/* RIWAYAT */}
          <button
            className="sidebar-item"
            onClick={() => setActivePage("riwayat")}
          >
            Riwayat Penilaian
          </button>

        </nav>

        {/* LOGOUT */}
        <button
          className="sidebar-logout"
          onClick={onLogout}
        >
          Logout
        </button>

      </aside>

      {/* KONTEN KANAN */}
      <main className="admin-content">

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <>
            <header className="admin-header">
              <div>
                <h2>DASHBOARD ADMIN</h2>
                <p>
                  Selamat datang di sistem FitFarm
                </p>
              </div>

              <div className="admin-profile">
                <div className="profile-icon">
                  A
                </div>

                <div>
                  <strong>Admin</strong>
                  <span>Administrator</span>
                </div>
              </div>
            </header>

            <section className="dashboard-grid">

             <StatCard
                title="Jumlah Pengguna"
               value="1"
              />

             <StatCard
               title="Jumlah Lahan"
                value="10"
              />

             <StatCard
                title="Jumlah Kecamatan"
               value="31"
             />

             <StatCard
               title="Jumlah Indikator"
                value="5"
              />

              <StatCard
                title="Jumlah Aturan"
                value="15"
              />

            </section>

            <div className="map-placeholder">
              <h3>Peta Lahan FitFarm</h3>
              <MapLahan />
            </div>
          </>
        )}

        {/* MASTER DATA - DEFAULT */}
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