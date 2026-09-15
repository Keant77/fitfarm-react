function Aturan({ onBack }) {
  const dataAturan = [
    {
      no: 1,
      indikator: "pH Tanah",
      kategori: "Ideal",
      deskripsi: "Tingkat keasaman pH tanah antara 6.0 - 7.0",
      cf: 1
    },
    {
      no: 2,
      indikator: "pH Tanah",
      kategori: "Asam",
      deskripsi: "Tingkat keasaman pH tanah kurang dari 6",
      cf: 0.6
    },
    {
      no: 3,
      indikator: "pH Tanah",
      kategori: "Basa",
      deskripsi: "Tingkat keasaman pH tanah lebih dari 7.0",
      cf: 0.2
    },
    {
      no: 4,
      indikator: "Ketinggian Tempat",
      kategori: "Rendah",
      deskripsi: "Lahan berada di dataran rendah (<800 mdpl)",
      cf: 1
    },
    {
      no: 5,
      indikator: "Ketinggian Tempat",
      kategori: "Sedang",
      deskripsi: "Lahan berada di ketinggian sedang (800 - 1200 mdpl)",
      cf: 0.6
    },
    {
      no: 6,
      indikator: "Ketinggian Tempat",
      kategori: "Tinggi",
      deskripsi: "Lahan berada di dataran tinggi (1200 - 1800 mdpl)",
      cf: 0.2
    },
    {
      no: 7,
      indikator: "Ketersediaan Air",
      kategori: "Berlimpah",
      deskripsi: "Irigasi teknis, air selalu tersedia sepanjang tahun",
      cf: 1
    },
    {
      no: 8,
      indikator: "Ketersediaan Air",
      kategori: "Cukup",
      deskripsi: "Sumber air stabil, tetapi tidak selalu tersedia",
      cf: 0.6
    },
    {
      no: 9,
      indikator: "Ketersediaan Air",
      kategori: "Terbatas",
      deskripsi: "Kadang-kadang mengalami kekeringan",
      cf: 0.2
    },
    {
      no: 10,
      indikator: "Curah Hujan",
      kategori: "Sedang",
      deskripsi: "Curah hujan antara 1000 - 1500 mm/tahun",
      cf: 1
    },
    {
      no: 11,
      indikator: "Curah Hujan",
      kategori: "Rendah",
      deskripsi: "Curah hujan kurang dari 1000 mm/tahun",
      cf: 0.6
    },
    {
      no: 12,
      indikator: "Curah Hujan",
      kategori: "Tinggi",
      deskripsi: "Curah hujan antara 1500 - 2000 mm/tahun",
      cf: 0.2
    },
    {
      no: 13,
      indikator: "Isolasi Jarak",
      kategori: "Jauh",
      deskripsi: "Jarak antar lahan jauh > 400 meter",
      cf: 1
    },
    {
      no: 14,
      indikator: "Isolasi Jarak",
      kategori: "Aman",
      deskripsi: "Jarak antar lahan cukup jauh 250 - 400 meter",
      cf: 0.6
    },
    {
      no: 15,
      indikator: "Isolasi Jarak",
      kategori: "Terlalu Dekat",
      deskripsi: "Jarak antar lahan sangat dekat < 250 meter",
      cf: 0.2
    }
  ];

  return (
    <div className="master-detail-page">

      <div className="master-detail-header">
        <div>
          <h1>DATA ATURAN</h1>
          <p>Aturan yang digunakan untuk penilaian kelayakan lahan</p>
        </div>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Master Data
        </button>
      </div>

      <div className="data-table-card">

        <div className="data-table-header">
          <div>
            <h2>Data Aturan</h2>
            <p>
              Daftar aturan penilaian kelayakan lahan FitFarm.
            </p>
          </div>

          <button className="add-button">
            + Tambah
          </button>
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>Indikator</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Nilai CF</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {dataAturan.map((aturan) => (
                <tr key={aturan.no}>

                  <td>{aturan.no}</td>

                  <td>{aturan.indikator}</td>

                  <td>{aturan.kategori}</td>

                  <td>{aturan.deskripsi}</td>

                  <td>{aturan.cf}</td>

                  <td>
                    <button className="edit-button">
                      Edit
                    </button>

                    <button className="delete-button">
                      Hapus
                    </button>
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

export default Aturan;