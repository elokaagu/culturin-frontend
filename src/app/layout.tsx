import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";

import "./styles/globals.css";

import * as React from "react";
import { Session } from "inspector";

// 1. import `NextUIProvider` component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Culturin | Where Inspiration Meets Exploration",
  description: "Where Inspiration Meets Exploration",
};

export default function RootLayout({
  children,
  params: { session, ...params },
}: {
  children: React.ReactNode;
  params: any; // Replace 'any' with the appropriate type for 'params'
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children} <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
