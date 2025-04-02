'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 为 Next.js App Router 提供路由变化事件支持
 * 由于App Router不提供原生事件，我们需要自己实现
 */
export function NavigationEventsHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 记录上一个路径
    const prevPath = window.sessionStorage.getItem('prevPath') || '';
    // 存储当前路径用于下次比较
    window.sessionStorage.setItem('prevPath', pathname || '');
    
    // 只有当路径实际发生变化时才触发事件
    if (prevPath !== pathname) {
      // 创建自定义事件来模拟Pages Router的事件
      const routeChangeStart = new CustomEvent('nextjs:route-change-start', {
        detail: {
          url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
          prevPath
        },
      });
      
      // 发送路由变化开始事件
      document.dispatchEvent(routeChangeStart);
      
      // 在短暂延迟后发送路由变化完成事件
      // 这个延迟模拟了导航过程，可以根据需要调整
      setTimeout(() => {
        const routeChangeComplete = new CustomEvent('nextjs:route-change-complete', {
          detail: {
            url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
            prevPath
          },
        });
        document.dispatchEvent(routeChangeComplete);
      }, 100); // 使用较短的延迟以保持响应性
    }
    
  }, [pathname, searchParams]);
  
  return null;
}

export default NavigationEventsHandler;