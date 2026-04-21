"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./theme";

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  // Temporary bridge: keep styled-components pages working while migrating to Tailwind.
  // Prefer Tailwind + removing styled-components over time.
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
