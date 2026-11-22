import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  BarChart3,
  MapPin,
  UserRound,
  LockKeyhole,
  EyeOff,
  Eye,
  LogIn,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() =>
    Boolean(localStorage.getItem("maizefit_remembered_username")),
  );
  const [rememberedUsername] = useState(
    () => localStorage.getItem("maizefit_remembered_username") || "",
  );
  const [rememberedPassword] = useState(() => {
    try {
      const enc = localStorage.getItem("maizefit_remembered_password");
      return enc ? atob(enc) : "";
    } catch {
      return "";
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    let result;
    if (onLogin) {
      const ok = onLogin(username, password);
      result = {
        success: ok,
        message: ok ? "" : "Username atau password salah!",
      };
    } else {
      result = await login(username, password);
    }

    if (!result.success) {
      setError(result.message || "Username atau password salah!");
      showToast(result.message || "Gagal masuk ke sistem.", "error");
    } else {
      setError("");

      if (rememberMe) {
        localStorage.setItem("maizefit_remembered_username", username);
        localStorage.setItem("maizefit_remembered_password", btoa(password));
      } else {
        localStorage.removeItem("maizefit_remembered_username");
        localStorage.removeItem("maizefit_remembered_password");
      }

      showToast("Selamat datang kembali di MaizeFit!", "success");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ===================== PANEL KIRI ===================== */}
        <section className="login-info" aria-hidden="true">
          {/* Brand */}
          <div className="login-brand">
            <img
              src="/assets/logo.png"
              alt="Logo MaizeFit"
              className="login-logo-image"
            />
            <div className="login-brand-text">
              <h1>MaizeFit</h1>
              <p>Sistem Pakar Kelayakan Lahan Jagung</p>
            </div>
          </div>

          {/* Fitur */}
          <div className="login-feature-wrapper">
            <p className="login-feature-lead">
              Solusi cerdas untuk analisis dan evaluasi kesesuaian lahan tanaman
              jagung berbasis data geospasial dan metode pakar.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <div className="feature-icon">
                  <Leaf size={20} />
                </div>
                <div>
                  <strong>Analisis Akurat</strong>
                  <span>
                    Penilaian lahan dengan parameter ilmiah dan terpercaya
                  </span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <strong>Meningkatkan Produktivitas</strong>
                  <span>
                    Rekomendasi berbasis data untuk hasil panen lebih baik
                  </span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong>Mudah Digunakan</strong>
                  <span>Akses cepat dari mana saja dan kapan saja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ilustrasi footer */}
          <div className="login-bottom-decoration">
            <img
              src="/assets/footer.png"
              alt=""
              className="login-footer-image"
            />
          </div>
        </section>

        {/* ===================== PANEL KANAN ===================== */}
        <section className="login-form-panel">
          <div className="login-form-container">
            {/* Logo kecil (hanya tampil di mobile) */}
            <div className="login-form-logo">
              <img
                src="/assets/logo.png"
                alt="Logo MaizeFit"
                className="login-logo-image"
              />
              <span>MaizeFit</span>
            </div>

            {/* Judul */}
            <div className="login-form-header">
              <h2>Selamat Datang Kembali</h2>
              <p>Masuk ke akun Anda untuk melanjutkan ke sistem MaizeFit.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <UserRound className="input-icon-svg" size={18} />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Masukkan username"
                    autoComplete="username"
                    defaultValue={rememberedUsername}
                    required
                    onChange={() => setError("")}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <LockKeyhole className="input-icon-svg" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    defaultValue={rememberedPassword}
                    autoComplete="current-password"
                    required
                    onChange={() => setError("")}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Opsi bawah */}
              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="custom-check">
                    {rememberMe && <Check size={11} />}
                  </span>
                  <span>Ingat saya</span>
                </label>

                <span className="login-demo-hint">
                  Demo: <strong>admin / admin123</strong>
                </span>
              </div>

              {/* Error */}
              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="login-submit">
                <LogIn size={18} />
                <span>Masuk</span>
              </button>

              {/* Link register */}
              <div className="login-register-link">
                Belum punya akun? <Link to="/register">Daftar sekarang</Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
