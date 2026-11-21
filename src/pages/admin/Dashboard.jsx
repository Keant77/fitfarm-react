import React from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../components/ui/stat-card";
import MapLahan from "../../components/MapLahan";

import {
  Users,
  Wheat,
  Gauge,
  Target,
  MapPinned,
  ChevronRight,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

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
    <>
      {/* STAT CARDS */}
      <section className="dashboard-grid">
        {dashboardStats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            type={item.type}
          />
        ))}
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="map-placeholder">
        <div className="map-header">
          <div className="map-title">
            <MapPinned size={18} strokeWidth={2} />
            <h3>Peta Lahan MaizeFit</h3>
          </div>

          <button
            className="map-see-all"
            type="button"
            onClick={() => navigate("/admin/lahan")}
          >
            <MapPinned size={14} />
            <span>Lihat Lahan</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="map-container">
          <MapLahan />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
