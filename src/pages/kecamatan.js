import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Kecamatan() {
  const [dataKecamatan, setDataKecamatan] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    nama: ""
  });

  // ================================
  // GET DATA KECAMATAN
  // ================================
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const hasilMapping = data.map((user) => ({
          id: user.id,
          nama: user.name
        }));

        setDataKecamatan(hasilMapping);
      })
      .catch((error) => {
        console.error(
          "Gagal mengambil data kecamatan:",
          error
        );
      });
  }, []);

  // ================================
  // SEARCH
  // ================================
  const filteredDataKecamatan =
    dataKecamatan.filter(
      (kecamatan) =>
        kecamatan.nama
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(kecamatan.id).includes(search)
    );

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
  // POST / PUT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      alert("Nama kecamatan wajib diisi.");
      return;
    }

    // ================================
    // PUT - EDIT
    // ================================
    if (editId !== null) {
      const updatedKecamatan = {
        id: editId,
        nama: formData.nama
      };

      try {
        console.log("PUT DIMULAI");
        console.log(
          "Data yang diubah:",
          updatedKecamatan
        );

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              updatedKecamatan
            )
          }
        );

        console.log(
          "Status PUT:",
          response.status
        );

        const hasil = await response.json();

        console.log(
          "HASIL RESPONSE PUT:",
          hasil
        );

        setDataKecamatan(
          dataKecamatan.map((kecamatan) =>
            kecamatan.id === editId
              ? updatedKecamatan
              : kecamatan
          )
        );

        alert(
          "Kecamatan berhasil diubah!"
        );
      } catch (error) {
        console.error(
          "Gagal mengubah kecamatan:",
          error
        );

        alert(
          "Gagal mengubah kecamatan."
        );

        return;
      }
    }

    // ================================
    // POST - TAMBAH
    // ================================
    else {
      const newKecamatan = {
        nama: formData.nama
      };

      try {
        console.log("POST DIMULAI");
        console.log(
          "Data yang dikirim:",
          newKecamatan
        );

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              newKecamatan
            )
          }
        );

        console.log(
          "Status POST:",
          response.status
        );

        const data = await response.json();

        console.log(
          "HASIL RESPONSE POST:",
          data
        );

        const kecamatanBaru = {
          id: data.id,
          nama: data.nama
        };

        setDataKecamatan([
          ...dataKecamatan,
          kecamatanBaru
        ]);

        alert(
          "Kecamatan berhasil ditambahkan!"
        );
      } catch (error) {
        console.error(
          "Gagal menambahkan kecamatan:",
          error
        );

        alert(
          "Gagal menambahkan kecamatan."
        );

        return;
      }
    }

    setShowForm(false);

    setFormData({
      nama: ""
    });

    setEditId(null);
  };

  // ================================
  // DELETE
  // ================================
  const handleHapus = async (id) => {
    const kecamatan = dataKecamatan.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus kecamatan "${kecamatan.nama}"?`
    );

    if (!yakin) {
      return;
    }

    try {
      console.log("DELETE DIMULAI");
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

      setDataKecamatan(
        dataKecamatan.filter(
          (item) => item.id !== id
        )
      );

      alert(
        "Kecamatan berhasil dihapus!"
      );
    } catch (error) {
      console.error(
        "Gagal menghapus kecamatan:",
        error
      );

      alert(
        "Gagal menghapus kecamatan."
      );
    }
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

              {filteredDataKecamatan.length >
              0 ? (
                filteredDataKecamatan.map(
                  (kecamatan, index) => (
                    <tr
                      key={kecamatan.id}
                    >

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
                            onClick={() =>
                              handleEdit(
                                kecamatan
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
                                kecamatan.id
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
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >
                    Belum ada data
                    kecamatan.
                  </td>
                </tr>
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

            <form
              onSubmit={handleSubmit}
            >

              <div className="user-form-group">

                <label>
                  Nama Kecamatan
                </label>

                <Input
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