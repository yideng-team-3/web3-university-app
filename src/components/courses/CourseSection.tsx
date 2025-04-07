import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language/Context';
import CourseCard from '@/components/courses/CourseCard';

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
            <CourseCard key={item} item={item}></CourseCard>
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
