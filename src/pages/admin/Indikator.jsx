import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { indikatorService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Indikator() {
  const { showToast } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ nama: "" });

  useEffect(() => {
    indikatorService
      .getAll()
      .then(setData)
      .catch(() => showToast("Gagal memuat indikator", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditId(null);
    setFormData({ nama: "" });
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditId(item.id);
    setFormData({ nama: item.nama });
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
      showToast("Nama indikator wajib diisi.", "warning");
      return;
    }

    try {
      if (editId !== null) {
        const updated = { id: editId, nama: formData.nama };
        await indikatorService.update(editId, updated);
        setData((prev) =>
          prev.map((item) => (item.id === editId ? updated : item)),
        );
        showToast("Indikator berhasil diubah!", "success");
      } else {
        const created = await indikatorService.create({ nama: formData.nama });
        setData((prev) => [...prev, created]);
        showToast("Indikator berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan indikator.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await indikatorService.delete(deleteTarget.id);
      setData((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast(
        `Indikator "${deleteTarget.nama}" berhasil dihapus!`,
        "success",
      );
    } catch {
      showToast("Gagal menghapus indikator.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Indikator</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari indikator..."
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
                <th style={{ width: 56 }}>No</th>
                <th>Nama Indikator</th>
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
                filtered.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.nama}</strong>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEdit(item)}
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
                  <td colSpan="3" className="data-empty">
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
              <h3>{editId !== null ? "Edit Indikator" : "Tambah Indikator"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Indikator</label>
                <Input
                  placeholder="Contoh: pH Tanah, Curah Hujan"
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
        title="Hapus Indikator"
        message={`Hapus indikator "${deleteTarget?.nama}"?`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Indikator;
