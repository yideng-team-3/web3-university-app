import type { Metadata } from "next";
import { Geist, Geist_Mono as GeistMono } from "next/font/google";
import { LanguageProvider } from "@/components/common/LanguageContext";
import { Web3Providers } from "@/components/wallet/Providers";

import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "web3-university",
  description: "A defi app for web3-university",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Web3Providers>{children}</Web3Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
