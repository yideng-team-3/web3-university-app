'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import { useLanguage } from '@/components/common/LanguageContext';
import WalletAuthListener from '@/components/wallet/WalletAuthListener';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletAuthListener />
      <Header />
      
      {/* 主要内容区域 */}
      <main>
        {children}
      </main>
      
      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.about')}</h3>
              <p className="text-gray-400">
                {t('footer.aboutDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">{t('footer.home')}</Link></li>
                <li><Link href="/courses" className="text-gray-400 hover:text-white">{t('footer.courses')}</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">{t('footer.about')}</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.email')}</li>
                <li>{t('footer.phone')}</li>
                <li>{t('footer.address')}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <Link key={social} href={`https://${social}.com`} className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;