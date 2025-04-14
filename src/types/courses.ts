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

// 定义合约返回的课程类型
export interface ContractCourse {
  web2CourseId: string;
  name: string;
  price: bigint;
  isActive: boolean;
  creator: string;
}

// 扩展Course类型以添加isPurchased属性
export interface FormattedCourse extends Omit<Course, 'isPurchased'> {
  web2CourseId: string;
  name: string;
  price: string;
  isActive: boolean;
  creator: string;
  isPurchased?: boolean;
}
