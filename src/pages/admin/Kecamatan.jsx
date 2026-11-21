import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { kecamatanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export function Kecamatan() {
  const { showToast } = useNotification();
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({ nama: "" });

  useEffect(() => {
    kecamatanService
      .getAll()
      .then((data) => setDataKecamatan(data))
      .catch((error) => {
        console.error("Gagal mengambil data kecamatan:", error);
        showToast("Gagal mengambil data kecamatan", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredDataKecamatan = dataKecamatan.filter(
    (kecamatan) =>
      kecamatan.nama.toLowerCase().includes(search.toLowerCase()) ||
      String(kecamatan.id).includes(search)
  );

  const handleTambah = () => {
    setEditId(null);
    setFormData({ nama: "" });
    setShowForm(true);
  };

  const handleEdit = (kecamatan) => {
    setEditId(kecamatan.id);
    setFormData({ nama: kecamatan.nama });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast("Nama kecamatan wajib diisi.", "warning");
      return;
    }

    if (editId !== null) {
      const updatedKecamatan = { id: editId, nama: formData.nama };
      try {
        await kecamatanService.update(editId, updatedKecamatan);
        setDataKecamatan(
          dataKecamatan.map((k) => (k.id === editId ? updatedKecamatan : k))
        );
        showToast("Kecamatan berhasil diubah!", "success");
      } catch (error) {
        showToast("Gagal mengubah kecamatan.", "error");
        return;
      }
    } else {
      const newKecamatan = { nama: formData.nama };
      try {
        const data = await kecamatanService.create(newKecamatan);
        const kecamatanBaru = {
          id: data.id || Date.now(),
          nama: data.nama || newKecamatan.nama,
        };
        setDataKecamatan([...dataKecamatan, kecamatanBaru]);
        showToast("Kecamatan baru berhasil ditambahkan!", "success");
      } catch (error) {
        showToast("Gagal menambahkan kecamatan.", "error");
        return;
      }
    }

    setShowForm(false);
    setFormData({ nama: "" });
    setEditId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await kecamatanService.delete(deleteTarget.id);
      setDataKecamatan(dataKecamatan.filter((item) => item.id !== deleteTarget.id));
      showToast(`Kecamatan "${deleteTarget.nama}" berhasil dihapus!`, "success");
    } catch (error) {
      showToast("Gagal menghapus kecamatan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-page-header">
        <div>
          <h1>DATA KECAMATAN</h1>
          <p>Kelola data wilayah kecamatan penilaian lahan di Kabupaten Jember</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="data-table-header">
          <h2>Daftar Kecamatan</h2>
        </div>

        <div className="data-toolbar">
          <Button className="data-add-button" onClick={handleTambah}>
            ＋ Tambah Kecamatan
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Cari kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Nama Kecamatan</th>
                <th style={{ width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "30px" }}>
                    Memuat data kecamatan...
                  </td>
                </tr>
              ) : filteredDataKecamatan.length > 0 ? (
                filteredDataKecamatan.map((kecamatan) => (
                  <tr key={kecamatan.id}>
                    <td>{kecamatan.id}</td>
                    <td><strong>{kecamatan.nama}</strong></td>
                    <td>
                      <div className="data-action">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(kecamatan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(kecamatan)}
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
              <h3>{editId !== null ? "Edit Kecamatan" : "Tambah Kecamatan Baru"}</h3>
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
                <label>Nama Kecamatan</label>
                <Input
                  type="text"
                  placeholder="Contoh: Sumbersari, Kaliwates, Patrang"
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
                  {editId !== null ? "Simpan Perubahan" : "Tambah Kecamatan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Kecamatan"
        message={`Apakah Anda yakin ingin menghapus kecamatan "${deleteTarget?.nama}"?`}
        confirmText="Hapus Kecamatan"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Kecamatan;
