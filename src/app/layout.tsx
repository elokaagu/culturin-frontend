"use client";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import "./styles/globals.css";
import * as React from "react";
import { Session } from "inspector";

// 1. import `NextUIProvider` component

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  params: { session, ...params },
}: {
  children: React.ReactNode;
  params: any; // Replace 'any' with the appropriate type for 'params'
}) {
  return (
    <html lang="en">
      <head>
        <title>Culturin | Where Inspiration Meets Exploration</title>
        <meta
          name="description"
          content="Where Inspiration Meets Exploration"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children} <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
