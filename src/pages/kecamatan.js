import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Kecamatan() {
  const [dataKecamatan, setDataKecamatan] = useState([
    { id: 1, nama: "Ajung" },
    { id: 2, nama: "Ambulu" },
    { id: 3, nama: "Arjasa" },
    { id: 4, nama: "Balung" },
    { id: 5, nama: "Bangsalsari" },
    { id: 6, nama: "Gumukmas" },
    { id: 7, nama: "Jelbuk" },
    { id: 8, nama: "Jenggawah" },
    { id: 9, nama: "Jombang" },
    { id: 10, nama: "Kalisat" },
    { id: 11, nama: "Kaliwates" },
    { id: 12, nama: "Kencong" },
    { id: 13, nama: "Ledokombo" },
    { id: 14, nama: "Mayang" },
    { id: 15, nama: "Mumbulsari" },
    { id: 16, nama: "Pakusari" },
    { id: 17, nama: "Panti" },
    { id: 18, nama: "Patrang" },
    { id: 19, nama: "Puger" },
    { id: 20, nama: "Rambipuji" },
    { id: 21, nama: "Semboro" },
    { id: 22, nama: "Silo" },
    { id: 23, nama: "Sukorambi" },
    { id: 24, nama: "Sukowono" },
    { id: 25, nama: "Sumberbaru" },
    { id: 26, nama: "Sumberjambe" },
    { id: 27, nama: "Sumbersari" },
    { id: 28, nama: "Tanggul" },
    { id: 29, nama: "Tempurejo" },
    { id: 30, nama: "Umbulsari" },
    { id: 31, nama: "Wuluhan" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredDataKecamatan = dataKecamatan.filter((kecamatan) =>
  kecamatan.nama.toLowerCase().includes(search.toLowerCase()) ||
  String(kecamatan.id).includes(search)
);

  const [formData, setFormData] = useState({
    nama: ""
  });

  // ================================
  // INPUT
  // ================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================================
  // TAMBAH
  // ================================
  const handleTambah = () => {
    setEditId(null);

    setFormData({
      nama: ""
    });

    setShowForm(true);
  };

  // ================================
  // EDIT
  // ================================
  const handleEdit = (kecamatan) => {
    setEditId(kecamatan.id);

    setFormData({
      nama: kecamatan.nama
    });

    setShowForm(true);
  };

  // ================================
  // SIMPAN
  // ================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      return;
    }

    // EDIT
    if (editId !== null) {
      setDataKecamatan(
        dataKecamatan.map((kecamatan) =>
          kecamatan.id === editId
            ? {
                ...kecamatan,
                nama: formData.nama
              }
            : kecamatan
        )
      );
    }

    // TAMBAH
    else {
      const newKecamatan = {
        id:
          dataKecamatan.length > 0
            ? Math.max(
                ...dataKecamatan.map(
                  (kecamatan) => kecamatan.id
                )
              ) + 1
            : 1,

        nama: formData.nama
      };

      setDataKecamatan([
        ...dataKecamatan,
        newKecamatan
      ]);
    }

    setShowForm(false);

    setFormData({
      nama: ""
    });

    setEditId(null);
  };

  // ================================
  // HAPUS
  // ================================
  const handleHapus = (id) => {
    const kecamatan = dataKecamatan.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus kecamatan "${kecamatan.nama}"?`
    );

    if (!yakin) {
      return;
    }

    setDataKecamatan(
      dataKecamatan.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA KECAMATAN</h1>

          <p>
            Data kecamatan Kabupaten Jember
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="data-table-card">

        <div className="data-table-header">
          <h2>Data Kecamatan</h2>
        </div>

        {/* TOOLBAR */}
        <div className="data-toolbar">

          <Button onClick={handleTambah}>
           ＋ Tambah
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* TABLE */}
        <div className="data-table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDataKecamatan.map(
                (kecamatan, index) => (
                  <tr key={kecamatan.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {kecamatan.nama}
                    </td>

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
                         onClick={() => handleHapus(kecamatan.id)}
                        >
                           Hapus
                        </Button>

                      </div>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {showForm && (
        <div className="user-modal-overlay">

          <div className="user-modal">

            <div className="user-modal-header">

              <h2>
                {editId !== null
                  ? "Edit Kecamatan"
                  : "Tambah Kecamatan"}
              </h2>

              <button
                type="button"
                className="user-modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="user-form-group">

                <label>
                  Nama Kecamatan
                </label>

                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama kecamatan"
                  autoFocus
                />

              </div>

              <div className="user-form-actions">

                <button
                  type="button"
                  className="user-cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="user-save-button"
                >
                  Simpan
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Kecamatan;