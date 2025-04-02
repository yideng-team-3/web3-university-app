'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@components/common/LanguageContext';
import Link from 'next/link';
import MainLayout from '@components/common/MainLayout';
import ParticlesBackground from '@components/effects/ParticlesBackground';
import CursorTracker from '@components/effects/CursorTracker';
import YiDengCoinChart from '@components/charts/YiDengCoinChart';

const CyberpunkHomePage = () => {
  const { t } = useLanguage();
  
  // Add cyber styling to body
  useEffect(() => {
    document.body.classList.add('cyberpunk-theme');
    
    return () => {
      document.body.classList.remove('cyberpunk-theme');
    };
  }, []);
  
  return (
    <MainLayout>
      {/* Background effects */}
      <ParticlesBackground />
      <CursorTracker />
      
      {/* Cyberpunk grid overlay */}
      <div className="cyber-grid"></div>
      
      {/* Hero section */}
      <section className="relative bg-dark-bg cyberpunk-overlay text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="cyberpunk-title text-4xl md:text-5xl font-bold mb-4" data-text={t('hero.welcome')}>
                {t('hero.welcome')}
              </h1>
              <p className="cyberpunk-glow text-lg md:text-xl mb-8 text-neon-blue">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/courses" 
                  className="cyberpunk-button px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {t('hero.browseCourses')}
                </Link>
                <Link 
                  href="/resources" 
                  className="cyberpunk-button px-6 py-3 rounded-md transition-colors"
                >
                  {t('hero.resources')}
                </Link>
              </div>
            </div>
            <div className="hidden md:block cyberpunk-border p-1 rounded-lg">
              <div className="bg-darker-bg p-2 rounded-lg">
                <YiDengCoinChart />
              </div>
            </div>
          </div>
        </div>
        
        {/* Diagonal divider */}
        <div className="h-16 relative overflow-hidden">
          <div 
            className="absolute inset-0" 
            style={{ 
              background: 'linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-bg) 50%, var(--darker-bg) 50%, var(--darker-bg) 100%)',
              boxShadow: '0 -10px 20px rgba(5, 217, 232, 0.1)'
            }}
          ></div>
        </div>
      </section>
      
      {/* Course section with cyberpunk styling */}
      <section className="bg-darker-bg relative py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="cyberpunk-title text-3xl font-bold mb-8 text-center" data-text={t('courses.title')}>
            {t('courses.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 课程卡片示例 */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="cyberpunk-card rounded-lg overflow-hidden transition-transform hover:translate-y-[-4px]">
                <div className="h-48 bg-indigo-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 right-4 bg-neon-pink text-white px-2 py-1 text-xs rounded-md">
                    热门
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-neon-blue mb-2">区块链高级开发课程 {item}</h3>
                  <p className="text-gray-400 mb-4">掌握智能合约开发、DeFi协议架构和安全审计技能，成为区块链专业开发者。</p>
                  <div className="flex justify-between items-center">
                    <span className="text-neon-green font-semibold">¥{1999 + item * 1000}</span>
                    <button className="cyberpunk-button px-3 py-1 text-sm rounded">
                      立即学习
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/courses" className="cyberpunk-button px-6 py-3 rounded-md inline-block">
              查看全部课程
            </Link>
          </div>
        </div>
      </section>
      
      {/* 统计数据 */}
      <section className="bg-dark-bg py-16 relative overflow-hidden cyberpunk-overlay">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="cyberpunk-title text-3xl font-bold mb-4" data-text={t('stats.title')}>
              {t('stats.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('stats.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="cyberpunk-card p-6 rounded-lg">
              <div className="text-4xl font-bold text-neon-pink mb-2 cyberpunk-glow">5000+</div>
              <div className="text-gray-400">{t('stats.students')}</div>
            </div>
            <div className="cyberpunk-card p-6 rounded-lg">
              <div className="text-4xl font-bold text-neon-blue mb-2 cyberpunk-glow">50+</div>
              <div className="text-gray-400">{t('stats.courses')}</div>
            </div>
            <div className="cyberpunk-card p-6 rounded-lg">
              <div className="text-4xl font-bold text-neon-purple mb-2 cyberpunk-glow">30+</div>
              <div className="text-gray-400">{t('stats.instructors')}</div>
            </div>
            <div className="cyberpunk-card p-6 rounded-lg">
              <div className="text-4xl font-bold text-neon-green mb-2 cyberpunk-glow">95%</div>
              <div className="text-gray-400">{t('stats.employmentRate')}</div>
            </div>
          </div>
        </div>
        
        {/* 背景装饰元素 */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-neon-purple opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-neon-blue opacity-20 rounded-full blur-3xl"></div>
      </section>
      
      {/* 学员评价 */}
      <section className="bg-darker-bg py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="cyberpunk-title text-3xl font-bold mb-4" data-text={t('testimonials.title')}>
              {t('testimonials.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 评价卡片 1 */}
            <div className="cyberpunk-card p-6 rounded-lg relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white">
                "
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                  李
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">李明</h4>
                  <div className="text-neon-pink flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">
                "Web3 University的课程非常实用，讲师都是行业专家，让我在短时间内掌握了智能合约开发技能，现在我已经在一家区块链公司工作了。"
              </p>
            </div>
            
            {/* 评价卡片 2 */}
            <div className="cyberpunk-card p-6 rounded-lg relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white">
                "
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neon-green rounded-full flex items-center justify-center text-white font-bold text-xl">
                  张
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">张伟</h4>
                  <div className="text-neon-pink flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">
                "作为一名传统金融从业者，我通过Web3 University的课程顺利转型到了区块链行业。课程内容深入浅出，特别适合想要转行的人。"
              </p>
            </div>
            
            {/* 评价卡片 3 */}
            <div className="cyberpunk-card p-6 rounded-lg relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white">
                "
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                  王
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">王芳</h4>
                  <div className="text-neon-pink flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">
                "Web3 University提供的DeFi课程非常全面，从基础概念到高级策略都有详细讲解。学习体验很好，随时可以与讲师互动提问。"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 合作伙伴 */}
      <section className="bg-dark-bg py-16 border-t border-neon-blue border-opacity-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="cyberpunk-title text-3xl font-bold mb-4" data-text={t('partners.title')}>
              {t('partners.title')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('partners.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 flex items-center">
                <div className="h-10 w-32 bg-gradient-to-r from-neon-blue to-neon-purple opacity-30 rounded cyberpunk-border"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 学习资源区块 */}
      <section className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="cyberpunk-title text-3xl font-bold mb-4" data-text={t('resources.title')}>
              {t('resources.title')}
            </h2>
            <p className="text-neon-blue text-lg mb-8 cyberpunk-glow">
              {t('resources.subtitle')}
            </p>
            <div className="flex justify-center">
              <Link 
                href="/resources" 
                className="cyberpunk-button px-6 py-3 rounded-md"
              >
                {t('resources.browse')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* 背景网格装饰 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, var(--neon-purple) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}></div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CyberpunkHomePage;