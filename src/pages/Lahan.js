import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Lahan() {
  const [dataLahan, setDataLahan] = useState([
  {
    id: 1,
    nama: "Lahan Sumbersari 1",
    latitude: "-8.172400",
    longitude: "113.700000",
    pengguna: "riska",
    alamat: "Jl. Mastrip, Kecamatan Sumbersari, Kabupaten Jember"
  },
  {
    id: 2,
    nama: "Lahan Jombang 1",
    latitude: "-8.145200",
    longitude: "113.555800",
    pengguna: "Petugas Sage",
    alamat: "Desa Keting, Kecamatan Jombang, Kabupaten Jember"
  },
  {
    id: 3,
    nama: "Lahan Jombang 2",
    latitude: "-8.149100",
    longitude: "113.561200",
    pengguna: "Petugas Sage",
    alamat: "Desa Keting, Kecamatan Jombang, Kabupaten Jember"
  },
  {
    id: 4,
    nama: "Lahan Jombang 3",
    latitude: "-8.153500",
    longitude: "113.568400",
    pengguna: "Petugas Sage",
    alamat: "Desa Padomasan, Kecamatan Jombang, Kabupaten Jember"
  },
  {
    id: 5,
    nama: "Lahan Kencong 1",
    latitude: "-8.285600",
    longitude: "113.357800",
    pengguna: "Petugas Sage",
    alamat: "Desa Kencong, Kecamatan Kencong, Kabupaten Jember"
  },
  {
    id: 6,
    nama: "Lahan Kencong 2",
    latitude: "-8.291300",
    longitude: "113.365100",
    pengguna: "Petugas Sage",
    alamat: "Desa Wonorejo, Kecamatan Kencong, Kabupaten Jember"
  },
  {
    id: 7,
    nama: "Lahan Balung 1",
    latitude: "-8.279800",
    longitude: "113.538500",
    pengguna: "Petugas Sage",
    alamat: "Desa Balung Lor, Kecamatan Balung, Kabupaten Jember"
  },
  {
    id: 8,
    nama: "Lahan Puger 1",
    latitude: "-8.367400",
    longitude: "113.478600",
    pengguna: "Petugas Sage",
    alamat: "Desa Puger Kulon, Kecamatan Puger, Kabupaten Jember"
  },
  {
    id: 9,
    nama: "Lahan Ajung 1",
    latitude: "-8.217500",
    longitude: "113.670200",
    pengguna: "Petugas Sage",
    alamat: "Desa Ajung, Kecamatan Ajung, Kabupaten Jember"
  },
  {
    id: 10,
    nama: "Lahan Kaliwates 1",
    latitude: "-8.171800",
    longitude: "113.694500",
    pengguna: "riska",
    alamat: "Kecamatan Kaliwates, Kabupaten Jember"
  }
]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredDataLahan = dataLahan.filter((lahan) =>
  lahan.nama.toLowerCase().includes(search.toLowerCase()) ||
  lahan.pengguna.toLowerCase().includes(search.toLowerCase()) ||
  lahan.alamat.toLowerCase().includes(search.toLowerCase())
);

  const [formData, setFormData] = useState({
    nama: "",
    latitude: "",
    longitude: "",
    pengguna: "",
    alamat: ""
  });

  // ================================
  // INPUT FORM
  // ================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================================
  // TAMBAH LAHAN
  // ================================
  const handleTambah = () => {
    setEditId(null);

    setFormData({
      nama: "",
      latitude: "",
      longitude: "",
      pengguna: "",
      alamat: ""
    });

    setShowForm(true);
  };

  // ================================
  // EDIT LAHAN
  // ================================
  const handleEdit = (lahan) => {
    setEditId(lahan.id);

    setFormData({
      nama: lahan.nama,
      latitude: lahan.latitude,
      longitude: lahan.longitude,
      pengguna: lahan.pengguna,
      alamat: lahan.alamat
    });

    setShowForm(true);
  };

  // ================================
  // SIMPAN
  // ================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nama.trim() ||
      !formData.latitude.trim() ||
      !formData.longitude.trim() ||
      !formData.pengguna.trim() ||
      !formData.alamat.trim()
    ) {
      return;
    }

    // EDIT
    if (editId !== null) {
      setDataLahan(
        dataLahan.map((lahan) =>
          lahan.id === editId
            ? {
                ...lahan,
                nama: formData.nama,
                latitude: formData.latitude,
                longitude: formData.longitude,
                pengguna: formData.pengguna,
                alamat: formData.alamat
              }
            : lahan
        )
      );
    }

    // TAMBAH
    else {
      const newLahan = {
        id:
          dataLahan.length > 0
            ? Math.max(
                ...dataLahan.map(
                  (lahan) => lahan.id
                )
              ) + 1
            : 1,

        nama: formData.nama,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pengguna: formData.pengguna,
        alamat: formData.alamat
      };

      setDataLahan([
        ...dataLahan,
        newLahan
      ]);
    }

    setShowForm(false);

    setFormData({
      nama: "",
      latitude: "",
      longitude: "",
      pengguna: "",
      alamat: ""
    });

    setEditId(null);
  };

  // ================================
  // HAPUS
  // ================================
  const handleHapus = (id) => {
    const lahan = dataLahan.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus lahan "${lahan.nama}"?`
    );

    if (!yakin) {
      return;
    }

    setDataLahan(
      dataLahan.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA LAHAN</h1>

          <p>
            Data lahan pertanian sistem FitFarm
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="data-table-card">

        <div className="data-table-header">
          <h2>Data Lahan</h2>
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
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Pengguna</th>
                <th>Alamat</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDataLahan.length > 0 ? (

                filteredDataLahan.map(
                  (lahan, index) => (
                    <tr key={lahan.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {lahan.nama}
                      </td>

                      <td>
                        {lahan.latitude}
                      </td>

                      <td>
                        {lahan.longitude}
                      </td>

                      <td>
                        {lahan.pengguna}
                      </td>

                      <td>
                        {lahan.alamat}
                      </td>

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
                            onClick={() => handleHapus(lahan.id)}
                          >
                            Hapus
                          </Button>

                        </div>
                      </td>

                    </tr>
                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px"
                    }}
                  >
                    Belum ada data lahan.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================
          MODAL FORM
          ================================ */}
      {showForm && (

        <div className="user-modal-overlay">

          <div className="user-modal">

            <div className="user-modal-header">

              <h2>
                {editId !== null
                  ? "Edit Lahan"
                  : "Tambah Lahan"}
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

              {/* NAMA */}
              <div className="user-form-group">

                <label>
                  Nama
                </label>

                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lahan"
                  autoFocus
                />

              </div>

              {/* LATITUDE */}
              <div className="user-form-group">

                <label>
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Contoh: -8.1724"
                />

              </div>

              {/* LONGITUDE */}
              <div className="user-form-group">

                <label>
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Contoh: 113.7000"
                />

              </div>

              {/* PENGGUNA */}
              <div className="user-form-group">

                <label>
                  Pengguna
                </label>

                <input
                  type="text"
                  name="pengguna"
                  value={formData.pengguna}
                  onChange={handleChange}
                  placeholder="Masukkan pengguna"
                />

              </div>

              {/* ALAMAT */}
              <div className="user-form-group">

                <label>
                  Alamat
                </label>

                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lahan"
                />

              </div>

              {/* BUTTON */}
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

export default Lahan;