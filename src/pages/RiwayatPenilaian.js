import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function RiwayatPenilaian() {
  const [dataRiwayat, setDataRiwayat] = useState([]);

  const [search, setSearch] = useState("");

  // Data yang sedang dilihat
  const [selectedData, setSelectedData] = useState(null);

  // Modal tambah
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    lahan: "",
    tanggal: "",
    skor_kelayakan: "",
    probabilitas: ""
  });

  // ================================
  // GET DATA RIWAYAT
  // ================================
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        const hasilMapping = data
          .slice(0, 10)
          .map((item, index) => ({
            id: item.id,
            lahan: `Lahan ${item.title
              .split(" ")
              .slice(0, 2)
              .join(" ")}`,
            tanggal: `0${10 - index}-09-2026`,
            skor_kelayakan: (
              0.60 +
              index * 0.03
            ).toFixed(2),
            probabilitas:
              60 + index * 3
          }));

        console.log(
          "HASIL GET RIWAYAT:",
          hasilMapping
        );

        setDataRiwayat(hasilMapping);
      })
      .catch((error) => {
        console.error(
          "Gagal mengambil data riwayat:",
          error
        );
      });
  }, []);

  // ================================
  // SEARCH
  // ================================
  const dataFiltered = dataRiwayat.filter(
    (item) =>
      item.lahan
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
  // BUKA FORM TAMBAH
  // ================================
  const handleTambah = () => {
    setFormData({
      lahan: "",
      tanggal: "",
      skor_kelayakan: "",
      probabilitas: ""
    });

    setShowForm(true);
  };

  // ================================
  // POST - TAMBAH RIWAYAT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.lahan.trim() ||
      !formData.tanggal.trim() ||
      !formData.skor_kelayakan ||
      !formData.probabilitas
    ) {
      alert(
        "Semua data riwayat wajib diisi."
      );

      return;
    }

    const newRiwayat = {
      lahan: formData.lahan,
      tanggal: formData.tanggal,
      skor_kelayakan:
        Number(formData.skor_kelayakan),
      probabilitas:
        Number(formData.probabilitas)
    };

    try {
      console.log("POST DIMULAI");

      console.log(
        "Data yang dikirim:",
        newRiwayat
      );

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            newRiwayat
          )
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

      const riwayatBaru = {
        id: data.id,
        lahan: data.lahan,
        tanggal: data.tanggal,
        skor_kelayakan:
          data.skor_kelayakan,
        probabilitas:
          data.probabilitas
      };

      setDataRiwayat([
        ...dataRiwayat,
        riwayatBaru
      ]);

      alert(
        "Riwayat penilaian berhasil ditambahkan!"
      );

      setShowForm(false);

      setFormData({
        lahan: "",
        tanggal: "",
        skor_kelayakan: "",
        probabilitas: ""
      });
    } catch (error) {
      console.error(
        "Gagal menambahkan riwayat:",
        error
      );

      alert(
        "Gagal menambahkan riwayat."
      );
    }
  };

  // ================================
  // BUKA DETAIL
  // ================================
  const handleDetail = (riwayat) => {
    setSelectedData(riwayat);
  };

  // ================================
  // TUTUP DETAIL
  // ================================
  const handleCloseDetail = () => {
    setSelectedData(null);
  };

  return (
    <div className="data-page">

      {/* ================================
          HEADER
          ================================ */}
      <div className="data-page-header">

        <div>

          <h1>
            RIWAYAT PENILAIAN
          </h1>

          <p>
            Riwayat hasil penilaian
            kelayakan lahan MaizeFit
          </p>

        </div>

      </div>

      {/* ================================
          TABLE CARD
          ================================ */}
      <div className="data-table-card">

        <div className="data-table-header">

          <h2>
            Data Riwayat Penilaian
          </h2>

        </div>

        {/* ================================
            TOOLBAR
            ================================ */}
        <div className="data-toolbar">

          <Button
            onClick={handleTambah}
          >
            ＋ Tambah Riwayat
          </Button>

          <Input
            type="text"
            className="data-search"
            placeholder="Search lahan..."
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
                  Lahan
                </th>

                <th>
                  Tanggal
                </th>

                <th>
                  Skor Kelayakan
                </th>

                <th>
                  Probabilitas
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {dataFiltered.length > 0 ? (

                dataFiltered.map(
                  (riwayat, index) => (

                    <tr
                      key={riwayat.id}
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {riwayat.lahan}
                      </td>

                      <td>
                        {riwayat.tanggal}
                      </td>

                      <td>
                        {riwayat.skor_kelayakan}
                      </td>

                      <td>
                        {riwayat.probabilitas}%
                      </td>

                      <td>

                        <div className="data-action">

                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() =>
                              handleDetail(
                                riwayat
                              )
                            }
                          >
                            Detail
                          </Button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px"
                    }}
                  >
                    Data riwayat
                    tidak ditemukan.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================
          MODAL TAMBAH RIWAYAT
          ================================ */}
      {showForm && (

        <div className="user-modal-overlay">

          <div className="user-modal">

            <div className="user-modal-header">

              <h2>
                Tambah Riwayat
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

              {/* LAHAN */}
              <div className="user-form-group">

                <label>
                  Nama Lahan
                </label>

                <Input
                  type="text"
                  name="lahan"
                  value={
                    formData.lahan
                  }
                  onChange={handleChange}
                  placeholder="Masukkan nama lahan"
                  autoFocus
                />

              </div>

              {/* TANGGAL */}
              <div className="user-form-group">

                <label>
                  Tanggal Penilaian
                </label>

                <Input
                  type="date"
                  name="tanggal"
                  value={
                    formData.tanggal
                  }
                  onChange={handleChange}
                />

              </div>

              {/* SKOR */}
              <div className="user-form-group">

                <label>
                  Skor Kelayakan
                </label>

                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  name="skor_kelayakan"
                  value={
                    formData.skor_kelayakan
                  }
                  onChange={handleChange}
                  placeholder="Contoh: 0.86"
                />

              </div>

              {/* PROBABILITAS */}
              <div className="user-form-group">

                <label>
                  Probabilitas (%)
                </label>

                <Input
                  type="number"
                  min="0"
                  max="100"
                  name="probabilitas"
                  value={
                    formData.probabilitas
                  }
                  onChange={handleChange}
                  placeholder="Contoh: 86"
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

      {/* ================================
          MODAL DETAIL
          ================================ */}
      {selectedData && (

        <div className="user-modal-overlay">

          <div className="user-modal">

            <div className="user-modal-header">

              <h2>
                Detail Penilaian
              </h2>

              <button
                type="button"
                className="user-modal-close"
                onClick={
                  handleCloseDetail
                }
              >
                ×
              </button>

            </div>

            <div className="detail-riwayat">

              <div className="detail-item">

                <span>
                  Nama Lahan
                </span>

                <strong>
                  {selectedData.lahan}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Tanggal Penilaian
                </span>

                <strong>
                  {selectedData.tanggal}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Skor Kelayakan
                </span>

                <strong>
                  {
                    selectedData.skor_kelayakan
                  }
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Probabilitas
                </span>

                <strong>
                  {
                    selectedData.probabilitas
                  }%
                </strong>

              </div>

            </div>

            <div className="user-form-actions">

              <button
                type="button"
                className="user-cancel-button"
                onClick={
                  handleCloseDetail
                }
              >
                Tutup
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default RiwayatPenilaian;