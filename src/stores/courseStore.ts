import { atom } from 'jotai';
import { mockCourses } from '@/utils/mock';
import { Course } from '@/types/courses';

// 存储课程列表的原子状态
export const coursesAtom = atom<Course[]>(mockCourses as unknown as Course[]);

// 用户购买的课程列表
export const userCoursesAtom = atom<Course[]>([]);

// 购买课程的操作
export const purchaseCourseAction = atom(null, async (get, set, web2CourseId: string) => {
  const courses = get(coursesAtom);
  const course = courses.find((c: Course) => c.web2CourseId === web2CourseId);
  if (course) {
    course.isPurchased = true;
  }
  set(coursesAtom, courses);
});
// 购买课程的操作
export const updateCourseAction = atom(
  null,
  async (get, set, web2CourseId: string, obj: Course) => {
    const courses = get(coursesAtom);
    const course = courses.find((c: Course) => c.web2CourseId === web2CourseId);
    if (course) {
      Object.assign(course, obj);
    }
    set(coursesAtom, courses);
  },
);
