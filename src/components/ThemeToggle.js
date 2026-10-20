import React from "react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
    isDark,
  } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      style={{
        padding: "8px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        cursor: "pointer",
      }}
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;