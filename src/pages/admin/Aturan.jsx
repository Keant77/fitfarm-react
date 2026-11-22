import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { aturanService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const EMPTY_FORM = { indikator: "", kategori: "", deskripsi: "", cf: 1 };

function cfBadgeClass(cf) {
  if (cf >= 1) return "badge badge-green";
  if (cf >= 0.5) return "badge badge-yellow";
  return "badge badge-red";
}

export function Aturan() {
  const { showToast } = useNotification();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNo, setEditNo] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    aturanService
      .getAll()
      .then(setData)
      .catch(() => showToast("Gagal memuat data aturan", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = data.filter(
    (item) =>
      item.indikator.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase()),
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreate = () => {
    setEditNo(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditNo(item.no);
    setFormData({
      indikator: item.indikator,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      cf: item.cf,
    });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditNo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.indikator.trim() || !formData.kategori.trim()) {
      showToast("Indikator dan kategori wajib diisi.", "warning");
      return;
    }

    const payload = {
      indikator: formData.indikator,
      kategori: formData.kategori,
      deskripsi: formData.deskripsi,
      cf: Number(formData.cf),
    };

    try {
      if (editNo !== null) {
        const updated = { no: editNo, ...payload };
        await aturanService.update(editNo, updated);
        setData((prev) =>
          prev.map((item) => (item.no === editNo ? updated : item)),
        );
        showToast("Aturan berhasil diperbarui!", "success");
      } else {
        const created = await aturanService.create(payload);
        setData((prev) => [...prev, created]);
        showToast("Aturan berhasil ditambahkan!", "success");
      }
      closeForm();
    } catch {
      showToast("Gagal menyimpan aturan.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await aturanService.delete(deleteTarget.no);
      setData((prev) => prev.filter((item) => item.no !== deleteTarget.no));
      showToast(`Aturan #${deleteTarget.no} berhasil dihapus!`, "success");
    } catch {
      showToast("Gagal menghapus aturan.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="data-page">
      <div className="data-table-card">
        <div className="data-toolbar">
          <span className="data-toolbar-title">Data Aturan (CF)</span>
          <div className="data-toolbar-right">
            <Input
              className="data-search"
              placeholder="Cari indikator / kategori..."
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
                <th style={{ width: 48 }}>No</th>
                <th style={{ width: 150 }}>Indikator</th>
                <th style={{ width: 120 }}>Kategori</th>
                <th>Deskripsi</th>
                <th style={{ width: 80 }}>CF</th>
                <th style={{ width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="data-empty">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <tr key={item.no}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.indikator}</strong>
                    </td>
                    <td>
                      <span className={cfBadgeClass(item.cf)}>
                        {item.kategori}
                      </span>
                    </td>
                    <td>{item.deskripsi}</td>
                    <td>
                      <strong>{item.cf}</strong>
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
                  <td colSpan="6" className="data-empty">
                    Tidak ada data aturan.
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
              <h3>{editNo !== null ? "Edit Aturan" : "Tambah Aturan"}</h3>
              <button type="button" className="modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Nama Indikator</label>
                <Input
                  name="indikator"
                  placeholder="Contoh: pH Tanah"
                  value={formData.indikator}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-field">
                <label>Kategori</label>
                <Input
                  name="kategori"
                  placeholder="Contoh: Ideal, Rendah, Sedang"
                  value={formData.kategori}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-field">
                <label>Deskripsi Kriteria</label>
                <Input
                  name="deskripsi"
                  placeholder="Deskripsi singkat kriteria"
                  value={formData.deskripsi}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-field">
                <label>Nilai CF (0 – 1)</label>
                <Input
                  type="number"
                  name="cf"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="1.0"
                  value={formData.cf}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editNo !== null ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Aturan"
        message={`Hapus aturan "${deleteTarget?.indikator} — ${deleteTarget?.kategori}"?`}
        confirmText="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Aturan;
