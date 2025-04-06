import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language/Context';

interface CourseSectionProps {
  className?: string;
}

const CourseSection: React.FC<CourseSectionProps> = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-darker-bg relative py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="cyberpunk-title text-3xl font-bold mb-8 text-center"
          data-text={t('courses.title')}
        >
          {t('courses.title')}
        </h2>

        {/* 课程卡片示例 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="cyberpunk-card rounded-lg overflow-hidden transition-transform hover:translate-y-[-4px]"
            >
              <div className="h-48 bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-16 w-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 bg-neon-pink text-white px-2 py-1 text-xs rounded-md">
                  热门
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-neon-blue mb-2">
                  区块链高级开发课程 {item}
                </h3>
                <p className="text-gray-400 mb-4">
                  掌握智能合约开发、DeFi协议架构和安全审计技能，成为区块链专业开发者。
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-neon-green font-semibold">¥{1999 + item * 1000}</span>
                  <button className="cyberpunk-button px-3 py-1 text-sm rounded">立即学习</button>
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
  );
};

export default CourseSection;
