import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

function User() {
  const [dataUser, setDataUser] = useState([
    {
      id: 1,
      nama: "riska",
      username: "riskavmh",
      password: "",
      role_id: 1
    },
    {
      id: 2,
      nama: "Petugas Sage",
      username: "petugas",
      password: "",
      role_id: 3
    }
  ]);

  useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => {
      const hasilMapping = data.map((user) => ({
        id: user.id,
        nama: user.name,
        username: user.username,
        password: "",
        role_id: 1
      }));

      setDataUser(hasilMapping);
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
    });
}, []);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredDataUser = dataUser.filter((user) =>
   user.nama.toLowerCase().includes(search.toLowerCase()) ||
   user.username.toLowerCase().includes(search.toLowerCase()) ||
  String(user.role_id).includes(search)
);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
    role_id: ""
  });

  // ================================
  // INPUT FORM
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ================================
// TAMBAH USER
// ================================
const handleTambah = () => {
  setEditId(null);

  setFormData({
    nama: "",
    username: "",
    password: "",
    role_id: ""
  });

  setShowForm(true);
};

// ================================
// EDIT USER
// ================================
const handleEdit = (user) => {
  setEditId(user.id);

  setFormData({
    nama: user.nama,
    username: user.username,
    password: "",
    role_id: String(user.role_id)
  });

  setShowForm(true);
};

 // ================================
// SIMPAN USER
// ================================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.nama ||
    !formData.username ||
    !formData.role_id
  ) {
    alert("Nama, username, dan role wajib diisi.");
    return;
  }

  // ================================
  // EDIT
  // ================================
  if (editId !== null) {
  const updatedUser = {
    id: editId,
    nama: formData.nama,
    username: formData.username,
    password: formData.password,
    role_id: Number(formData.role_id)
  };

  try {
    console.log("PUT DIMULAI");
    console.log("Data yang diubah:", updatedUser);

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${editId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser)
      }
    );

    console.log("Status PUT:", response.status);

    const hasil = await response.json();

    console.log("HASIL RESPONSE PUT:", hasil);

    // Update tampilan tabel
    setDataUser(
      dataUser.map((user) =>
        user.id === editId
          ? updatedUser
          : user
      )
    );

  } catch (error) {
    console.error("Gagal mengubah user:", error);
  }
}

  // ================================
  // TAMBAH
  // ================================
  else {
    const newUser = {
      nama: formData.nama,
      username: formData.username,
      password: formData.password,
      role_id: Number(formData.role_id)
    };

    try {
      console.log("POST DIMULAI");
      console.log("Data yang dikirim:", newUser);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();

      console.log("HASIL RESPONSE POST:", data);

      const userBaru = {
        id: data.id,
        nama: data.nama,
        username: data.username,
        password: data.password,
        role_id: data.role_id
      };

      setDataUser([...dataUser, userBaru]);

      alert("Data user berhasil ditambahkan!");

    } catch (error) {
      console.error("Gagal menambahkan user:", error);
      alert("Gagal menambahkan user.");
      return;
    }
  }

  setShowForm(false);

  setFormData({
    nama: "",
    username: "",
    password: "",
    role_id: ""
  });

  setEditId(null);
};

  // ================================
  // HAPUS USER
  // ================================
  const handleHapus = async (id) => {
  const user = dataUser.find(
    (item) => item.id === id
  );

  const yakin = window.confirm(
    `Apakah kamu yakin ingin menghapus pengguna "${user.nama}"?`
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

    // Hapus dari tampilan React
    setDataUser(
      dataUser.filter((item) => item.id !== id)
    );

    alert("Data user berhasil dihapus!");

  } catch (error) {
    console.error("Gagal menghapus user:", error);
    alert("Gagal menghapus user.");
  }
};
  // ================================
  // TAMPILAN
  // ================================
  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA PENGGUNA</h1>
          <p>
            Data pengguna sistem MaizeFit
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="data-table-card">

        <div className="data-table-header">
          <h2>Data Pengguna</h2>
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
                <th>Username</th>
                <th>Role ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDataUser.length > 0 ? (
                filteredDataUser.map((user) => (
                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td>
                      {user.nama}
                    </td>

                    <td>
                      {user.username}
                    </td>

                    <td>
                      {user.role_id}
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
                          onClick={() => handleHapus(user.id)}
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
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >
                    Belum ada data pengguna.
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
                  ? "Edit Pengguna"
                  : "Tambah Pengguna"}
              </h2>

              <button
                type="button"
                className="user-modal-close"
                onClick={() => setShowForm(false)}
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
                  placeholder="Masukkan nama"
                />
              </div>

              {/* USERNAME */}
              <div className="user-form-group">
                <label>
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                />
              </div>

              {/* PASSWORD */}
              <div className="user-form-group">
                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editId !== null
                      ? "Kosongkan jika tidak diubah"
                      : "Masukkan password"
                  }
                />
              </div>

              {/* ROLE ID */}
              <div className="user-form-group">
                <label>
                  Role ID
                </label>

                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                >
                  <option value="">
                    Pilih Role
                  </option>

                  <option value="1">
                    1 - Admin
                  </option>

                  <option value="2">
                    2 - Super Admin
                  </option>

                  <option value="3">
                    3 - Petugas Produksi
                  </option>

                  <option value="4">
                    4 - Petugas Pengawas
                  </option>
                </select>
              </div>

              {/* BUTTON */}
              <div className="user-form-actions">

                <Button
                  type="button"
                  variant="cancel"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                 variant="default"
                >
                  Simpan
                </Button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default User;