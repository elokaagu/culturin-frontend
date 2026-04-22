"use client";

import React from "react";
import { Sun, Moon } from "styled-icons/boxicons-regular";
import { useTheme } from "../styles/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-neutral-800 focus:outline-none dark:text-white [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:[&_svg]:scale-110"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
