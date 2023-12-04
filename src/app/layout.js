import { Inter } from "next/font/google";
import "./globals.css";

import * as React from "react";

// 1. import `NextUIProvider` component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Culturin | Where Inspiration Meets Exploration",
  description: "Where Inspiration Meets Exploration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
