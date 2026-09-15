import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function RiwayatPenilaian() {
  const [dataRiwayat] = useState([
    {
      id: 1,
      lahan: "Lahan Sumbersari 1",
      tanggal: "10-09-2026",
      skor_kelayakan: 0.86,
      probabilitas: 86
    },
    {
      id: 2,
      lahan: "Lahan Jombang 1",
      tanggal: "10-09-2026",
      skor_kelayakan: 0.72,
      probabilitas: 72
    },
    {
      id: 3,
      lahan: "Lahan Jombang 2",
      tanggal: "09-09-2026",
      skor_kelayakan: 0.91,
      probabilitas: 91
    },
    {
      id: 4,
      lahan: "Lahan Jombang 3",
      tanggal: "09-09-2026",
      skor_kelayakan: 0.65,
      probabilitas: 65
    },
    {
      id: 5,
      lahan: "Lahan Kencong 1",
      tanggal: "08-09-2026",
      skor_kelayakan: 0.78,
      probabilitas: 78
    },
    {
      id: 6,
      lahan: "Lahan Kencong 2",
      tanggal: "08-09-2026",
      skor_kelayakan: 0.58,
      probabilitas: 58
    },
    {
      id: 7,
      lahan: "Lahan Balung 1",
      tanggal: "07-09-2026",
      skor_kelayakan: 0.83,
      probabilitas: 83
    },
    {
      id: 8,
      lahan: "Lahan Puger 1",
      tanggal: "07-09-2026",
      skor_kelayakan: 0.69,
      probabilitas: 69
    },
    {
      id: 9,
      lahan: "Lahan Ajung 1",
      tanggal: "06-09-2026",
      skor_kelayakan: 0.88,
      probabilitas: 88
    },
    {
      id: 10,
      lahan: "Lahan Kaliwates 1",
      tanggal: "05-09-2026",
      skor_kelayakan: 0.76,
      probabilitas: 76
    }
  ]);

  const [search, setSearch] = useState("");

  // Data yang sedang dilihat
  const [selectedData, setSelectedData] = useState(null);

  const dataFiltered = dataRiwayat.filter((item) =>
    item.lahan
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>RIWAYAT PENILAIAN</h1>

          <p>
            Riwayat hasil penilaian kelayakan lahan FitFarm
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="data-table-card">

        <div className="data-table-header">
          <h2>Data Riwayat Penilaian</h2>
        </div>

        {/* TOOLBAR */}
        <div className="data-toolbar">

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

        {/* TABLE */}
        <div className="data-table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Lahan</th>
                <th>Tanggal</th>
                <th>Skor Kelayakan</th>
                <th>Probabilitas</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {dataFiltered.length > 0 ? (

                dataFiltered.map(
                  (riwayat, index) => (
                    <tr key={riwayat.id}>

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
                            onClick={() => handleDetail(riwayat)}
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
                      textAlign: "center",
                      padding: "30px"
                    }}
                  >
                    Data riwayat tidak ditemukan.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

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
                onClick={handleCloseDetail}
              >
                ×
              </button>

            </div>

            <div className="detail-riwayat">

              <div className="detail-item">
                <span>Nama Lahan</span>
                <strong>
                  {selectedData.lahan}
                </strong>
              </div>

              <div className="detail-item">
                <span>Tanggal Penilaian</span>
                <strong>
                  {selectedData.tanggal}
                </strong>
              </div>

              <div className="detail-item">
                <span>Skor Kelayakan</span>
                <strong>
                  {selectedData.skor_kelayakan}
                </strong>
              </div>

              <div className="detail-item">
                <span>Probabilitas</span>
                <strong>
                  {selectedData.probabilitas}%
                </strong>
              </div>

            </div>

            <div className="user-form-actions">

              <button
                type="button"
                className="user-cancel-button"
                onClick={handleCloseDetail}
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