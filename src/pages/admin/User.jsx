import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { userService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function User() {
  const { showToast } = useNotification();
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    role_id: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Dialog konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    userService
      .getAll()
      .then((data) => setDataUser(data))
      .catch((error) => {
        console.error("Gagal mengambil data user:", error);
        showToast("Gagal mengambil data pengguna", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredDataUser = dataUser.filter(
    (user) =>
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      String(user.role_id).includes(search)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "nama") {
      if (!value.trim()) error = "Nama wajib diisi.";
      else if (value.trim().length < 3) error = "Nama minimal 3 karakter.";
    }
    if (name === "username") {
      if (!value.trim()) error = "Username wajib diisi.";
      else if (value.trim().length < 3) error = "Username minimal 3 karakter.";
    }
    if (name === "password") {
      if (editId === null && !value) error = "Password wajib diisi.";
      else if (value && value.length < 6) error = "Password minimal 6 karakter.";
    }
    if (name === "role_id") {
      if (!value) error = "Role wajib dipilih.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const namaError = validateField("nama", formData.nama);
    const usernameError = validateField("username", formData.username);
    const passwordError = validateField("password", formData.password);
    const roleError = validateField("role_id", formData.role_id);

    if (namaError) newErrors.nama = namaError;
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;
    if (roleError) newErrors.role_id = roleError;

    setTouched({ nama: true, username: true, password: true, role_id: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleTambah = () => {
    setEditId(null);
    setFormData({ nama: "", username: "", password: "", role_id: "" });
    setErrors({});
    setTouched({});
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({
      nama: user.nama,
      username: user.username,
      password: "",
      role_id: String(user.role_id),
    });
    setErrors({});
    setTouched({});
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId !== null) {
      const updatedUser = {
        id: editId,
        nama: formData.nama,
        username: formData.username,
        password: formData.password,
        role_id: Number(formData.role_id),
      };

      try {
        await userService.update(editId, updatedUser);
        setDataUser(
          dataUser.map((user) => (user.id === editId ? updatedUser : user))
        );
        showToast("Pengguna berhasil diperbarui!", "success");
      } catch (error) {
        showToast("Gagal memperbarui pengguna.", "error");
        return;
      }
    } else {
      const newUser = {
        nama: formData.nama,
        username: formData.username,
        password: formData.password,
        role_id: Number(formData.role_id),
      };

      try {
        const data = await userService.create(newUser);
        const userBaru = {
          id: data.id || Date.now(),
          nama: data.nama || newUser.nama,
          username: data.username || newUser.username,
          password: data.password || newUser.password,
          role_id: data.role_id || newUser.role_id,
        };
        setDataUser([...dataUser, userBaru]);
        showToast("Pengguna baru berhasil ditambahkan!", "success");
      } catch (error) {
        showToast("Gagal menambahkan pengguna.", "error");
        return;
      }
    }

    setShowForm(false);
    setFormData({ nama: "", username: "", password: "", role_id: "" });
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.delete(deleteTarget.id);
      setDataUser(dataUser.filter((item) => item.id !== deleteTarget.id));
      showToast(`Pengguna "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch (error) {
      showToast("Gagal menghapus pengguna.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA PENGGUNA</h1>
          <p>Kelola data akun pengguna sistem MaizeFit</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Pengguna</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Pengguna
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari nama / username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Nama Lengkap</th>
                <th>Username</th>
                <th style={{ width: "120px" }}>Role ID</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredDataUser.length > 0 ? (
                filteredDataUser.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><strong>{user.nama}</strong></td>
                    <td>{user.username}</td>
                    <td>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: "rgba(15, 109, 58, 0.12)",
                          color: "var(--primary)",
                        }}
                      >
                        Role {user.role_id}
                      </span>
                    </td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(user)}
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
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                    Tidak ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL USER FORM */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId !== null ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
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
                {errors.nama && <span className="form-error">{errors.nama}</span>}
              </div>

              <div className="modal-field">
                <label>Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              <div className="modal-field">
                <label>Password {editId !== null && "(Kosongkan jika tidak diubah)"}</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="modal-field">
                <label>Peran / Role</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Pilih Role</option>
                  <option value="1">1 - Administrator</option>
                  <option value="2">2 - Pakar Pertanian</option>
                  <option value="3">3 - Petugas Lapangan</option>
                  <option value="4">4 - Petani</option>
                </select>
                {errors.role_id && <span className="form-error">{errors.role_id}</span>}
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
                  {editId !== null ? "Simpan Perubahan" : "Tambah Pengguna"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus pengguna "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Pengguna"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default User;
