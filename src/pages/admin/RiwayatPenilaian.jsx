import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { riwayatService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

export function RiwayatPenilaian() {
  const { showToast } = useNotification();
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    lahan: "",
    tanggal: "",
    skor_kelayakan: "",
    probabilitas: "",
  });

  useEffect(() => {
    riwayatService
      .getAll()
      .then((data) => setDataRiwayat(data))
      .catch((error) => {
        console.error("Gagal mengambil data riwayat:", error);
        showToast("Gagal mengambil data riwayat", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const dataFiltered = dataRiwayat.filter((item) =>
    item.lahan.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTambah = () => {
    setFormData({
      lahan: "",
      tanggal: new Date().toISOString().slice(0, 10),
      skor_kelayakan: "",
      probabilitas: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.lahan.trim() ||
      !formData.tanggal.trim() ||
      !formData.skor_kelayakan ||
      !formData.probabilitas
    ) {
      showToast("Semua data riwayat wajib diisi.", "warning");
      return;
    }

    const newRiwayat = {
      lahan: formData.lahan,
      tanggal: formData.tanggal,
      skor_kelayakan: Number(formData.skor_kelayakan),
      probabilitas: Number(formData.probabilitas),
    };

    try {
      const data = await riwayatService.create(newRiwayat);
      const riwayatBaru = {
        id: data.id || Date.now(),
        lahan: data.lahan || newRiwayat.lahan,
        tanggal: data.tanggal || newRiwayat.tanggal,
        skor_kelayakan: data.skor_kelayakan || newRiwayat.skor_kelayakan,
        probabilitas: data.probabilitas || newRiwayat.probabilitas,
      };

      setDataRiwayat([riwayatBaru, ...dataRiwayat]);
      showToast("Riwayat penilaian berhasil ditambahkan!", "success");
      setShowForm(false);
      setFormData({
        lahan: "",
        tanggal: "",
        skor_kelayakan: "",
        probabilitas: "",
      });
    } catch {
      showToast("Gagal menambahkan riwayat.", "error");
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>RIWAYAT PENILAIAN</h1>
          <p>Riwayat hasil analisis dan evaluasi kelayakan lahan jagung MaizeFit</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Riwayat Penilaian Lahan</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Penilaian
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari nama lahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Nama Lahan</th>
                <th>Tanggal Penilaian</th>
                <th>Skor Kelayakan</th>
                <th>Probabilitas</th>
                <th style={{ width: "120px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat riwayat penilaian...
                  </td>
                </tr>
              ) : dataFiltered.length > 0 ? (
                dataFiltered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><strong>{item.lahan}</strong></td>
                    <td>{item.tanggal}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            item.skor_kelayakan >= 0.75
                              ? "#16a34a"
                              : item.skor_kelayakan >= 0.5
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      >
                        {item.skor_kelayakan}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor:
                            item.probabilitas >= 75
                              ? "rgba(22, 163, 74, 0.12)"
                              : item.probabilitas >= 50
                              ? "rgba(245, 158, 11, 0.12)"
                              : "rgba(220, 38, 38, 0.12)",
                          color:
                            item.probabilitas >= 75
                              ? "#16a34a"
                              : item.probabilitas >= 50
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      >
                        {item.probabilitas}%
                      </span>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedData(item)}
                        >
                          Detail
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                    Tidak ada riwayat penilaian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedData && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Detail Penilaian Lahan</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedData(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-riwayat">
              <div className="detail-item">
                <span>Nama Lahan</span>
                <strong>{selectedData.lahan}</strong>
              </div>
              <div className="detail-item">
                <span>Tanggal Evaluasi</span>
                <strong>{selectedData.tanggal}</strong>
              </div>
              <div className="detail-item">
                <span>Skor Kelayakan</span>
                <strong style={{ color: "var(--primary)" }}>
                  {selectedData.skor_kelayakan}
                </strong>
              </div>
              <div className="detail-item">
                <span>Tingkat Kepastian / Probabilitas</span>
                <strong>{selectedData.probabilitas}%</strong>
              </div>
              <div className="detail-item">
                <span>Status Rekomendasi</span>
                <strong
                  style={{
                    color:
                      selectedData.probabilitas >= 70
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {selectedData.probabilitas >= 70
                    ? "Sangat Layak untuk Budidaya Jagung"
                    : "Perlu Penyesuaian Kriteria Lahan"}
                </strong>
              </div>
            </div>

            <div className="modal-actions">
              <Button type="button" onClick={() => setSelectedData(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH PENILAIAN */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Tambah Riwayat Penilaian</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Lahan</label>
                <Input
                  name="lahan"
                  placeholder="Contoh: Lahan Jagung Sumbersari"
                  value={formData.lahan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Tanggal Penilaian</label>
                <Input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="modal-field">
                  <label>Skor Kelayakan (0 - 1)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    name="skor_kelayakan"
                    placeholder="0.85"
                    value={formData.skor_kelayakan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modal-field">
                  <label>Probabilitas (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    name="probabilitas"
                    placeholder="85"
                    value={formData.probabilitas}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
                <Button type="submit">Simpan Riwayat</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiwayatPenilaian;
