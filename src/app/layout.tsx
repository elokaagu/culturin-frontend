import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import React from "react";
import ThemeClient from "./styles/ThemeClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culturin",
  description: "Where Inspiration Meets Exploration",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Toggle Theme

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeClient>
            {children} <Analytics />
          </ThemeClient>
        </SessionProvider>
      </body>
    </html>
  );
}
