import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { riwayatService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

const EMPTY_FORM = {
  lahan: "",
  tanggal: "",
  skor_kelayakan: "",
  probabilitas: "",
};

function skorClass(skor) {
  if (skor >= 0.75) return "skor-tinggi";
  if (skor >= 0.5) return "skor-sedang";
  return "skor-rendah";
}

function probBadgeClass(prob) {
  if (prob >= 75) return "badge badge-green";
  if (prob >= 50) return "badge badge-yellow";
  return "badge badge-red";
}

export function RiwayatPenilaian() {
  const { showToast } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    riwayatService
      .getAll()
      .then(setData)
      .catch(() => showToast("Gagal mengambil data riwayat", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = data.filter((item) =>
    item.lahan.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreate = () => {
    setFormData({
      ...EMPTY_FORM,
      tanggal: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.lahan.trim() ||
      !formData.tanggal ||
      !formData.skor_kelayakan ||
      !formData.probabilitas
    ) {
      showToast("Semua field wajib diisi.", "warning");
      return;
    }

    try {
      const created = await riwayatService.create({
        lahan: formData.lahan,
        tanggal: formData.tanggal,
        skor_kelayakan: Number(formData.skor_kelayakan),
        probabilitas: Number(formData.probabilitas),
      });
      setData((prev) => [created, ...prev]);
      showToast("Riwayat penilaian berhasil ditambahkan!", "success");
      setShowForm(false);
      setFormData(EMPTY_FORM);
    } catch {
      showToast("Gagal menambahkan riwayat.", "error");
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Riwayat Penilaian</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari nama lahan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="data-add-button" onClick={openCreate}>
              + Tambah
            </Button>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>ID</th>
                <th>Nama Lahan</th>
                <th style={{ width: 140 }}>Tanggal</th>
                <th style={{ width: 120 }}>Skor</th>
                <th style={{ width: 120 }}>Probabilitas</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="data-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.lahan}</strong>
                    </td>
                    <td>{item.tanggal}</td>
                    <td>
                      <span className={skorClass(item.skor_kelayakan)}>
                        {item.skor_kelayakan}
                      </span>
                    </td>
                    <td>
                      <span className={probBadgeClass(item.probabilitas)}>
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
                  <td colSpan="6" className="data-empty">
                    Tidak ada riwayat penilaian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedData && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Detail Penilaian</h3>
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
                <strong className={skorClass(selectedData.skor_kelayakan)}>
                  {selectedData.skor_kelayakan}
                </strong>
              </div>
              <div className="detail-item">
                <span>Probabilitas</span>
                <strong>{selectedData.probabilitas}%</strong>
              </div>
              <div className="detail-item">
                <span>Status Rekomendasi</span>
                <strong
                  className={
                    selectedData.probabilitas >= 70
                      ? "skor-tinggi"
                      : "skor-rendah"
                  }
                >
                  {selectedData.probabilitas >= 70
                    ? "Sangat Layak untuk Budidaya Jagung"
                    : "Perlu Penyesuaian Kriteria Lahan"}
                </strong>
              </div>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setSelectedData(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah */}
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="modal-field">
                  <label>Skor Kelayakan (0 – 1)</label>
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
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiwayatPenilaian;
