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
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(
    () => !localStorage.getItem("maizefit_remembered_username")
  );

  const [rememberedUsername] = useState(
    () => localStorage.getItem("maizefit_remembered_username") || "admin"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    let result;
    if (onLogin) {
      const ok = onLogin(username, password);
      result = { success: ok, message: ok ? "" : "Username atau password salah!" };
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
      } else {
        localStorage.removeItem("maizefit_remembered_username");
      }

      showToast("Selamat datang kembali di MaizeFit!", "success");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-decoration login-decoration-top" />
      <div className="login-page-decoration login-decoration-bottom" />

      <div className="login-card">
        {/* PANEL KIRI */}
        <section className="login-info">
          <div className="login-top-shape" />

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

          <div className="login-feature-wrapper">
            <p className="login-feature-lead">
              Solusi cerdas untuk analisis dan evaluasi kesesuaian lahan tanaman
              jagung berbasis data geospasial & metode pakar.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <div className="feature-icon">
                  <Leaf size={22} />
                </div>
                <div>
                  <strong>Analisis Akurat</strong>
                  <span>Penilaian lahan dengan parameter ilmiah dan terpercaya</span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <strong>Meningkatkan Produktivitas</strong>
                  <span>Rekomendasi berbasis data untuk hasil panen lebih baik</span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <MapPin size={22} />
                </div>
                <div>
                  <strong>Mudah Digunakan</strong>
                  <span>Akses cepat dari mana saja dan kapan saja</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-bottom-decoration">
            <img src="/assets/footer.png" alt="" className="login-footer-image" />
          </div>
        </section>

        {/* PANEL KANAN */}
        <section className="login-form-panel">
          <div className="login-form-container">
            <div className="login-form-logo">
              <img
                src="/assets/logo.png"
                alt="Logo MaizeFit"
                className="login-logo-image"
              />
              <span>MaizeFit</span>
            </div>

            <div className="login-form-header">
              <h2>Selamat Datang Kembali</h2>
              <p>
                Masuk ke akun Anda untuk melanjutkan ke sistem MaizeFit.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email atau Username</label>
                <div className="input-wrapper">
                  <UserRound className="input-icon-svg" size={20} />
                  <input
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

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <LockKeyhole className="input-icon-svg" size={20} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    defaultValue="admin123"
                    required
                    onChange={() => setError("")}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0 8px",
                      display: "flex",
                      alignItems: "center",
                      color: "var(--text-hint)",
                    }}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="custom-check">
                    {rememberMe && <Check size={13} />}
                  </span>
                  <span>Ingat saya</span>
                </label>

                <span style={{ fontSize: "12px", color: "var(--text-hint)" }}>
                  Demo: <strong>admin / admin123</strong>
                </span>
              </div>

              {error && <div className="login-error">{error}</div>}

              <Button type="submit" className="login-submit">
                <LogIn size={19} />
                <span>Masuk</span>
              </Button>

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "var(--primary)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Daftar sekarang
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
