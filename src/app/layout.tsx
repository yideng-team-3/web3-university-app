import type { Metadata } from 'next';
import { LanguageProvider } from '@components/language/Context';
import { Web3Providers } from '@components/wallet/Providers';

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import MainLayout from '@/components/common/MainLayout';
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: 'Web3 University',
  description: 'A Web3 learning platform with cyberpunk style',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Web3Providers>
            <MainLayout>{children}</MainLayout>
            </Web3Providers>
            <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}