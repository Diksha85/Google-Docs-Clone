// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to body and save to localStorage
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        backgroundColor: theme === "light" ? "#333" : "#eee",
        color: theme === "light" ? "#fff" : "#000",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
      }}
    >
      {theme === "light" ? (
        <>
          <FaMoon /> Dark
        </>
      ) : (
        <>
          <FaSun /> Light
        </>
      )}
    </button>
  );
}
