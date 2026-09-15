function MasterData({
  onBack,
  onUser,
  onRole,
  onLahan,
  onKecamatan
}) {
  return (
    <div className="master-page">

      {/* HEADER */}
      <div className="master-header">
        <div>
          <h1>MASTER DATA</h1>
          <p>Pengelolaan data sistem FitFarm</p>
        </div>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </div>

      {/* MASTER DATA */}
      <div className="master-grid">

        {/* USER */}
        <div className="master-card">
          <h2>Data User</h2>

          <p>
            Data pengguna yang terdaftar pada sistem FitFarm.
          </p>

          <div className="master-number">
            1
          </div>

          <button
            className="master-button"
            onClick={onUser}
          >
            Kelola Data
          </button>
        </div>

        {/* ROLE */}
        <div className="master-card">
          <h2>Data Role</h2>

          <p>
            Data role atau hak akses pengguna sistem.
          </p>

          <div className="master-number">
            4
          </div>

          <button
            className="master-button"
            onClick={onRole}
          >
            Kelola Data
          </button>
        </div>

        {/* KECAMATAN */}
        <div className="master-card">
          <h2>Data Kecamatan</h2>

          <p>
            Data kecamatan yang berkaitan dengan data lahan.
          </p>

          <div className="master-number">
            -
          </div>

          <button
            className="master-button"
            onClick={onKecamatan}
          >
            Kelola Data
          </button>
        </div>

        {/* LAHAN */}
        <div className="master-card">
          <h2>Data Lahan</h2>

          <p>
            Data lahan yang dinilai dalam sistem FitFarm.
          </p>

          <div className="master-number">
            -
          </div>

          <button
            className="master-button"
            onClick={onLahan}
          >
            Kelola Data
          </button>
        </div>

      </div>
    </div>
  );
}

export default MasterData;