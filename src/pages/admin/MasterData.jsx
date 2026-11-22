import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  userService,
  roleService,
  kecamatanService,
  lahanService,
  indikatorService,
  aturanService,
} from "../../services/api";

const CARDS = [
  {
    key: "users",
    title: "Data Pengguna",
    description: "Data pengguna dan hak akses akun terdaftar sistem MaizeFit.",
    path: "/admin/user",
    service: userService,
  },
  {
    key: "roles",
    title: "Data Role",
    description: "Data peran sistem (Admin, Pakar, Petugas, Petani).",
    path: "/admin/role",
    service: roleService,
  },
  {
    key: "kecamatan",
    title: "Data Kecamatan",
    description: "Data wilayah kecamatan pemetaan lahan Kabupaten Jember.",
    path: "/admin/kecamatan",
    service: kecamatanService,
  },
  {
    key: "lahan",
    title: "Data Lahan",
    description: "Data titik koordinat dan luas lahan yang dievaluasi.",
    path: "/admin/lahan",
    service: lahanService,
  },
  {
    key: "indikator",
    title: "Data Indikator",
    description: "Kriteria parameter penilaian kesesuaian lahan jagung.",
    path: "/admin/indikator",
    service: indikatorService,
  },
  {
    key: "aturan",
    title: "Data Aturan",
    description: "Aturan inferensi dan bobot Certainty Factor (CF).",
    path: "/admin/aturan",
    service: aturanService,
  },
];

export function MasterData() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(
    Object.fromEntries(CARDS.map((c) => [c.key, "—"])),
  );

  useEffect(() => {
    Promise.allSettled(CARDS.map((c) => c.service.getAll())).then((results) => {
      const updated = {};
      results.forEach((result, i) => {
        updated[CARDS[i].key] =
          result.status === "fulfilled" ? String(result.value.length) : "?";
      });
      setCounts(updated);
    });
  }, []);

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>MASTER DATA</h1>
          <p>
            Pusat pengelolaan konfigurasi dan data referensi sistem MaizeFit
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="master-grid">
        {CARDS.map((card) => (
          <div className="master-card" key={card.key}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <div className="master-number">{counts[card.key]}</div>
            <button
              className="master-button"
              onClick={() => navigate(card.path)}
            >
              Kelola Data
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasterData;
