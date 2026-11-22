import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { kecamatanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Kecamatan() {
  const { showToast } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ nama: "" });

  useEffect(() => {
    kecamatanService
      .getAll()
      .then(setData)
      .catch(() => showToast("Gagal mengambil data kecamatan", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = data.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      String(k.id).includes(search),
  );

  const openCreate = () => {
    setEditId(null);
    setFormData({ nama: "" });
    setShowForm(true);
  };
  const openEdit = (k) => {
    setEditId(k.id);
    setFormData({ nama: k.nama });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setFormData({ nama: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast("Nama kecamatan wajib diisi.", "warning");
      return;
    }

    try {
      if (editId !== null) {
        const updated = { id: editId, nama: formData.nama };
        await kecamatanService.update(editId, updated);
        setData((prev) => prev.map((k) => (k.id === editId ? updated : k)));
        showToast("Kecamatan berhasil diubah!", "success");
      } else {
        const created = await kecamatanService.create({ nama: formData.nama });
        setData((prev) => [...prev, created]);
        showToast("Kecamatan berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan kecamatan.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await kecamatanService.delete(deleteTarget.id);
      setData((prev) => prev.filter((k) => k.id !== deleteTarget.id));
      showToast(
        `Kecamatan "${deleteTarget.nama}" berhasil dihapus!`,
        "success",
      );
    } catch {
      showToast("Gagal menghapus kecamatan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Kecamatan</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari kecamatan..."
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
                <th style={{ width: 56 }}>ID</th>
                <th>Nama Kecamatan</th>
                <th style={{ width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="data-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((kec) => (
                  <tr key={kec.id}>
                    <td>{kec.id}</td>
                    <td>
                      <strong>{kec.nama}</strong>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEdit(kec)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(kec)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="data-empty">
                    Tidak ada data kecamatan.
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
              <h3>{editId !== null ? "Edit Kecamatan" : "Tambah Kecamatan"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Kecamatan</label>
                <Input
                  placeholder="Contoh: Sumbersari, Kaliwates"
                  value={formData.nama}
                  onChange={(e) => setFormData({ nama: e.target.value })}
                  required
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
        title="Hapus Kecamatan"
        message={`Hapus kecamatan "${deleteTarget?.nama}"?`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Kecamatan;
