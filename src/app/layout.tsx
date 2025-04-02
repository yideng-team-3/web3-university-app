import type { Metadata } from "next";
import { Geist, Geist_Mono as GeistMono, Rajdhani } from "next/font/google";
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

// 添加赛博朋克风格所需的字体
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Share Tech Mono不在next/font/google中，我们可以通过CSS导入，或者使用其他字体代替
// 这里我们暂时使用Geist Mono作为替代

export const metadata: Metadata = {
  title: "web3-university",
  description: "A defi app for web3-university with cyberpunk style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 由于Share Tech Mono不在next/font中，通过link标签导入 */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased`}
      >
        <LanguageProvider>
          <Web3Providers>{children}</Web3Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}