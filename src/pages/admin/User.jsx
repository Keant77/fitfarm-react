import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { userService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const EMPTY_FORM = { nama: "", username: "", role_id: "" };

function validateField(name, value) {
  if (name === "nama") {
    if (!value.trim()) return "Nama wajib diisi.";
    if (value.trim().length < 3) return "Nama minimal 3 karakter.";
  }
  if (name === "username") {
    if (!value.trim()) return "Username wajib diisi.";
    if (value.trim().length < 3) return "Username minimal 3 karakter.";
  }
  if (name === "role_id") {
    if (!value) return "Role wajib dipilih.";
  }
  return "";
}

function validateAll(formData) {
  const errors = {};
  for (const key of Object.keys(formData)) {
    const err = validateField(key, formData[key]);
    if (err) errors[key] = err;
  }
  return errors;
}

export function User() {
  const { showToast } = useNotification();
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    userService
      .getAll()
      .then(setDataUser)
      .catch(() => showToast("Gagal mengambil data pengguna", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = dataUser.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      String(u.role_id).includes(search),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const openCreate = () => {
    setEditId(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditId(user.id);
    setFormData({
      nama: user.nama,
      username: user.username,
      role_id: String(user.role_id),
    });
    setErrors({});
    setTouched({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(EMPTY_FORM).map((k) => [k, true]),
    );
    setTouched(allTouched);
    const errs = validateAll(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      nama: formData.nama,
      username: formData.username,
      role_id: Number(formData.role_id),
    };

    try {
      if (editId !== null) {
        await userService.update(editId, payload);
        setDataUser((prev) =>
          prev.map((u) => (u.id === editId ? { id: editId, ...payload } : u)),
        );
        showToast("Pengguna berhasil diperbarui!", "success");
      } else {
        const created = await userService.create(payload);
        setDataUser((prev) => [...prev, created]);
        showToast("Pengguna baru berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan pengguna.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.delete(deleteTarget.id);
      setDataUser((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showToast(`Pengguna "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus pengguna.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        {/* Toolbar */}
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Pengguna</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari nama / username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="data-add-button" onClick={openCreate}>
              + Tambah
            </Button>
          </div>
        </div>

        {/* Tabel */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>ID</th>
                <th>Nama Lengkap</th>
                <th>Username</th>
                <th style={{ width: 140 }}>Role</th>
                <th style={{ width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="data-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <strong>{user.nama}</strong>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <span className="badge badge-primary">
                        Role {user.role_id}
                      </span>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(user)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="data-empty">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId !== null ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-field">
                <label>Nama Lengkap</label>
                <Input
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                />
                {touched.nama && errors.nama && (
                  <span className="form-error">{errors.nama}</span>
                )}
              </div>
              <div className="modal-field">
                <label>Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                />
                {touched.username && errors.username && (
                  <span className="form-error">{errors.username}</span>
                )}
              </div>
              <div className="modal-field">
                <label>Peran / Role</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="modal-select"
                >
                  <option value="">Pilih Role</option>
                  <option value="1">1 — Administrator</option>
                  <option value="2">2 — Pakar Pertanian</option>
                  <option value="3">3 — Petugas Lapangan</option>
                  <option value="4">4 — Petani</option>
                </select>
                {touched.role_id && errors.role_id && (
                  <span className="form-error">{errors.role_id}</span>
                )}
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
        title="Hapus Pengguna"
        message={`Hapus pengguna "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default User;
