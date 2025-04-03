import type { Metadata } from "next";
import { Geist, Geist_Mono as GeistMono, Rajdhani, Share_Tech_Mono as ShareTechMono } from "next/font/google";
import { LanguageProvider } from "@components/language/Context";
import { Web3Providers } from "@components/wallet/Providers";
import NavigationEventsHandler from "@components/common/NavigationEventsHandler";

import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

// 导入字体并配置预加载
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

// 添加赛博朋克风格所需的字体
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

// 加载 Share Tech Mono 字体（使用 Google Fonts）
const shareTechMono = ShareTechMono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} ${shareTechMono.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          <Web3Providers>
            {/* 添加路由事件监听器 */}
            <NavigationEventsHandler />
            {children}
          </Web3Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}