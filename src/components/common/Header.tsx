'use client';
import React from 'react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/components/common/LanguageContext';

const Header = () => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 部分 */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="8" fill="#4F46E5" />
                  <path d="M10 15L20 10L30 15L20 20L10 15Z" fill="white" />
                  <path d="M15 18V25L20 27.5L25 25V18" stroke="white" strokeWidth="1.5" />
                  <path d="M20 20V27.5" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <span className="text-gray-900 font-medium text-xl">Web3 University</span>
              </div>
            </a>
          </div>

          {/* 中间导航部分 */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/"
              className="px-1 py-2 text-gray-600 font-medium text-sm hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
            >
              {t('nav.home')}
            </a>
            <a 
              href="/knowledge"
              className="px-1 py-2 text-gray-600 font-medium text-sm hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
            >
              {t('nav.knowledgeBase')}
            </a>
            <a 
              href="/videos"
              className="px-1 py-2 text-gray-600 font-medium text-sm hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
            >
              {t('nav.videos')}
            </a>
          </nav>

          {/* 右侧操作区: 语言切换 + 钱包连接按钮 */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('button.connectWallet')}
            </button>
          </div>

          {/* 移动端菜单按钮 - 仅在小屏幕显示 */}
          <div className="md:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;