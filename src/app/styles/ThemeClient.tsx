"use client";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./theme";
import React, { useState } from "react";
import Header from "../components/Header";

export default function ThemeClient({
  children,
}: // theme,
// toggleTheme,
{
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");

  const isDarkTheme = theme === "dark";

  // Toggle Theme

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyles />
      {/* <Header toggleTheme={toggleTheme} /> */}
      {children}
    </ThemeProvider>
  );
}
