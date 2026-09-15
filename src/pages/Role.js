import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function Role() {
  const [dataRole, setDataRole] = useState([
    {
      id: 1,
      name: "Admin"
    },
    {
      id: 2,
      name: "Super Admin"
    },
    {
      id: 3,
      name: "Petugas Produksi"
    },
    {
      id: 4,
      name: "Petugas Pengawas"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredDataRole = dataRole.filter((role) =>
  role.name.toLowerCase().includes(search.toLowerCase()) ||
  String(role.id).includes(search)
);

  const [formData, setFormData] = useState({
    name: ""
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
  // SIMPAN ROLE
  // ================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    // EDIT
    if (editId !== null) {
      setDataRole(
        dataRole.map((role) =>
          role.id === editId
            ? {
                ...role,
                name: formData.name
              }
            : role
        )
      );
    }

    // TAMBAH
    else {
      const newRole = {
        id:
          dataRole.length > 0
            ? Math.max(
                ...dataRole.map((role) => role.id)
              ) + 1
            : 1,

        name: formData.name
      };

      setDataRole([
        ...dataRole,
        newRole
      ]);
    }

    setShowForm(false);

    setFormData({
      name: ""
    });

    setEditId(null);
  };

  // ================================
  // HAPUS ROLE
  // ================================
  const handleHapus = (id) => {
    const role = dataRole.find(
      (item) => item.id === id
    );

    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus role "${role.name}"?`
    );

    if (!yakin) {
      return;
    }

    setDataRole(
      dataRole.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA ROLE</h1>

          <p>
            Data role pengguna sistem FitFarm
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
            onChange={(e) => setSearch(e.target.value)}
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
                filteredDataRole.map((role, index) => (
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
                         onClick={() => handleEdit(role)}
                        >
                          Edit
                        </Button>

                        <Button
                         variant="destructive"
                         size="sm"
                          onClick={() => handleHapus(role.id)}
                        >
                           Hapus
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))
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

      {/* ================================
          MODAL
          ================================ */}
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