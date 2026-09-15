function Register({ onRegister, onLogin }) {
  return (
    <div className="auth-container">
      <div className="auth-card register-card">

        <div className="auth-header">
          <h1>FITFARM</h1>
          <p>Buat akun baru</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRegister();
          }}
        >
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              required
            />
          </div>

          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              placeholder="Masukkan ulang password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Daftar
          </button>
        </form>

        <div className="auth-footer">
          <span>Sudah punya akun?</span>

          <button
            type="button"
            className="link-button"
            onClick={onLogin}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;