'use client';
import React from 'react';
import Header from '@/components/common/Header';
import { useLanguage } from '@/components/common/LanguageContext';
import CourseSection from '@/components/CourseSection';
import Image from 'next/image';
import Link from 'next/link';

const LocalizedHomePage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 英雄区块 */}
      <section className="bg-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('hero.welcome')}</h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100">{t('hero.subtitle')}</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses" className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-gray-100 transition-colors">
                  {t('hero.browseCourses')}
                </Link>
                <Link href="/resources" className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-indigo-600 transition-colors">
                  {t('hero.resources')}
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/api/placeholder/600/400" 
                alt="Learning Blockchain" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      <CourseSection />
      
      {/* 统计数据 */}
      <section className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('stats.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('stats.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">5000+</div>
              <div className="text-lg text-gray-600">{t('stats.students')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-lg text-gray-600">{t('stats.courses')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">30+</div>
              <div className="text-lg text-gray-600">{t('stats.instructors')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-lg text-gray-600">{t('stats.employmentRate')}</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 学员评价 */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 评价卡片 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  L
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">李明</h4>
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Web3 University的课程非常实用，讲师都是行业专家，让我在短时间内掌握了智能合约开发技能，现在我已经在一家区块链公司工作了。"
              </p>
            </div>
            
            {/* 评价卡片 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  Z
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">张伟</h4>
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "作为一名传统金融从业者，我通过Web3 University的课程顺利转型到了区块链行业。课程内容深入浅出，特别适合想要转行的人。"
              </p>
            </div>
            
            {/* 评价卡片 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  W
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">王芳</h4>
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Web3 University提供的DeFi课程非常全面，从基础概念到高级策略都有详细讲解。学习体验很好，随时可以与讲师互动提问。"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 合作伙伴 */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partners.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('partners.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 flex items-center">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 学习资源区块 */}
      <section className="bg-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('resources.title')}</h2>
            <p className="text-lg mb-8">
              {t('resources.subtitle')}
            </p>
            <div className="flex justify-center">
              <Link href="/resources" className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-gray-100 transition-colors">
                {t('resources.browse')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
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

export default LocalizedHomePage;