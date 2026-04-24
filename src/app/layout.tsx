import React from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import { Metadata } from "next";

import { createSupabaseServerClient } from "../lib/supabase/server";
import SupabaseAuthProvider from "./components/SupabaseAuthProvider";
import ThemeClient from "./styles/ThemeClient";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "./styles/ThemeContext";

const themeInitScript = `(function(){try{var k='culturin-theme';var v=localStorage.getItem(k);var r=document.documentElement;if(v==='light')r.classList.remove('dark');else r.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culturin | Where Inspiration Meets Exploration",
  description: "Travel, Culture, and Inspiration Platform",
  icons: {
    icon: [{ url: "/culturin_logo.svg", type: "image/svg+xml" }],
    shortcut: "/culturin_logo.svg",
    apple: "/culturin_logo.svg",
  },
};

async function getInitialAuthUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getInitialAuthUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="culturin-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <SupabaseAuthProvider initialUser={initialUser}>
            <ThemeClient>
              {children} <Analytics /> <SpeedInsights />
            </ThemeClient>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
