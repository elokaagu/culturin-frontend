import React from "react";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import { Metadata, type Viewport } from "next";

import { createSupabaseServerClient } from "../lib/supabase/server";
import SupabaseAuthProvider from "./components/SupabaseAuthProvider";
import ViewTransitionsRoot from "./components/ViewTransitionsRoot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "./styles/ThemeContext";

const themeInitScript = `(function(){try{var k='culturin-theme';var v=localStorage.getItem(k);var r=document.documentElement;if(v==='light')r.classList.remove('dark');else r.classList.add('dark');}catch(e){}})();`;

const GA_MEASUREMENT_ID = "G-WXNRNB0VXV";

const twkEverett = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../../public/fonts/TWKEverett-Light copy.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/TWKEverett-Book copy.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/TWKEverett-Medium copy.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/TWKEverett-Bold copy.ttf", weight: "700", style: "normal" },
  ],
});

const recoleta = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/Recoleta Regular copy.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Recoleta Medium copy.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Recoleta SemiBold copy.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Recoleta Bold copy.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Culturin | A House",
  description:
    "Culturin is a house of founders, operators, artists, and cultural leaders. Brands come to us for cultural marketing — launching in new territories, and connecting with cultural intelligence.",
  icons: {
    icon: [{ url: "/culturin_icon_black.png", type: "image/png" }],
    shortcut: "/culturin_icon_black.png",
    apple: "/culturin_icon_black.png",
  },
};

/** Device width + safe areas (notch / home indicator) for mobile browsers. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      <body
        className={`${twkEverett.variable} ${recoleta.variable} font-sans`}
      >
        <Script id="culturin-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <ThemeProvider>
          <SupabaseAuthProvider initialUser={initialUser}>
            <ViewTransitionsRoot>
              {children}
              <Analytics />
              <SpeedInsights />
            </ViewTransitionsRoot>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
