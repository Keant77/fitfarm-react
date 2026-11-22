import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { lahanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const EMPTY_FORM = {
  nama: "",
  latitude: "",
  longitude: "",
  pengguna: "",
  alamat: "",
};

export function Lahan() {
  const { showToast } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    lahanService
      .getAll()
      .then(setData)
      .catch(() => showToast("Gagal mengambil data lahan", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = data.filter(
    (l) =>
      l.nama.toLowerCase().includes(search.toLowerCase()) ||
      l.pengguna.toLowerCase().includes(search.toLowerCase()) ||
      l.alamat.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreate = () => {
    setEditId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (l) => {
    setEditId(l.id);
    setFormData({
      nama: l.nama,
      latitude: l.latitude,
      longitude: l.longitude,
      pengguna: l.pengguna,
      alamat: l.alamat,
    });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.latitude || !formData.longitude) {
      showToast("Nama, latitude, dan longitude wajib diisi.", "warning");
      return;
    }

    const payload = {
      nama: formData.nama,
      latitude: formData.latitude,
      longitude: formData.longitude,
      pengguna: formData.pengguna,
      alamat: formData.alamat,
    };

    try {
      if (editId !== null) {
        await lahanService.update(editId, payload);
        setData((prev) =>
          prev.map((l) => (l.id === editId ? { id: editId, ...payload } : l)),
        );
        showToast("Data lahan berhasil diperbarui!", "success");
      } else {
        const created = await lahanService.create(payload);
        setData((prev) => [...prev, created]);
        showToast("Lahan baru berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan data lahan.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await lahanService.delete(deleteTarget.id);
      setData((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      showToast(`Lahan "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus lahan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Lahan</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari lahan / pemilik / alamat..."
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
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Pengguna</th>
                <th>Alamat</th>
                <th style={{ width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="data-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>
                      <strong>{l.nama}</strong>
                    </td>
                    <td>{l.latitude}</td>
                    <td>{l.longitude}</td>
                    <td>{l.pengguna}</td>
                    <td>{l.alamat}</td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEdit(l)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(l)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="data-empty">
                    Tidak ada data lahan.
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
              <h3>{editId !== null ? "Edit Lahan" : "Tambah Lahan"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Lahan</label>
                <Input
                  name="nama"
                  placeholder="Contoh: Lahan Jagung Sumbersari A"
                  value={formData.nama}
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
                  <label>Latitude</label>
                  <Input
                    name="latitude"
                    placeholder="-8.155500"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="modal-field">
                  <label>Longitude</label>
                  <Input
                    name="longitude"
                    placeholder="113.722200"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-field">
                <label>Pemilik / Pengguna</label>
                <Input
                  name="pengguna"
                  placeholder="Username pemilik lahan"
                  value={formData.pengguna}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-field">
                <label>Alamat</label>
                <Input
                  name="alamat"
                  placeholder="Alamat lengkap lahan"
                  value={formData.alamat}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editId !== null ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Lahan"
        message={`Hapus lahan "${deleteTarget?.nama}"? Data koordinat dan riwayat terkait akan terhapus.`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Lahan;
