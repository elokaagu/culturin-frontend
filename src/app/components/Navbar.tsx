"use client";
import React from "react";

export default function Navbar({
  onToggleTheme,
}: {
  onToggleTheme: () => void;
}) {
  return (
    <>
      <h1>Hello</h1>
      <button onClick={onToggleTheme}>Toggle Theme</button>
    </>
  );
}
