
// 课程类型定义
export interface Course {
  web2CourseId: string;
  name: string;
  price: string;
  isActive?: boolean;
  creator?: string;
  isPurchased?: boolean;
  isCompleted?: boolean;
  coverImage?: string;
  description?: string;
}
