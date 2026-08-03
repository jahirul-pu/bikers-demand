"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = (localStorage.getItem("bd_theme") as "dark" | "light") || "light";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } catch {
      // Fallback
    }

    const handleThemeChange = () => {
      const current = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "light";
      setTheme(current);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("bd_theme", nextTheme);
      window.dispatchEvent(new Event("themechange"));
    } catch {
      // Fallback
    }
  };

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-full text-steel hover:text-off-white hover:bg-asphalt-2/80 transition-colors flex items-center justify-center cursor-pointer"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-plate-yellow hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
