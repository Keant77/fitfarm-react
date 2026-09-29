import { useState } from "react";
import {
  Leaf,
  BarChart3,
  MapPin,
  UserRound,
  LockKeyhole,
  EyeOff,
  LogIn,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";

function Login({ onLogin }) {
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(
    () => !!localStorage.getItem("maizefit_remembered_username")
  );

  const [rememberedUsername] = useState(
    () => localStorage.getItem("maizefit_remembered_username") || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const berhasil = onLogin(username, password);

    if (!berhasil) {
      setError("Username atau password salah!");
    } else {
      setError("");

      if (rememberMe) {
        localStorage.setItem(
          "maizefit_remembered_username",
          username
        );
      } else {
        localStorage.removeItem("maizefit_remembered_username");
      }
    }
  };

  return (
    <div className="login-page">
      {/* ORNAMEN LUAR */}
      <div className="login-page-decoration login-decoration-top" />
      <div className="login-page-decoration login-decoration-bottom" />

      <div className="login-card">
        {/* =========================
            PANEL KIRI
        ========================== */}
        <section className="login-info">
          {/* Ornamen pojok kanan atas */}
          <div className="login-top-shape" />

          {/* Logo */}
          <div className="login-brand">
            <img
            src="/assets/logo.png"
            alt="Logo MaizeFit"
            className="login-logo-image"
            />

            <span>MaizeFit</span>
          </div>

          {/* Konten */}
          <div className="login-info-content">
            <h1>
              Pertanian Cerdas,
              <br />
              Hasil Maksimal
            </h1>

            <p>
              Kelola lahan, pantau data, dan tingkatkan
              produktivitas pertanian dengan teknologi
              berbasis data.
            </p>

            {/* FEATURE 1 */}
            <div className="login-features">
              <div className="login-feature">
                <div className="feature-icon">
                  <Leaf size={22} />
                </div>

                <div>
                  <strong>Data Akurat</strong>
                  <span>
                    Informasi pertanian real-time
                    <br />
                    dan terpercaya
                  </span>
                </div>
              </div>

              {/* FEATURE 2 */}
              <div className="login-feature">
                <div className="feature-icon">
                  <BarChart3 size={22} />
                </div>

                <div>
                  <strong>Meningkatkan Produktivitas</strong>
                  <span>
                    Rekomendasi berbasis data
                    <br />
                    untuk hasil panen yang lebih baik
                  </span>
                </div>
              </div>

              {/* FEATURE 3 */}
              <div className="login-feature">
                <div className="feature-icon">
                  <MapPin size={22} />
                </div>

                <div>
                  <strong>Mudah Digunakan</strong>
                  <span>
                    Akses cepat dari mana saja
                    <br />
                    dan kapan saja
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dekorasi bawah */}
         <div className="login-bottom-decoration">
           <img
             src="/assets/footer.png"
             alt=""
              className="login-footer-image"
           />
          </div>
        </section>

        {/* =========================
            PANEL KANAN
        ========================== */}
        <section className="login-form-panel">
          <div className="login-form-container">

            {/* Logo */}
            <div className="login-form-logo">
              <img
                src="/assets/logo.png"
               alt="Logo MaizeFit"
               className="login-logo-image"
              />

              <span>MaizeFit</span>
            </div>

            {/* Header */}
            <div className="login-form-header">
              <h2>Selamat Datang Kembali</h2>

              <p>
                Masuk ke akun Anda untuk melanjutkan
                <br />
                ke sistem MaizeFit.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div className="form-group">
                <label>Email atau Username</label>

                <div className="input-wrapper">
                  <UserRound
                    className="input-icon-svg"
                    size={20}
                  />

                  <input
                    name="username"
                    type="text"
                    placeholder="Masukkan email atau username"
                    autoComplete="username"
                    defaultValue={rememberedUsername}
                    required
                    onChange={() => setError("")}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label>Password</label>

                <div className="input-wrapper">
                  <LockKeyhole
                    className="input-icon-svg"
                    size={20}
                  />

                  <input
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    onChange={() => setError("")}
                  />

                  <EyeOff
                    className="password-icon-svg"
                    size={19}
                  />
                </div>
              </div>

              {/* OPTIONS */}
              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span className="custom-check">
                    {rememberMe && <Check size={13} />}
                  </span>

                  <span>Ingat saya</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Lupa password?
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              {/* LOGIN */}
              <Button
                type="submit"
                className="login-submit"
              >
                <LogIn size={19} />
                <span>Masuk</span>
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;