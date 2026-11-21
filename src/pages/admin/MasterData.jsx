import React from "react";
import { useNavigate } from "react-router-dom";

export function MasterData() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Data Pengguna",
      description: "Data pengguna dan hak akses akun terdaftar sistem MaizeFit.",
      count: "1",
      path: "/admin/user",
    },
    {
      title: "Data Role",
      description: "Data peran sistem (Admin, Pakar, Petugas, Petani).",
      count: "4",
      path: "/admin/role",
    },
    {
      title: "Data Kecamatan",
      description: "Data wilayah kecamatan pemetaan lahan Kabupaten Jember.",
      count: "31",
      path: "/admin/kecamatan",
    },
    {
      title: "Data Lahan",
      description: "Data titik koordinat dan luas lahan yang dievaluasi.",
      count: "10",
      path: "/admin/lahan",
    },
    {
      title: "Data Indikator",
      description: "Kriteria parameter penilaian kesesuaian lahan jagung.",
      count: "5",
      path: "/admin/indikator",
    },
    {
      title: "Data Aturan",
      description: "Aturan inferensi dan bobot Certainty Factor (CF).",
      count: "15",
      path: "/admin/aturan",
    },
  ];

  return (
    <div className="master-page">
      <div className="master-header">
        <div>
          <h1>MASTER DATA</h1>
          <p>Pusat pengelolaan konfigurasi dan data referensi sistem MaizeFit</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="master-grid">
        {cards.map((card) => (
          <div className="master-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <div className="master-number">{card.count}</div>
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
