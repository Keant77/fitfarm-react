function Indikator({ onBack }) {
  const dataIndikator = [
    {
      id: 1,
      nama: "pH Tanah",
    },
    {
      id: 2,
      nama: "Ketinggian Tempat",
    },
    {
      id: 3,
      nama: "Ketersediaan Air",
    },
    {
      id: 4,
      nama: "Curah Hujan",
    },
    {
      id: 5,
      nama: "Isolasi Jarak",
    },
  ];

  return (
    <div className="data-page">

      {/* HEADER */}
      <div className="data-page-header">
        <div>
          <h1>DATA INDIKATOR</h1>

          <p>
            Data indikator penilaian kelayakan lahan FitFarm
          </p>
        </div>

        <button
          className="data-back-button"
          onClick={onBack}
        >
          ← Master Data
        </button>
      </div>


      {/* CARD DATA */}
      <div className="data-table-card">

        {/* HEADER CARD */}
        <div className="data-table-header">
          <h2>Data Indikator</h2>
        </div>


        {/* TOOLBAR */}
        <div className="data-toolbar">

          <button
            className="data-add-button"
            onClick={() => alert("Fitur tambah indikator")}
          >
            ＋ Tambah
          </button>

          <input
            type="text"
            className="data-search"
            placeholder="Search..."
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

              {dataIndikator.map((item) => (
                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.nama}</td>

                  <td>
                    <div className="data-action">

                      <button
                        className="data-edit-button"
                        onClick={() =>
                          alert(`Edit ${item.nama}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="data-delete-button"
                        onClick={() =>
                          alert(`Hapus ${item.nama}`)
                        }
                      >
                        Hapus
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Indikator;