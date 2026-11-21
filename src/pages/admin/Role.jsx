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
      .then((data) => setDataRole(data))
      .catch((error) => {
        console.error("Gagal mengambil data role:", error);
        showToast("Gagal mengambil data role", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredDataRole = dataRole.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      String(role.id).includes(search)
  );

  const handleTambah = () => {
    setEditId(null);
    setFormData({ name: "" });
    setShowForm(true);
  };

  const handleEdit = (role) => {
    setEditId(role.id);
    setFormData({ name: role.name });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama role wajib diisi.", "warning");
      return;
    }

    if (editId !== null) {
      const updatedRole = { id: editId, name: formData.name };
      try {
        await roleService.update(editId, updatedRole);
        setDataRole(
          dataRole.map((role) => (role.id === editId ? updatedRole : role))
        );
        showToast("Role berhasil diubah!", "success");
      } catch (error) {
        showToast("Gagal mengubah role.", "error");
        return;
      }
    } else {
      const newRole = { name: formData.name };
      try {
        const data = await roleService.create(newRole);
        const roleBaru = {
          id: data.id || Date.now(),
          name: data.name || newRole.name,
        };
        setDataRole([...dataRole, roleBaru]);
        showToast("Role baru berhasil ditambahkan!", "success");
      } catch (error) {
        showToast("Gagal menambahkan role.", "error");
        return;
      }
    }

    setShowForm(false);
    setFormData({ name: "" });
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await roleService.delete(deleteTarget.id);
      setDataRole(dataRole.filter((item) => item.id !== deleteTarget.id));
      showToast(`Role "${deleteTarget.name}" berhasil dihapus!`, "success");
    } catch (error) {
      showToast("Gagal menghapus role.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA ROLE</h1>
          <p>Kelola peran dan hak akses pengguna sistem MaizeFit</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Role</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Role
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Nama Role</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data role...
                  </td>
                </tr>
              ) : filteredDataRole.length > 0 ? (
                filteredDataRole.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td><strong>{role.name}</strong></td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(role)}
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
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
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
              <h3>{editId !== null ? "Edit Role" : "Tambah Role Baru"}</h3>
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
                <label>Nama Role</label>
                <Input
                  type="text"
                  placeholder="Contoh: Administrator, Petugas Lapangan"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
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
                  {editId !== null ? "Simpan Perubahan" : "Tambah Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Role"
        message={`Apakah Anda yakin ingin menghapus role "${deleteTarget?.name}"?`}
        confirmText="Hapus Role"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Role;
