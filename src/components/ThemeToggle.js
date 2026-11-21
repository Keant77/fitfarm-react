import React from "react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        padding: "8px 14px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        background: "var(--surface)",
        color: "var(--text-primary)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
      aria-label="Toggle Theme"
    >
      <span>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;
