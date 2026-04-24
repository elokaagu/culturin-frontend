"use client";

import React from "react";

import PageTransition from "../components/PageTransition";

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
