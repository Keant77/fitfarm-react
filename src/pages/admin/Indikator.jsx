import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { indikatorService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Indikator() {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [dataIndikator, setDataIndikator] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ nama: "" });

  useEffect(() => {
    indikatorService
      .getAll()
      .then((data) => setDataIndikator(data))
      .catch((err) => {
        console.error("Gagal load indikator:", err);
        showToast("Gagal memuat indikator", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredData = dataIndikator.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditId(null);
    setFormData({ nama: "" });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ nama: item.nama });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast("Nama indikator wajib diisi.", "warning");
      return;
    }

    if (editId !== null) {
      const updated = { id: editId, nama: formData.nama };
      await indikatorService.update(editId, updated);
      setDataIndikator(
        dataIndikator.map((item) => (item.id === editId ? updated : item))
      );
      showToast("Indikator berhasil diubah!", "success");
    } else {
      const created = await indikatorService.create({ nama: formData.nama });
      setDataIndikator([...dataIndikator, created]);
      showToast("Indikator baru berhasil ditambahkan!", "success");
    }

    setShowForm(false);
    setFormData({ nama: "" });
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await indikatorService.delete(deleteTarget.id);
      setDataIndikator(dataIndikator.filter((i) => i.id !== deleteTarget.id));
      showToast(`Indikator "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus indikator.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA INDIKATOR</h1>
          <p>Kriteria indikator penilaian kelayakan lahan tanaman jagung MaizeFit</p>
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
          <h2>Daftar Indikator Penilaian</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Indikator
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari indikator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>No</th>
                <th>Nama Indikator</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data indikator...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><strong>{item.nama}</strong></td>
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
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
                    Tidak ada data indikator.
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
              <h3>{editId !== null ? "Edit Indikator" : "Tambah Indikator Baru"}</h3>
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
                  value={formData.nama}
                  onChange={(e) => setFormData({ nama: e.target.value })}
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
                  {editId !== null ? "Simpan Perubahan" : "Tambah Indikator"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Indikator"
        message={`Apakah Anda yakin ingin menghapus indikator "${deleteTarget?.nama}"?`}
        confirmText="Hapus Indikator"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Indikator;
