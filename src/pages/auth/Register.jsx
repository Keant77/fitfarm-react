import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  BarChart3,
  MapPin,
  UserRound,
  LockKeyhole,
  UserCheck,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

export function Register({ onRegister, onLogin }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useNotification();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      showToast("Password dan Konfirmasi Password tidak cocok!", "error");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      showToast("Password minimal 6 karakter!", "warning");
      return;
    }

    if (onRegister) {
      onRegister();
      return;
    }

    const res = await register({
      name,
      username,
      password,
    });

    if (!res.success) {
      setError(res.message || "Gagal mendaftar.");
      showToast(res.message || "Gagal mendaftar.", "error");
    } else {
      setError("");
      setSuccess(true);
      showToast("Pendaftaran akun berhasil! Mengalihkan ke login...", "success");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
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
              Bergabung bersama MaizeFit untuk mengoptimalkan potensi lahan
              pertanian jagung Anda dengan teknologi pakar modern.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <div className="feature-icon">
                  <Leaf size={22} />
                </div>
                <div>
                  <strong>Daftar Gratis</strong>
                  <span>Akses fitur evaluasi lahan jagung secara cepat</span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <strong>Riwayat Penilaian</strong>
                  <span>Simpan dan pantau perkembangan lahan pertanian</span>
                </div>
              </div>

              <div className="login-feature">
                <div className="feature-icon">
                  <MapPin size={22} />
                </div>
                <div>
                  <strong>Pemetaan Spasial</strong>
                  <span>Visualisasi peta sebaran lahan di wilayah Jember</span>
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
              <h2>Buat Akun Baru</h2>
              <p>Daftarkan diri Anda untuk mulai menggunakan MaizeFit.</p>
            </div>

            {success ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(22, 163, 74, 0.15)",
                  color: "#16a34a",
                  textAlign: "center",
                  fontWeight: 600,
                  marginBottom: "20px",
                }}
              >
                Pendaftaran berhasil! Mengalihkan ke halaman login...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <div className="input-wrapper">
                    <UserCheck className="input-icon-svg" size={20} />
                    <input
                      name="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <div className="input-wrapper">
                    <UserRound className="input-icon-svg" size={20} />
                    <input
                      name="username"
                      type="text"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <LockKeyhole className="input-icon-svg" size={20} />
                    <input
                      name="password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Konfirmasi Password</label>
                  <div className="input-wrapper">
                    <LockKeyhole className="input-icon-svg" size={20} />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      required
                    />
                  </div>
                </div>

                {error && <div className="login-error">{error}</div>}

                <Button type="submit" className="login-submit">
                  <span>Daftar Akun</span>
                </Button>

                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Sudah punya akun?{" "}
                  {onLogin ? (
                    <button
                      type="button"
                      onClick={onLogin}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Masuk
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      style={{
                        color: "var(--primary)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Masuk
                    </Link>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
