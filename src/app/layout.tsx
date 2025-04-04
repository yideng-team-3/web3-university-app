import type { Metadata } from "next";
import { Geist, Geist_Mono as GeistMono, Rajdhani, Share_Tech_Mono as ShareTechMono } from "next/font/google";
import { LanguageProvider } from "@components/language/Context";
import { Web3Providers } from "@components/wallet/Providers";

import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

// Import fonts and configure preloading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Add cyberpunk style fonts
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

// Load Share Tech Mono font (from Google Fonts)
const shareTechMono = ShareTechMono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Web3 University",
  description: "A Web3 learning platform with cyberpunk style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          <Web3Providers>
            {children}
          </Web3Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}