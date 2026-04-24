"use client";

import React from "react";
import { ThemeProvider } from "styled-components";

import PageTransition from "../components/PageTransition";
import { darkTheme, lightTheme } from "./theme";
import { useTheme } from "./ThemeContext";

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const scTheme = mode === "dark" ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={scTheme}>
      <PageTransition>{children}</PageTransition>
    </ThemeProvider>
  );
}
