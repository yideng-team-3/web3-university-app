// src/hooks/useCourseContract.ts
import { useAtom } from 'jotai';
import { Course } from '@/types/courses';
import { useCallback, useMemo, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import CourseMarketABI from '@/contracts/abis/CourseMarket.json';
import YiDengTokenABI from '@/contracts/abis/YiDengToken.json';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { coursesAtom } from '@/stores/courseStore';
import { useWallet } from './useWallet';

// 合约地址可以从配置文件或环境变量获取
const COURSE_MARKET_ADDRESS = CONTRACT_ADDRESSES.SEPOLIA.COURSE_MARKET;
const YD_TOKEN_ADDRESS = CONTRACT_ADDRESSES.SEPOLIA.YIDENG_TOKEN;

export function useCourseContract() {
  const { provider, account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oldCourses, setCourses] =  useAtom(coursesAtom);
  // 创建市场合约实例
  const marketContract = useMemo(() => {
    if (!provider) return null;
    return new Contract(
      COURSE_MARKET_ADDRESS,
      CourseMarketABI.abi,
      provider.getSigner()
    );
  }, [provider]);

  // 创建代币合约实例
  const tokenContract = useMemo(() => {
    if (!provider) return null;
    return new Contract(
      YD_TOKEN_ADDRESS,
      YiDengTokenABI.abi,
      provider.getSigner()
    );
  }, [provider]);

  // 获取所有课程
  const getAllCourses = useCallback(async (): Promise<Course[]> => {
    if (!marketContract || !provider) {
      throw new Error('合约未初始化');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // 获取课程总数
      const courseCount = await marketContract.courseCount();
      const courseCountNumber = courseCount.toNumber();
      
      // 如果没有课程，直接返回空数组
      if (courseCountNumber === 0) {
        return [];
      }
      
      // 获取所有课程信息
      const courses: Course[] = [];
      
      for (let i = 1; i <= courseCountNumber; i++) {
        try {
          // 使用 courses 映射获取课程信息
          const course = await marketContract.courses(i);
          // 格式化课程信息
          const courseData: Course = {
            web2CourseId: course.web2CourseId,
            name: course.name,
            price: formatUnits(course.price, 0),
            isActive: course.isActive,
            creator: course.creator
          };
          
          // 如果用户已登录，检查是否已购买
          if (account) {
            courseData.isPurchased = await marketContract.hasCourse(account, course.web2CourseId);
          }
          
          courses.push(courseData);
        } catch (error) {
          console.error(`获取课程 #${i} 失败:`, error);
        }
      }
      console.log('marketContract', marketContract);
      console.log('courses', courses);
      // 根据web2CourseId合并
      for (let index = 0; index < courses.length; index++) {
        const course = courses[index];
        const oldCourse = oldCourses.find(c => c.web2CourseId === course.web2CourseId) || course;
        courses[index] =Object.assign(oldCourse,course);
      }
      setCourses(courses);
      return courses;
    } catch (err) {
      const error = err instanceof Error ? err.message : '获取课程失败';
      setError(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }, [marketContract, provider, account]);

  // 获取用户已购买的课程
  const getUserCourses = useCallback(async (userAddress: string): Promise<Course[]> => {
    if (!marketContract || !provider) {
      throw new Error('合约未初始化');
    }

    if (!userAddress) {
      throw new Error('用户地址不能为空');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const allCourses = await getAllCourses();
      const userCourses = await Promise.all(
        allCourses.map(async (course) => {
          const isPurchased = await marketContract.hasCourse(userAddress, course.web2CourseId);
          return {
            ...course,
            isPurchased
          };
        })
      );
      setCourses(userCourses);
      console.log('userCourses', userCourses);
      // 只返回用户已购买的课程
      return userCourses.filter(course => course.isPurchased);
    } catch (err) {
      const error = err instanceof Error ? err.message : '获取用户课程失败';
      setError(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }, [marketContract, provider, getAllCourses]);

  // 购买课程
  const purchaseCourse = useCallback(async (web2CourseId: string) => {
    if (!marketContract || !account || !tokenContract) {
      throw new Error('合约未初始化或用户未登录');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // 获取课程ID和价格
      const courseId = await marketContract.web2ToCourseId(web2CourseId);
      if (courseId.toString() === '0') {
        throw new Error(`课程不存在: ${web2CourseId}`);
      }
      
      const course = await marketContract.courses(courseId);
      const { price } = course;
      
      // 检查代币余额
      const balance = await tokenContract.balanceOf(account);
      if (balance.lt(price)) {
        throw new Error(`YD代币余额不足，需要 ${formatUnits(price, 0)} YD，当前余额: ${formatUnits(balance, 0)} YD`);
      }
      
      // 检查授权
      const allowance = await tokenContract.allowance(account, COURSE_MARKET_ADDRESS);
      if (allowance.lt(price)) {
        // 需要先授权
        const approveTx = await tokenContract.approve(COURSE_MARKET_ADDRESS, price);
        await approveTx.wait();
      }
      
      // 购买课程
      const tx = await marketContract.purchaseCourse(web2CourseId, {
        gasLimit: 300000
      });
      
      // 等待交易确认
      await tx.wait();
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : '购买课程失败';
      setError(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }, [marketContract, tokenContract, account]);

  // 检查课程是否已完成（是否有证书）
  const checkCourseCompletion = useCallback(async (web2CourseId: string, studentAddress: string) => {
    if (!marketContract || !provider) {
      throw new Error('合约未初始化');
    }

    try {
      // 证书合约地址
      const certificateContract = await marketContract.certificate();
      // 创建证书合约实例
      const certificate = new Contract(
        certificateContract,
        // 这里需要导入证书合约ABI
        CourseMarketABI.abi, // 暂时使用CourseMarket的ABI，实际应导入CourseCertificate.json
        provider
      );
      
      // 检查是否有证书
      return await certificate.hasCertificate(studentAddress, web2CourseId);
    } catch (err) {
      console.error('检查课程完成状态失败:', err);
      return false;
    }
  }, [marketContract, provider]);

  return {
    account,
    isLoading,
    error,
    getAllCourses,
    getUserCourses,
    purchaseCourse,
    checkCourseCompletion
  };
}