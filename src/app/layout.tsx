import React from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./styles/globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import ThemeClient from "./styles/ThemeClient";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "./styles/ThemeContext";
import { getCurrentUser } from "../actions/getCurrentUser";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culturin | Where Inspiration Meets Exploration",
  description: "Travel, Culture, and Inspiration Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  // const currentUser = await getCurrentUser();
  // console.log("user prisma", currentUser);
  // Toggle Theme

  return (
    <ThemeProvider>
      <html lang="en">
        <body className={inter.className}>
          {clerkPublishableKey ? (
            <ClerkProvider publishableKey={clerkPublishableKey}>
              <SessionProvider session={session}>
                <ThemeClient>
                  {children} <Analytics /> <SpeedInsights />
                </ThemeClient>
              </SessionProvider>
            </ClerkProvider>
          ) : (
            <SessionProvider session={session}>
              <ThemeClient>
                {children} <Analytics /> <SpeedInsights />
              </ThemeClient>
            </SessionProvider>
          )}
        </body>
      </html>
    </ThemeProvider>
  );
}
