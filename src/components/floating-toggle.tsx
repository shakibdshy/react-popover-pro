"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function FloatingToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      {theme === "light" ? (
        <button onClick={() => setTheme("dark")}>
          <Sun />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <Moon />
        </button>
      )}
    </div>
  );
}
