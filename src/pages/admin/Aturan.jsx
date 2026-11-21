import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { aturanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Aturan() {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [dataAturan, setDataAturan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNo, setEditNo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    indikator: "",
    kategori: "",
    deskripsi: "",
    cf: 1,
  });

  useEffect(() => {
    aturanService
      .getAll()
      .then((data) => setDataAturan(data))
      .catch((err) => {
        console.error("Gagal load aturan:", err);
        showToast("Gagal memuat data aturan", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredData = dataAturan.filter(
    (item) =>
      item.indikator.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditNo(null);
    setFormData({
      indikator: "",
      kategori: "",
      deskripsi: "",
      cf: 1,
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditNo(item.no);
    setFormData({
      indikator: item.indikator,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      cf: item.cf,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.indikator.trim() || !formData.kategori.trim()) {
      showToast("Indikator dan kategori wajib diisi.", "warning");
      return;
    }

    if (editNo !== null) {
      const updated = {
        no: editNo,
        indikator: formData.indikator,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        cf: Number(formData.cf),
      };
      await aturanService.update(editNo, updated);
      setDataAturan(
        dataAturan.map((item) => (item.no === editNo ? updated : item))
      );
      showToast("Aturan berhasil diperbarui!", "success");
    } else {
      const created = await aturanService.create({
        indikator: formData.indikator,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        cf: Number(formData.cf),
      });
      setDataAturan([...dataAturan, created]);
      showToast("Aturan baru berhasil ditambahkan!", "success");
    }

    setShowForm(false);
    setEditNo(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await aturanService.delete(deleteTarget.no);
      setDataAturan(dataAturan.filter((item) => item.no !== deleteTarget.no));
      showToast(`Aturan #${deleteTarget.no} berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus aturan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA ATURAN</h1>
          <p>Basis pengetahuan dan nilai Certainty Factor (CF) untuk penilaian kelayakan lahan</p>
        </div>

        <button
          className="data-back-button"
          onClick={() => navigate("/admin/master")}
        >
          ← Master Data
        </button>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Aturan Penilaian</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Aturan
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari indikator / kategori / deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>No</th>
                <th style={{ width: "160px" }}>Indikator</th>
                <th style={{ width: "130px" }}>Kategori</th>
                <th>Deskripsi Kriteria</th>
                <th style={{ width: "90px" }}>Nilai CF</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data aturan...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.no}>
                    <td>{index + 1}</td>
                    <td><strong>{item.indikator}</strong></td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor:
                            item.cf >= 1
                              ? "rgba(22, 163, 74, 0.15)"
                              : item.cf >= 0.5
                              ? "rgba(245, 158, 11, 0.15)"
                              : "rgba(220, 38, 38, 0.15)",
                          color:
                            item.cf >= 1
                              ? "#16a34a"
                              : item.cf >= 0.5
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      >
                        {item.kategori}
                      </span>
                    </td>
                    <td>{item.deskripsi}</td>
                    <td><strong>{item.cf}</strong></td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                    Tidak ada data aturan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editNo !== null ? "Edit Aturan" : "Tambah Aturan Baru"}</h3>
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
                <label>Nama Indikator</label>
                <Input
                  type="text"
                  placeholder="Contoh: pH Tanah, Curah Hujan"
                  value={formData.indikator}
                  onChange={(e) =>
                    setFormData({ ...formData, indikator: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-field">
                <label>Kategori</label>
                <Input
                  type="text"
                  placeholder="Contoh: Ideal, Rendah, Sedang, Tinggi"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-field">
                <label>Deskripsi Kriteria</label>
                <Input
                  type="text"
                  placeholder="Deskripsi penilaian kriteria"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-field">
                <label>Nilai Certainty Factor (CF 0 - 1)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="1.0"
                  value={formData.cf}
                  onChange={(e) =>
                    setFormData({ ...formData, cf: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editNo !== null ? "Simpan Perubahan" : "Tambah Aturan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Aturan"
        message={`Apakah Anda yakin ingin menghapus aturan #${deleteTarget?.no} (${deleteTarget?.indikator} - ${deleteTarget?.kategori})?`}
        confirmText="Hapus Aturan"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Aturan;
