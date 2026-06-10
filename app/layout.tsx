import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayoutShell from "@/components/layout/app-layout-shell";
import { LanguageProvider } from "@/lib/language-context";
import { SecurityProvider } from "@/lib/security-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FactoryOS Mockup - Unified Business Operating System",
  description: "Interactive prototype of a unified operating system for factory operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-slate-50 font-sans">
        <LanguageProvider>
          <SecurityProvider>
            <AppLayoutShell>{children}</AppLayoutShell>
          </SecurityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
