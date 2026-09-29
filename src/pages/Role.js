import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Role() {
  const [dataRole, setDataRole] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: ""
  });

  // ================================
  // GET DATA ROLE
  // ================================
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const hasilMapping = data.map((user) => ({
          id: user.id,
          name: user.name
        }));

        setDataRole(hasilMapping);
      })
      .catch((error) => {
        console.error("Gagal mengambil data role:", error);
      });
  }, []);

  // ================================
  // SEARCH
  // ================================
  const filteredDataRole = dataRole.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      String(role.id).includes(search)
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
  // TAMBAH ROLE
  // ================================
  const handleTambah = () => {
    setEditId(null);

    setFormData({
      name: ""
    });

    setShowForm(true);
  };

  // ================================
  // EDIT ROLE
  // ================================
  const handleEdit = (role) => {
    setEditId(role.id);

    setFormData({
      name: role.name
    });

    setShowForm(true);
  };

  // ================================
  // POST / PUT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nama role wajib diisi.");
      return;
    }

    // ================================
    // PUT - EDIT ROLE
    // ================================
    if (editId !== null) {
      const updatedRole = {
        id: editId,
        name: formData.name
      };

      try {
        console.log("PUT DIMULAI");
        console.log("Data yang diubah:", updatedRole);

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRole)
          }
        );

        console.log("Status PUT:", response.status);

        const hasil = await response.json();

        console.log("HASIL RESPONSE PUT:", hasil);

        // Update tampilan website
        setDataRole(
          dataRole.map((role) =>
            role.id === editId
              ? updatedRole
              : role
          )
        );

        alert("Role berhasil diubah!");
      } catch (error) {
        console.error("Gagal mengubah role:", error);
        alert("Gagal mengubah role.");
        return;
      }
    }

    // ================================
    // POST - TAMBAH ROLE
    // ================================
    else {
      const newRole = {
        name: formData.name
      };

      try {
        console.log("POST DIMULAI");
        console.log("Data yang dikirim:", newRole);

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newRole)
          }
        );

        console.log("Status POST:", response.status);

        const data = await response.json();

        console.log("HASIL RESPONSE POST:", data);

        const roleBaru = {
          id: data.id,
          name: data.name
        };

        setDataRole([
          ...dataRole,
          roleBaru
        ]);

        alert("Role berhasil ditambahkan!");
      } catch (error) {
        console.error("Gagal menambahkan role:", error);
        alert("Gagal menambahkan role.");
        return;
      }
    }

    setShowForm(false);

    setFormData({
      name: ""
    });

    setEditId(null);
  };

  // ================================
  // DELETE ROLE
  // ================================
  const handleHapus = async (id) => {
    const role = dataRole.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus role "${role.name}"?`
    );

    if (!yakin) {
      return;
    }

    try {
      console.log("DELETE DIMULAI");
      console.log("ID yang dihapus:", id);

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE"
        }
      );

      console.log("Status DELETE:", response.status);

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      console.log("DELETE BERHASIL");

      // Hapus dari tampilan website
      setDataRole(
        dataRole.filter(
          (item) => item.id !== id
        )
      );

      alert("Role berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus role:", error);
      alert("Gagal menghapus role.");
    }
  };

  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA ROLE</h1>

          <p>
            Data role pengguna sistem MaizeFit
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="data-table-card">

        <div className="data-table-header">
          <h2>Data Role</h2>
        </div>

        {/* TOOLBAR */}
        <div className="data-toolbar">

          <Button onClick={handleTambah}>
            ＋ Tambah
          </Button>

          <input
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
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDataRole.length > 0 ? (
                filteredDataRole.map(
                  (role, index) => (
                    <tr key={role.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {role.name}
                      </td>

                      <td>
                        <div className="data-action">

                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() =>
                              handleEdit(role)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleHapus(role.id)
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
                    Belum ada data role.
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
                  ? "Edit Role"
                  : "Tambah Role"}
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
                  Name
                </label>

                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama role"
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

export default Role;