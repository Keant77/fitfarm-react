import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { lahanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Lahan() {
  const { showToast } = useNotification();
  const [dataLahan, setDataLahan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    latitude: "",
    longitude: "",
    pengguna: "",
    alamat: "",
  });

  useEffect(() => {
    lahanService
      .getAll()
      .then((data) => setDataLahan(data))
      .catch((error) => {
        console.error("Gagal mengambil data lahan:", error);
        showToast("Gagal mengambil data lahan", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredDataLahan = dataLahan.filter(
    (lahan) =>
      lahan.nama.toLowerCase().includes(search.toLowerCase()) ||
      lahan.pengguna.toLowerCase().includes(search.toLowerCase()) ||
      lahan.alamat.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTambah = () => {
    setEditId(null);
    setFormData({
      nama: "",
      latitude: "",
      longitude: "",
      pengguna: "",
      alamat: "",
    });
    setShowForm(true);
  };

  const handleEdit = (lahan) => {
    setEditId(lahan.id);
    setFormData({
      nama: lahan.nama,
      latitude: lahan.latitude,
      longitude: lahan.longitude,
      pengguna: lahan.pengguna,
      alamat: lahan.alamat,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.latitude || !formData.longitude) {
      showToast("Nama lahan, latitude, dan longitude wajib diisi.", "warning");
      return;
    }

    if (editId !== null) {
      const updatedLahan = {
        id: editId,
        nama: formData.nama,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pengguna: formData.pengguna,
        alamat: formData.alamat,
      };

      try {
        await lahanService.update(editId, updatedLahan);
        setDataLahan(
          dataLahan.map((lahan) => (lahan.id === editId ? updatedLahan : lahan))
        );
        showToast("Data lahan berhasil diperbarui!", "success");
      } catch (error) {
        showToast("Gagal memperbarui data lahan.", "error");
        return;
      }
    } else {
      const newLahan = {
        nama: formData.nama,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pengguna: formData.pengguna,
        alamat: formData.alamat,
      };

      try {
        const data = await lahanService.create(newLahan);
        const lahanBaru = {
          id: data.id || Date.now(),
          nama: data.nama || newLahan.nama,
          latitude: data.latitude || newLahan.latitude,
          longitude: data.longitude || newLahan.longitude,
          pengguna: data.pengguna || newLahan.pengguna,
          alamat: data.alamat || newLahan.alamat,
        };
        setDataLahan([...dataLahan, lahanBaru]);
        showToast("Lahan baru berhasil ditambahkan!", "success");
      } catch (error) {
        showToast("Gagal menambahkan lahan.", "error");
        return;
      }
    }

    setShowForm(false);
    setFormData({
      nama: "",
      latitude: "",
      longitude: "",
      pengguna: "",
      alamat: "",
    });
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await lahanService.delete(deleteTarget.id);
      setDataLahan(dataLahan.filter((item) => item.id !== deleteTarget.id));
      showToast(`Lahan "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch (error) {
      showToast("Gagal menghapus lahan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA LAHAN</h1>
          <p>Kelola data titik dan informasi lahan jagung dalam sistem MaizeFit</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Lahan Pertanian</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Lahan
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari lahan / pemilik / alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Nama Lahan</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Pengguna</th>
                <th>Alamat</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data lahan...
                  </td>
                </tr>
              ) : filteredDataLahan.length > 0 ? (
                filteredDataLahan.map((lahan) => (
                  <tr key={lahan.id}>
                    <td>{lahan.id}</td>
                    <td><strong>{lahan.nama}</strong></td>
                    <td>{lahan.latitude}</td>
                    <td>{lahan.longitude}</td>
                    <td>{lahan.pengguna}</td>
                    <td>{lahan.alamat}</td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(lahan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(lahan)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
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
              <h3>{editId !== null ? "Edit Lahan" : "Tambah Lahan Baru"}</h3>
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
                  name="nama"
                  placeholder="Contoh: Lahan Jagung Sumbersari A"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                  required
                />
              </div>

              <div className="modal-field">
                <label>Alamat / Lokasi Lahan</label>
                <Input
                  name="alamat"
                  placeholder="Alamat lengkap lahan"
                  value={formData.alamat}
                  onChange={handleChange}
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
                  {editId !== null ? "Simpan Perubahan" : "Tambah Lahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Lahan"
        message={`Apakah Anda yakin ingin menghapus lahan "${deleteTarget?.nama}"? Data koordinat dan riwayat terkait akan terhapus.`}
        confirmText="Hapus Lahan"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Lahan;
