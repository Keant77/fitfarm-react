import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Lahan() {
  const [dataLahan, setDataLahan] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    latitude: "",
    longitude: "",
    pengguna: "",
    alamat: ""
  });

  // ================================
  // GET DATA LAHAN
  // ================================
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const hasilMapping = data.map((user) => ({
          id: user.id,
          nama: user.name,

          // JSONPlaceholder tidak punya latitude
          // dan longitude, jadi kita buat dummy
          latitude: (-8.15 - user.id * 0.01).toFixed(6),

          longitude: (113.65 + user.id * 0.01).toFixed(6),

          // Data pengguna dari API
          pengguna: user.username,

          // Alamat dari data API
          alamat: `${user.address.street}, ${user.address.city}`
        }));

        console.log(
          "HASIL GET LAHAN:",
          hasilMapping
        );

        setDataLahan(hasilMapping);
      })
      .catch((error) => {
        console.error(
          "Gagal mengambil data lahan:",
          error
        );
      });
  }, []);

  // ================================
  // SEARCH
  // ================================
  const filteredDataLahan =
    dataLahan.filter((lahan) =>
      lahan.nama
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      lahan.pengguna
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      lahan.alamat
        .toLowerCase()
        .includes(search.toLowerCase())
    );

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
  // POST / PUT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================================
    // VALIDASI
    // ================================
    if (
      !formData.nama.trim() ||
      !formData.latitude.trim() ||
      !formData.longitude.trim() ||
      !formData.pengguna.trim() ||
      !formData.alamat.trim()
    ) {
      alert(
        "Semua data lahan wajib diisi."
      );

      return;
    }

    // ================================
    // PUT - EDIT LAHAN
    // ================================
    if (editId !== null) {
      const updatedLahan = {
        id: editId,
        nama: formData.nama,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pengguna: formData.pengguna,
        alamat: formData.alamat
      };

      try {
        console.log("PUT DIMULAI");

        console.log(
          "Data yang diubah:",
          updatedLahan
        );

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              updatedLahan
            )
          }
        );

        console.log(
          "Status PUT:",
          response.status
        );

        const hasil =
          await response.json();

        console.log(
          "HASIL RESPONSE PUT:",
          hasil
        );

        // Update tampilan website
        setDataLahan(
          dataLahan.map((lahan) =>
            lahan.id === editId
              ? updatedLahan
              : lahan
          )
        );

        alert(
          "Lahan berhasil diubah!"
        );
      } catch (error) {
        console.error(
          "Gagal mengubah lahan:",
          error
        );

        alert(
          "Gagal mengubah lahan."
        );

        return;
      }
    }

    // ================================
    // POST - TAMBAH LAHAN
    // ================================
    else {
      const newLahan = {
        nama: formData.nama,
        latitude: formData.latitude,
        longitude: formData.longitude,
        pengguna: formData.pengguna,
        alamat: formData.alamat
      };

      try {
        console.log("POST DIMULAI");

        console.log(
          "Data yang dikirim:",
          newLahan
        );

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newLahan)
          }
        );

        console.log(
          "Status POST:",
          response.status
        );

        const data =
          await response.json();

        console.log(
          "HASIL RESPONSE POST:",
          data
        );

        const lahanBaru = {
          id: data.id,
          nama: data.nama,
          latitude: data.latitude,
          longitude: data.longitude,
          pengguna: data.pengguna,
          alamat: data.alamat
        };

        setDataLahan([
          ...dataLahan,
          lahanBaru
        ]);

        alert(
          "Lahan berhasil ditambahkan!"
        );
      } catch (error) {
        console.error(
          "Gagal menambahkan lahan:",
          error
        );

        alert(
          "Gagal menambahkan lahan."
        );

        return;
      }
    }

    // ================================
    // RESET FORM
    // ================================
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
  // DELETE LAHAN
  // ================================
  const handleHapus = async (id) => {
    const lahan = dataLahan.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus lahan "${lahan.nama}"?`
    );

    if (!yakin) {
      return;
    }

    try {
      console.log(
        "DELETE DIMULAI"
      );

      console.log(
        "ID yang dihapus:",
        id
      );

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE"
        }
      );

      console.log(
        "Status DELETE:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          "Gagal menghapus data"
        );
      }

      console.log(
        "DELETE BERHASIL"
      );

      // Hapus dari tampilan
      setDataLahan(
        dataLahan.filter(
          (item) => item.id !== id
        )
      );

      alert(
        "Lahan berhasil dihapus!"
      );
    } catch (error) {
      console.error(
        "Gagal menghapus lahan:",
        error
      );

      alert(
        "Gagal menghapus lahan."
      );
    }
  };

  return (
    <div className="data-page">

      {/* ================================
          HEADER
          ================================ */}
      <div className="data-page-header">

        <div>

          <h1>
            DATA LAHAN
          </h1>

          <p>
            Data lahan pertanian sistem MaizeFit
          </p>

        </div>

      </div>

      {/* ================================
          TABLE CARD
          ================================ */}
      <div className="data-table-card">

        <div className="data-table-header">

          <h2>
            Data Lahan
          </h2>

        </div>

        {/* ================================
            TOOLBAR
            ================================ */}
        <div className="data-toolbar">

          <Button
            onClick={handleTambah}
          >
            ＋ Tambah
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* ================================
            TABLE
            ================================ */}
        <div className="data-table-wrapper">

          <table className="data-table">

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Nama
                </th>

                <th>
                  Latitude
                </th>

                <th>
                  Longitude
                </th>

                <th>
                  Pengguna
                </th>

                <th>
                  Alamat
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDataLahan.length >
              0 ? (

                filteredDataLahan.map(
                  (lahan, index) => (

                    <tr
                      key={lahan.id}
                    >

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
                            onClick={() =>
                              handleEdit(
                                lahan
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleHapus(
                                lahan.id
                              )
                            }
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
                      textAlign:
                        "center",
                      padding:
                        "40px"
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

            <form
              onSubmit={handleSubmit}
            >

              {/* NAMA */}
              <div className="user-form-group">

                <label>
                  Nama
                </label>

                <Input
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

                <Input
                  type="number"
                  step="any"
                  name="latitude"
                  value={
                    formData.latitude
                  }
                  onChange={handleChange}
                  placeholder="Contoh: -8.1724"
                />

              </div>

              {/* LONGITUDE */}
              <div className="user-form-group">

                <label>
                  Longitude
                </label>

                <Input
                  type="number"
                  step="any"
                  name="longitude"
                  value={
                    formData.longitude
                  }
                  onChange={handleChange}
                  placeholder="Contoh: 113.7000"
                />

              </div>

              {/* PENGGUNA */}
              <div className="user-form-group">

                <label>
                  Pengguna
                </label>

                <Input
                  type="text"
                  name="pengguna"
                  value={
                    formData.pengguna
                  }
                  onChange={handleChange}
                  placeholder="Masukkan pengguna"
                />

              </div>

              {/* ALAMAT */}
              <div className="user-form-group">

                <label>
                  Alamat
                </label>

                <Input
                  type="text"
                  name="alamat"
                  value={
                    formData.alamat
                  }
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