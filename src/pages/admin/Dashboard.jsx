import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../components/ui/stat-card";
import MapLahan from "../../components/MapLahan";
import {
  userService,
  lahanService,
  kecamatanService,
  indikatorService,
  aturanService,
} from "../../services/api";

import {
  Users,
  Wheat,
  Gauge,
  Target,
  MapPinned,
  ChevronRight,
} from "lucide-react";

const STAT_DEFINITIONS = [
  { key: "users", title: "Jumlah Pengguna", icon: Users, type: "green" },
  { key: "lahan", title: "Jumlah Lahan", icon: Wheat, type: "yellow" },
  {
    key: "kecamatan",
    title: "Jumlah Kecamatan",
    icon: MapPinned,
    type: "green",
  },
  { key: "indikator", title: "Jumlah Indikator", icon: Gauge, type: "green" },
  { key: "aturan", title: "Jumlah Aturan", icon: Target, type: "green" },
];

export function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    users: "—",
    lahan: "—",
    kecamatan: "—",
    indikator: "—",
    aturan: "—",
  });

  useEffect(() => {
    // Fetch semua count secara paralel
    Promise.allSettled([
      userService.getAll(),
      lahanService.getAll(),
      kecamatanService.getAll(),
      indikatorService.getAll(),
      aturanService.getAll(),
    ]).then(([users, lahan, kecamatan, indikator, aturan]) => {
      setCounts({
        users: users.status === "fulfilled" ? String(users.value.length) : "?",
        lahan: lahan.status === "fulfilled" ? String(lahan.value.length) : "?",
        kecamatan:
          kecamatan.status === "fulfilled"
            ? String(kecamatan.value.length)
            : "?",
        indikator:
          indikator.status === "fulfilled"
            ? String(indikator.value.length)
            : "?",
        aturan:
          aturan.status === "fulfilled" ? String(aturan.value.length) : "?",
      });
    });
  }, []);

  return (
    <>
      {/* STAT CARDS */}
      <section className="dashboard-grid">
        {STAT_DEFINITIONS.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={counts[stat.key]}
            icon={stat.icon}
            type={stat.type}
          />
        ))}
      </section>

      {/* MAP */}
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
