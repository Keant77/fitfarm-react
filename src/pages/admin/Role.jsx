import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { roleService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Role() {
  const { showToast } = useNotification();
  const [dataRole, setDataRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    roleService
      .getAll()
      .then(setDataRole)
      .catch(() => showToast("Gagal mengambil data role", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = dataRole.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search),
  );

  const openCreate = () => {
    setEditId(null);
    setFormData({ name: "" });
    setShowForm(true);
  };
  const openEdit = (r) => {
    setEditId(r.id);
    setFormData({ name: r.name });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setFormData({ name: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama role wajib diisi.", "warning");
      return;
    }

    try {
      if (editId !== null) {
        const updated = { id: editId, name: formData.name };
        await roleService.update(editId, updated);
        setDataRole((prev) => prev.map((r) => (r.id === editId ? updated : r)));
        showToast("Role berhasil diubah!", "success");
      } else {
        const created = await roleService.create({ name: formData.name });
        setDataRole((prev) => [...prev, created]);
        showToast("Role baru berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan role.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await roleService.delete(deleteTarget.id);
      setDataRole((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast(`Role "${deleteTarget.name}" berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus role.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Role</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari role..."
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
                <th>Nama Role</th>
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
                filtered.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>
                      <strong>{role.name}</strong>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEdit(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(role)}
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
                    Tidak ada data role.
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
              <h3>{editId !== null ? "Edit Role" : "Tambah Role"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Role</label>
                <Input
                  placeholder="Contoh: Administrator, Petugas Lapangan"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
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
        title="Hapus Role"
        message={`Hapus role "${deleteTarget?.name}"?`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Role;
