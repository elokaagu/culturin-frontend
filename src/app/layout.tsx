import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import React from "react";
import ThemeClient from "./styles/ThemeClient";
import Navbar from "./components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";

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

  if (!session) {
    console.log(session);
  }

  // Toggle Theme

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeClient>
            {children} <Analytics /> <SpeedInsights />
          </ThemeClient>
        </SessionProvider>
      </body>
    </html>
  );
}
