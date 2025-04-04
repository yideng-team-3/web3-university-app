'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@components/language/Context';
import MainLayout from '@components/common/MainLayout';
import ParticlesBackground from '@components/effects/ParticlesBackground';
import CursorTracker from '@components/effects/CursorTracker';
import YiDengCoinChart from '@components/charts/YiDengCoinChart';
import Link from 'next/link';
import { CircleDollarSign, TrendingUp, Bookmark, BookOpen } from 'lucide-react';

const MarketPage = () => {
  const { t } = useLanguage();
  const [selectedCoin, setSelectedCoin] = useState('yideng');
  
  // Add cyber styling to body
  useEffect(() => {
    document.body.classList.add('cyberpunk-theme');
    
    return () => {
      document.body.classList.remove('cyberpunk-theme');
    };
  }, []);
  
  // 模拟虚拟货币列表
  const mockCoins = [
    { id: 'yideng', name: 'YIDENG COIN', symbol: 'YDC', price: 270.23, change: -12.43 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3244.56, change: 2.41 },
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 62487.98, change: 1.23 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 157.32, change: 5.67 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.457, change: -2.34 },
  ];
  
  return (
    <MainLayout>
      {/* Background effects */}
      <ParticlesBackground />
      <CursorTracker />
      
      {/* Cyberpunk grid overlay */}
      <div className="cyber-grid"></div>
      
      {/* Hero section */}
      <section className="relative bg-dark-bg cyberpunk-overlay text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="cyberpunk-title text-4xl md:text-5xl font-bold mb-4" data-text={t('market.title')}>
              {t('market.title')}
            </h1>
            <p className="cyberpunk-glow text-lg md:text-xl mb-8 text-neon-blue max-w-3xl mx-auto">
              {t('market.subtitle')}
            </p>
          </div>
          
          {/* Market Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="cyberpunk-card p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue bg-opacity-20 flex items-center justify-center">
                  <CircleDollarSign className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('market.stats.marketCap')}</p>
                  <p className="text-white font-semibold">$2.67T</p>
                </div>
              </div>
            </div>
            <div className="cyberpunk-card p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-neon-pink bg-opacity-20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-neon-pink" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('market.stats.tradingVolume')}</p>
                  <p className="text-white font-semibold">$89.4B</p>
                </div>
              </div>
            </div>
            <div className="cyberpunk-card p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-neon-green bg-opacity-20 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('market.stats.totalCoins')}</p>
                  <p className="text-white font-semibold">12,453</p>
                </div>
              </div>
            </div>
            <div className="cyberpunk-card p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-neon-purple bg-opacity-20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('market.stats.exchanges')}</p>
                  <p className="text-white font-semibold">347</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main market content */}
      <section className="bg-darker-bg py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Coin List */}
            <div className="lg:col-span-1">
              <div className="cyberpunk-card p-4 rounded-lg sticky top-24">
                <h3 className="text-xl font-bold text-neon-blue mb-4">{t('market.popularCoins')}</h3>
                <div className="space-y-2">
                  {mockCoins.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => setSelectedCoin(coin.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${
                        selectedCoin === coin.id 
                          ? 'bg-neon-blue bg-opacity-10 border border-neon-blue' 
                          : 'border border-transparent hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 mr-3 flex items-center justify-center text-xs font-mono">
                          {coin.symbol}
                        </div>
                        <div>
                          <p className="text-white font-medium">{coin.name}</p>
                          <p className="text-gray-400 text-xs">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono">${coin.price.toLocaleString()}</p>
                        <p className={`text-xs ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {coin.change >= 0 ? '+' : ''}{coin.change}%
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-neon-pink mb-3">{t('market.learningResources')}</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/knowledge/crypto-basics" className="text-gray-400 hover:text-neon-blue transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('market.cryptoBasics')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/trading-strategies" className="text-gray-400 hover:text-neon-blue transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {t('market.tradingStrategies')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge/defi-explained" className="text-gray-400 hover:text-neon-blue transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {t('market.defiExplained')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Main content - Chart */}
            <div className="lg:col-span-3">
              <div className="cyberpunk-card p-4 rounded-lg h-full">
                <div className="h-[600px]">
                  <YiDengCoinChart />
                </div>
                
                {/* Coin Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">{t('market.coinInfo')}</h3>
                    <p className="text-gray-400 mb-4">
                      YIDENG COIN (YDC) 是Web3 University生态系统中的功能型代币，用于支付课程、奖励学习成果以及参与社区治理。通过持有YDC，用户可以获得平台独家内容的访问权限，以及参与决策投票的权力。
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-sm">总供应量</p>
                        <p className="text-white font-semibold">21,000,000 YDC</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">流通量</p>
                        <p className="text-white font-semibold">8,456,234 YDC</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">上线日期</p>
                        <p className="text-white font-semibold">2023-09-15</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">白皮书</p>
                        <Link href="#" className="text-neon-blue hover:underline">查看白皮书</Link>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-neon-pink mb-4">{t('market.simulationTrading')}</h3>
                    <div className="bg-darker-bg p-4 rounded-lg border border-gray-700">
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">{t('market.currentPrice')}</p>
                        <p className="text-white font-semibold text-2xl font-mono">$270.23</p>
                      </div>
                      <div className="flex space-x-2 mb-4">
                        <button className="flex-1 bg-neon-green bg-opacity-20 hover:bg-opacity-30 text-neon-green py-2 rounded-md border border-neon-green transition-colors">
                          {t('market.buy')}
                        </button>
                        <button className="flex-1 bg-neon-pink bg-opacity-20 hover:bg-opacity-30 text-neon-pink py-2 rounded-md border border-neon-pink transition-colors">
                          {t('market.sell')}
                        </button>
                      </div>
                      <div className="text-center text-gray-400 text-sm">
                        <p>{t('market.loginToTrade')}</p>
                        <Link href="/login" className="text-neon-blue hover:underline mt-2 inline-block">
                          {t('market.loginRegister')}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-darker-bg p-4 rounded-lg border border-gray-700">
                      <h4 className="text-lg font-semibold text-white mb-3">{t('market.marketAnalysis')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('market.support')} 1</span>
                          <span className="text-white font-mono">$252.40</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('market.support')} 2</span>
                          <span className="text-white font-mono">$238.75</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('market.resistance')} 1</span>
                          <span className="text-white font-mono">$285.60</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('market.resistance')} 2</span>
                          <span className="text-white font-mono">$305.12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related News Section */}
      <section className="bg-dark-bg py-12 border-t border-neon-blue border-opacity-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="cyberpunk-title text-2xl font-bold mb-8" data-text={t('market.relatedNews')}>
            {t('market.relatedNews')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="cyberpunk-card p-4 rounded-lg">
                <div className="text-xs text-neon-blue mb-2">2023-12-{10 + item}</div>
                <h3 className="text-lg font-semibold text-white mb-2">加密货币市场周分析：波动加剧，机构入场</h3>
                <p className="text-gray-400 text-sm mb-3">
                  本周比特币价格经历了显著波动，从高点回落后又有所反弹。与此同时，更多的机构投资者正在进入这一市场...
                </p>
                <Link href="#" className="text-neon-pink hover:underline text-sm inline-flex items-center">
                  {t('market.readMore')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default MarketPage;