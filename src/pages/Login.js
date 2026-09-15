import { useState } from "react";
import { Button } from "../components/ui/button";

function Login({ onLogin }) {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const berhasil = onLogin(username, password);

    if (!berhasil) {
      setError("Username atau password salah!");
    } else {
      setError("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">
          <h1>FITFARM</h1>
          <p>Login Admin</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="form-group">
            <label>Username</label>

            <input
              name="username"
              type="text"
              placeholder="Masukkan username"
              required
              onChange={() => setError("")}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Masukkan password"
              required
              onChange={() => setError("")}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
          <div className="login-error">
           {error}
          </div>
          )}

          {/* LOGIN BUTTON */}
          <Button type="submit">
            Login
          </Button>

        </form>

      </div>
    </div>
  );
}

export default Login;