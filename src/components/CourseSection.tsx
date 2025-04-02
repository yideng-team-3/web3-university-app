import React from 'react';
import { useLanguage } from '@components/common/LanguageContext';
import Link from 'next/link';

interface CourseSectionProps {
  className?: string;
}

const CourseSection: React.FC<CourseSectionProps> = ({ className = '' }) => {
  const { t } = useLanguage();

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('courses.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 课程卡片 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-indigo-200 flex items-center justify-center">
              <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100 mb-2">
                {t('courses.level.beginner')}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('courses.blockchain.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('courses.blockchain.desc')}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-medium">8 {t('courses.lessons')}</span>
                <Link href="/course/blockchain-basics" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  {t('courses.learnMore')} &rarr;
                </Link>
              </div>
            </div>
          </div>
          
          {/* 课程卡片 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-indigo-200 flex items-center justify-center">
              <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100 mb-2">
                {t('courses.level.intermediate')}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('courses.smartContract.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('courses.smartContract.desc')}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-medium">12 {t('courses.lessons')}</span>
                <Link href="/course/smart-contracts" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  {t('courses.learnMore')} &rarr;
                </Link>
              </div>
            </div>
          </div>
          
          {/* 课程卡片 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
            <div className="h-48 bg-indigo-200 flex items-center justify-center">
              <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"></path>
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"></path>
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"></path>
              </svg>
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100 mb-2">
                {t('courses.level.advanced')}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('courses.defi.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('courses.defi.desc')}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-medium">15 {t('courses.lessons')}</span>
                <Link href="/course/defi-analysis" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  {t('courses.learnMore')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            {t('courses.viewAll')}
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection; 