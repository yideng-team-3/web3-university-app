import { useAtom } from 'jotai';
import { useCallback, useState, useEffect } from 'react';
import { formatUnits, getContract } from 'viem';
import { useWriteContract } from 'wagmi';
import { Course, ContractCourse, FormattedCourse } from '@/types/courses';
import CourseMarketABI from '@/contracts/abis/CourseMarket.json';
import YiDengTokenABI from '@/contracts/abis/YiDengToken.json';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { coursesAtom } from '@/stores/courseStore';
import { useWallet } from './useWallet';

// 合约地址可以从配置文件或环境变量获取
const COURSE_MARKET_ADDRESS = CONTRACT_ADDRESSES.SEPOLIA.COURSE_MARKET as `0x${string}`;
const YD_TOKEN_ADDRESS = CONTRACT_ADDRESSES.SEPOLIA.YIDENG_TOKEN as `0x${string}`;

export function useCourseContract() {
  const { provider, account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oldCourses, setCourses] = useAtom(coursesAtom);

  // 使用 wagmi 的 writeContract 钩子
  const { writeContractAsync } = useWriteContract();

  // 创建合约实例 - 使用 viem 的 getContract 函数
  const getMarketContract = useCallback(() => {
    if (!provider) return null;

    try {
      return getContract({
        address: COURSE_MARKET_ADDRESS,
        abi: CourseMarketABI.abi,
        client: provider,
      });
    } catch (err) {
      return null;
    }
  }, [provider]);

  // 创建代币合约实例
  const getTokenContract = useCallback(() => {
    if (!provider) return null;

    try {
      return getContract({
        address: YD_TOKEN_ADDRESS,
        abi: YiDengTokenABI.abi,
        client: provider,
      });
    } catch (err) {
      return null;
    }
  }, [provider]);

  // 获取所有课程
  const getAllCourses = useCallback(async (): Promise<Course[]> => {
    if (!provider) {
      return oldCourses; // 返回缓存数据而不是空数组
    }

    setIsLoading(true);
    setError(null);

    try {
      const marketContract = getMarketContract();
      if (!marketContract) {
        throw new Error('无法创建市场合约实例');
      }

      // 获取课程总数
      let courseCount;
      try {
        courseCount = await marketContract.read.courseCount();
      } catch (err) {
        // 如果获取失败但有缓存数据，返回缓存数据
        if (oldCourses.length > 0) {
          return oldCourses;
        }
        throw new Error('获取课程总数失败');
      }

      // 类型断言并转为数字
      const courseCountNumber = Number(courseCount as bigint);

      // 如果没有课程，但有缓存数据，返回缓存数据
      if (courseCountNumber === 0 || Number.isNaN(courseCountNumber)) {
        if (oldCourses.length > 0) {
          return oldCourses;
        }
        return [];
      }

      // 获取所有课程信息
      const courses: FormattedCourse[] = [];

      // 准备批量查询请求
      const coursePromises = Array.from({ length: courseCountNumber }, (_, i) => {
        const courseId = i + 1;
        return marketContract.read.courses([BigInt(courseId)]).catch(() => null); // 返回null表示获取失败
      });

      // 并行执行所有请求
      const coursesResults = await Promise.all(coursePromises);

      // 格式化课程信息，过滤掉null值
      const formattedCourses: FormattedCourse[] = coursesResults
        .filter(courseResult => courseResult !== null)
        .map(courseResult => {
          const course = courseResult as ContractCourse;
          return {
            web2CourseId: course.web2CourseId || '',
            name: course.name || '',
            price: formatUnits(course.price || BigInt(0), 0),
            isActive: course.isActive || false,
            creator: course.creator || '',
          };
        });

      // 如果没有检索到课程但有缓存数据，则保留缓存数据
      if (formattedCourses.length === 0 && oldCourses.length > 0) {
        return oldCourses;
      }

      // 如果用户已登录，批量检查是否已购买
      if (account) {
        // 过滤掉没有web2CourseId的课程
        const validCourses = formattedCourses.filter(course => !!course.web2CourseId);

        const isPurchasedPromises = validCourses.map(
          course =>
            marketContract.read
              .hasCourse([account as `0x${string}`, course.web2CourseId])
              .catch(() => false), // 如果查询失败，默认为未购买
        );

        try {
          const isPurchasedResults = await Promise.all(isPurchasedPromises);

          // 将购买状态添加到课程信息中
          validCourses.forEach((course, i) => {
            course.isPurchased = !!isPurchasedResults[i]; // 确保布尔值
            courses.push(course);
          });
        } catch (err) {
          // 出错时，使用现有的购买状态（如果有）或设置为未购买
          formattedCourses.forEach(course => {
            const existingCourse = oldCourses.find(c => c.web2CourseId === course.web2CourseId);
            course.isPurchased = existingCourse?.isPurchased || false;
            courses.push(course);
          });
        }
      } else {
        courses.push(...formattedCourses);
      }

      try {
        // 根据web2CourseId合并，保留以前的数据
        const mergedCourses = courses.map(course => {
          if (!course.web2CourseId) {
            return course;
          }

          const oldCourse = oldCourses.find(c => c.web2CourseId === course.web2CourseId) || course;
          // 合并课程信息，保留旧数据中的其他属性
          return {
            ...oldCourse,
            ...course,
            // 如果新数据中没有购买状态，使用旧数据中的购买状态
            isPurchased:
              course.isPurchased !== undefined ? course.isPurchased : oldCourse.isPurchased,
          };
        });

        // 只有当获取到了有效数据时才更新状态
        if (mergedCourses.length > 0) {
          setCourses(mergedCourses);
        }
        return mergedCourses;
      } catch (err) {
        // 出错时返回原始课程数据，或保留现有数据
        return courses.length > 0 ? courses : oldCourses;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取课程失败';
      setError(errorMessage);
      // 返回现有数据而不是空数组
      return oldCourses;
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, getMarketContract, oldCourses, setCourses]);

  // 在钱包连接状态变化时重新获取课程数据
  useEffect(() => {
    if (account) {
      getAllCourses().catch(() => {
        // 错误处理已在函数内部完成，这里可以记录日志或显示通知
      });
    }
  }, [account, getAllCourses]);

  // 获取用户已购买的课程
  const getUserCourses = useCallback(
    async (userAddress: string): Promise<Course[]> => {
      if (!provider || !userAddress) {
        // 返回缓存中已购买的课程
        return oldCourses.filter(course => course.isPurchased);
      }

      setIsLoading(true);
      setError(null);

      try {
        // 检查地址格式
        if (!userAddress.startsWith('0x') || userAddress.length !== 42) {
          throw new Error('无效的钱包地址格式');
        }

        const marketContract = getMarketContract();
        if (!marketContract) {
          throw new Error('无法创建市场合约实例');
        }

        // 先获取所有课程
        const allCourses = await getAllCourses();

        if (allCourses.length === 0) {
          return [];
        }

        // 创建批量检查课程购买状态的请求
        const validCourses = allCourses.filter(course => !!course.web2CourseId);

        const isPurchasedPromises = validCourses.map(course =>
          marketContract.read
            .hasCourse([userAddress as `0x${string}`, course.web2CourseId])
            .catch(() => {
              // 如果检查失败，使用缓存中的购买状态（如果有）
              const existingCourse = oldCourses.find(c => c.web2CourseId === course.web2CourseId);
              return existingCourse?.isPurchased || false;
            }),
        );

        // 并行执行所有请求
        const isPurchasedResults = await Promise.all(isPurchasedPromises);

        // 更新课程购买状态
        const userCourses = validCourses.map((course, index) => ({
          ...course,
          isPurchased: !!isPurchasedResults[index], // 确保布尔值
        }));

        // 只有当有效数据时才更新状态
        if (userCourses.length > 0) {
          setCourses(userCourses);
        }

        // 只返回用户已购买的课程
        const purchasedCourses = userCourses.filter(course => course.isPurchased);
        return purchasedCourses;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取用户课程失败';
        setError(errorMessage);
        // 返回缓存中的已购买课程而不是空数组
        return oldCourses.filter(course => course.isPurchased);
      } finally {
        setIsLoading(false);
      }
    },
    [provider, getAllCourses, getMarketContract, setCourses, oldCourses],
  );

  // 购买课程
  const purchaseCourse = useCallback(
    async (web2CourseId: string) => {
      if (!account || !provider) {
        throw new Error('合约未初始化或用户未登录');
      }

      setIsLoading(true);
      setError(null);

      try {
        const marketContract = getMarketContract();
        const tokenContract = getTokenContract();

        if (!marketContract || !tokenContract) {
          throw new Error('无法创建合约实例');
        }

        // 获取课程ID和价格
        let courseId;
        try {
          courseId = await marketContract.read.web2ToCourseId([web2CourseId]);
        } catch (err) {
          throw new Error(`获取课程ID失败: ${web2CourseId}`);
        }

        if (!courseId || (courseId as bigint).toString() === '0') {
          throw new Error(`课程不存在: ${web2CourseId}`);
        }

        let course;
        try {
          course = await marketContract.read.courses([courseId as bigint]);
        } catch (err) {
          throw new Error('获取课程详情失败');
        }

        if (!course) {
          throw new Error('无法获取课程信息');
        }

        const { price } = course as ContractCourse;

        // 检查代币余额
        let balance;
        try {
          balance = await tokenContract.read.balanceOf([account as `0x${string}`]);
        } catch (err) {
          throw new Error('获取代币余额失败');
        }

        if ((balance as bigint) < price) {
          throw new Error(
            `YD代币余额不足，需要 ${formatUnits(price, 0)} YD，当前余额: ${formatUnits(balance as bigint, 0)} YD`,
          );
        }

        // 检查授权
        let allowance;
        try {
          allowance = await tokenContract.read.allowance([
            account as `0x${string}`,
            COURSE_MARKET_ADDRESS,
          ]);
        } catch (err) {
          throw new Error('获取授权额度失败');
        }

        if ((allowance as bigint) < price) {
          // 需要先授权
          try {
            await writeContractAsync({
              address: YD_TOKEN_ADDRESS,
              abi: YiDengTokenABI.abi,
              functionName: 'approve',
              args: [COURSE_MARKET_ADDRESS, price],
            });
          } catch (err) {
            throw new Error('授权代币失败');
          }
        }

        // 购买课程
        try {
          await writeContractAsync({
            address: COURSE_MARKET_ADDRESS,
            abi: CourseMarketABI.abi,
            functionName: 'purchaseCourse',
            args: [web2CourseId],
            gas: BigInt(300000),
          });

          // 购买成功后更新本地课程状态
          const updatedCourses = [...oldCourses];
          const courseIndex = updatedCourses.findIndex(c => c.web2CourseId === web2CourseId);

          if (courseIndex !== -1) {
            updatedCourses[courseIndex] = {
              ...updatedCourses[courseIndex],
              isPurchased: true,
            };
            setCourses(updatedCourses);
          } else {
            // 如果本地没有这个课程，刷新所有课程
            getAllCourses().catch(() => {
              // 错误处理
            });
          }
        } catch (err) {
          throw new Error('购买课程失败');
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '购买课程失败';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      account,
      provider,
      getMarketContract,
      getTokenContract,
      writeContractAsync,
      oldCourses,
      setCourses,
      getAllCourses,
    ],
  );

  // 检查课程是否已完成（是否有证书）
  const checkCourseCompletion = useCallback(
    async (web2CourseId: string, studentAddress: string) => {
      if (!provider) {
        // 尝试从缓存中获取完成状态
        const cachedCourse = oldCourses.find(c => c.web2CourseId === web2CourseId);
        return cachedCourse?.isCompleted || false;
      }

      try {
        const marketContract = getMarketContract();

        if (!marketContract) {
          throw new Error('无法创建市场合约实例');
        }

        // 证书合约地址
        let certificateContract;
        try {
          certificateContract = await marketContract.read.certificate();
        } catch (err) {
          return false;
        }

        if (!certificateContract) {
          return false;
        }

        // 创建证书合约实例
        const certificate = getContract({
          address: certificateContract as `0x${string}`,
          abi: CourseMarketABI.abi, // 暂时使用CourseMarket的ABI
          client: provider,
        });

        // 检查是否有证书
        try {
          const hasCertificate = await certificate.read.hasCertificate([
            studentAddress as `0x${string}`,
            web2CourseId,
          ]);

          // 更新本地课程状态
          if (hasCertificate) {
            const updatedCourses = [...oldCourses];
            const courseIndex = updatedCourses.findIndex(c => c.web2CourseId === web2CourseId);

            if (courseIndex !== -1) {
              updatedCourses[courseIndex] = {
                ...updatedCourses[courseIndex],
                isCompleted: true,
              };
              setCourses(updatedCourses);
            }
          }

          return !!hasCertificate; // 确保返回布尔值
        } catch (err) {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [provider, getMarketContract, oldCourses, setCourses],
  );

  return {
    account,
    isLoading,
    error,
    getAllCourses,
    getUserCourses,
    purchaseCourse,
    checkCourseCompletion,
  };
}
