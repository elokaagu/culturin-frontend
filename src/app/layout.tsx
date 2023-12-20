import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import * as React from "react";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { Metadata } from "next";

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

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <>
            {children} <Analytics />
          </>
        </SessionProvider>
      </body>
    </html>
  );
}
