import { useEffect, useRef } from 'react';

// 全局单例实例控制
let isCursorTrackerInitialized = false;
let cursorElements: {
  cursor: HTMLDivElement | null,
  glow: HTMLDivElement | null,
  trail: HTMLDivElement | null
} = {
  cursor: null,
  glow: null,
  trail: null
};

// 全局引用
let frameId: number | null = null;
let trailPoints: {x: number, y: number}[] = [];
let mouseX = 0;
let mouseY = 0;
let posX = 0;
let posY = 0;

const RedesignedCursor = () => {
  const initRef = useRef<boolean>(isCursorTrackerInitialized);
  
  useEffect(() => {
    // 如果已经初始化了，跳过初始化过程
    if (initRef.current) {
      return undefined;
    }
    
    // 检查是否为触摸设备，如果是，则不启用自定义光标
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    
    if (isTouchDevice) {
      // 在触摸设备上不启用自定义光标
      return undefined;
    }
    
    // 检测性能水平来决定效果复杂程度
    const isLowPerformance = () => {
      // 检测是否为低端设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      return isMobile || isLowEndDevice;
    };
    
    const performanceLevel = isLowPerformance() ? 'low' : 'high';
    
    // 创建主光标 - 三角形
    const cursor = document.createElement('div');
    cursor.className = 'cyberpunk-cursor';
    
    // 光标SVG内容
    cursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M1 1L12 21L16 13L23 9L1 1Z" 
          fill="rgba(5, 217, 232, 0.7)" 
          stroke="rgba(5, 217, 232, 1)" 
          stroke-width="1.5"
        />
      </svg>
    `;
    
    cursor.style.position = 'fixed';
    cursor.style.zIndex = '9999';
    cursor.style.pointerEvents = 'none';
    cursor.style.transition = 'transform 0.1s';
    cursor.style.opacity = '0.9';
    cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-blue))';
    cursor.style.transform = 'translate(-2px, -2px)';
    
    // 创建光标辉光效果
    const glow = document.createElement('div');
    glow.className = 'cyberpunk-cursor-glow';
    glow.style.position = 'fixed';
    glow.style.width = '30px';
    glow.style.height = '30px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(5, 217, 232, 0.4) 0%, rgba(5, 217, 232, 0) 70%)';
    glow.style.transform = 'translate(-15px, -15px)';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '9998';
    glow.style.opacity = '0.6';
    
    // 只在高性能模式创建轨迹
    let trail: HTMLDivElement | null = null;
    if (performanceLevel === 'high') {
      // 创建鼠标轨迹效果
      trail = document.createElement('div');
      trail.className = 'cyberpunk-cursor-trail';
      trail.style.position = 'fixed';
      trail.style.top = '0';
      trail.style.left = '0';
      trail.style.pointerEvents = 'none';
      trail.style.zIndex = '9997';
      trail.style.width = '100vw';
      trail.style.height = '100vh';
      
      // 设置SVG内容以便后续绘制路径
      trail.innerHTML = `
        <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
          <path class="trail-path" d="" stroke="rgba(211, 0, 197, 0.5)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    }
    
    // 添加到DOM
    document.body.appendChild(cursor);
    document.body.appendChild(glow);
    if (trail) document.body.appendChild(trail);
    
    // 初始隐藏光标
    cursor.style.opacity = '0';
    glow.style.opacity = '0';
    
    // 保存引用
    cursorElements.cursor = cursor;
    cursorElements.glow = glow;
    cursorElements.trail = trail;
    
    // 更新全局状态
    initRef.current = true;
    isCursorTrackerInitialized = true;
    
    // 所有可交互元素列表
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
    
    // 使用节流来限制鼠标移动事件频率
    let lastMoveTime = 0;
    const moveThrottle = performanceLevel === 'high' ? 5 : 15; // 高性能模式: 5ms, 低性能模式: 15ms
    
    // 处理鼠标移动
    const mouseMove = (e: MouseEvent) => {
      // 节流控制
      const now = performance.now();
      if (now - lastMoveTime < moveThrottle) return;
      lastMoveTime = now;
      
      // 更新鼠标位置
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 根据目标元素类型改变光标样式
      const target = e.target as HTMLElement;
      const isInteractive = 
        interactiveElements.includes(target.tagName) || 
        !!target.closest('button') || 
        !!target.closest('a') ||
        !!target.closest('input') ||
        !!target.closest('select') ||
        !!target.closest('textarea') ||
        target.hasAttribute('role') ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      if (cursorElements.cursor) {
        if (isInteractive) {
          // 获取三角形路径并改变颜色
          const pathElement = cursorElements.cursor.querySelector('path');
          if (pathElement) {
            pathElement.setAttribute('fill', 'rgba(255, 42, 109, 0.7)');
            pathElement.setAttribute('stroke', 'rgba(255, 42, 109, 1)');
          }
          
          cursorElements.cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-pink))';
          cursorElements.cursor.style.transform = 'translate(-2px, -2px) scale(1.1)';
          
          // 改变辉光颜色
          if (cursorElements.glow) {
            cursorElements.glow.style.background = 'radial-gradient(circle, rgba(255, 42, 109, 0.4) 0%, rgba(255, 42, 109, 0) 70%)';
            cursorElements.glow.style.width = '40px';
            cursorElements.glow.style.height = '40px';
            cursorElements.glow.style.transform = 'translate(-20px, -20px)';
          }
        } else {
          // 重置为默认颜色
          const pathElement = cursorElements.cursor.querySelector('path');
          if (pathElement) {
            pathElement.setAttribute('fill', 'rgba(5, 217, 232, 0.7)');
            pathElement.setAttribute('stroke', 'rgba(5, 217, 232, 1)');
          }
          
          cursorElements.cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-blue))';
          cursorElements.cursor.style.transform = 'translate(-2px, -2px) scale(1)';
          
          // 重置辉光效果
          if (cursorElements.glow) {
            cursorElements.glow.style.background = 'radial-gradient(circle, rgba(5, 217, 232, 0.4) 0%, rgba(5, 217, 232, 0) 70%)';
            cursorElements.glow.style.width = '30px';
            cursorElements.glow.style.height = '30px';
            cursorElements.glow.style.transform = 'translate(-15px, -15px)';
          }
        }
        
        // 显示光标
        if (cursorElements.cursor.style.opacity === '0') {
          cursorElements.cursor.style.opacity = '0.9';
          if (cursorElements.glow) cursorElements.glow.style.opacity = '0.6';
        }
      }
      
      // 只在高性能模式下更新轨迹
      if (performanceLevel === 'high' && cursorElements.trail) {
        // 添加点到轨迹数组
        trailPoints.push({ x: e.clientX, y: e.clientY });
        
        // 限制轨迹点数量
        if (trailPoints.length > 10) {
          trailPoints.shift();
        }
        
        // 绘制轨迹
        if (trailPoints.length > 1) {
          const pathElement = cursorElements.trail.querySelector('.trail-path') as SVGPathElement;
          if (pathElement) {
            let pathData = `M ${trailPoints[0].x} ${trailPoints[0].y}`;
            
            for (let i = 1; i < trailPoints.length; i += 1) {
              pathData += ` L ${trailPoints[i].x} ${trailPoints[i].y}`;
            }
            
            pathElement.setAttribute('d', pathData);
            
            // 计算鼠标移动距离决定轨迹显示程度
            const dx = e.clientX - posX;
            const dy = e.clientY - posY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 移动距离越大，轨迹越明显
            const opacity = Math.min(0.4, distance / 100);
            pathElement.style.opacity = opacity.toString();
          }
        }
      }
      
      // 更新上一次位置
      posX = e.clientX;
      posY = e.clientY;
    };
    
    // 处理鼠标点击
    const mouseDown = () => {
      if (cursorElements.cursor) {
        cursorElements.cursor.style.transform = 'translate(-2px, -2px) scale(0.8)';
        
        const pathElement = cursorElements.cursor.querySelector('path');
        if (pathElement) {
          pathElement.setAttribute('fill', 'rgba(211, 0, 197, 0.7)');
          pathElement.setAttribute('stroke', 'rgba(211, 0, 197, 1)');
        }
        
        cursorElements.cursor.style.filter = 'drop-shadow(0 0 8px var(--neon-purple))';
      }
      
      // 点击时辉光扩大
      if (cursorElements.glow) {
        cursorElements.glow.style.width = '50px';
        cursorElements.glow.style.height = '50px';
        cursorElements.glow.style.background = 'radial-gradient(circle, rgba(211, 0, 197, 0.5) 0%, rgba(211, 0, 197, 0) 70%)';
        cursorElements.glow.style.transform = 'translate(-25px, -25px)';
      }
    };
    
    // 处理鼠标释放
    const mouseUp = () => {
      if (cursorElements.cursor) {
        cursorElements.cursor.style.transform = 'translate(-2px, -2px) scale(1)';
        
        const pathElement = cursorElements.cursor.querySelector('path');
        if (pathElement) {
          pathElement.setAttribute('fill', 'rgba(5, 217, 232, 0.7)');
          pathElement.setAttribute('stroke', 'rgba(5, 217, 232, 1)');
        }
        
        cursorElements.cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-blue))';
      }
      
      // 释放时恢复辉光效果
      if (cursorElements.glow) {
        cursorElements.glow.style.width = '30px';
        cursorElements.glow.style.height = '30px';
        cursorElements.glow.style.background = 'radial-gradient(circle, rgba(5, 217, 232, 0.4) 0%, rgba(5, 217, 232, 0) 70%)';
        cursorElements.glow.style.transform = 'translate(-15px, -15px)';
      }
    };
    
    // 鼠标离开窗口
    const mouseLeave = () => {
      if (cursorElements.cursor) cursorElements.cursor.style.opacity = '0';
      if (cursorElements.glow) cursorElements.glow.style.opacity = '0';
      
      // 清空轨迹
      if (cursorElements.trail) {
        const pathElement = cursorElements.trail.querySelector('.trail-path') as SVGPathElement;
        if (pathElement) {
          pathElement.setAttribute('d', '');
        }
      }
    };
    
    // 鼠标进入窗口
    const mouseEnter = () => {
      if (cursorElements.cursor) cursorElements.cursor.style.opacity = '0.9';
      if (cursorElements.glow) cursorElements.glow.style.opacity = '0.6';
    };
    
    // 添加事件监听
    document.addEventListener('mousemove', mouseMove, { passive: true });
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mouseenter', mouseEnter);
    
    // 隐藏原生光标
    document.body.style.cursor = 'none';
    
    // 使用 MutationObserver 监听DOM变化，确保所有新元素都继承自定义光标设置
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // 只在必要时添加样式
          if (!document.querySelector('#cyberpunk-cursor-style')) {
            const style = document.createElement('style');
            style.id = 'cyberpunk-cursor-style';
            style.textContent = `
              body * {
                cursor: none !important;
              }
              
              button, a, input, select, textarea, [role="button"] {
                cursor: none !important;
              }
            `;
            document.head.appendChild(style);
            break;
          }
        }
      }
    });
    
    // 观察 body 的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 帧率限制
    const targetFPS = performanceLevel === 'high' ? 60 : 30;
    const interval = 1000 / targetFPS;
    let lastTime = performance.now();
    
    // 动画函数 - 使用 RAF 优化
    const render = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;
      
      if (delta > interval) {
        // 更新计时器
        lastTime = currentTime - (delta % interval);
        
        // 实现平滑跟随效果
        const ease = performanceLevel === 'high' ? 0.15 : 0.25; // 低性能下更快速跟随
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
        
        // 更新光标位置
        if (cursorElements.cursor) {
          cursorElements.cursor.style.left = `${posX}px`;
          cursorElements.cursor.style.top = `${posY}px`;
        }
        
        if (cursorElements.glow) {
          cursorElements.glow.style.left = `${mouseX}px`;
          cursorElements.glow.style.top = `${mouseY}px`;
        }
        
        // 轨迹逐渐消退
        if (cursorElements.trail) {
          const pathElement = cursorElements.trail.querySelector('.trail-path') as SVGPathElement;
          if (pathElement && pathElement.style.opacity) {
            const currentOpacity = parseFloat(pathElement.style.opacity);
            if (currentOpacity > 0) {
              pathElement.style.opacity = (currentOpacity * 0.95).toString();
            }
          }
        }
      }
      
      // 如果组件已卸载或者不可见，停止动画
      if (!isCursorTrackerInitialized || document.hidden) {
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
        return;
      }
      
      // 继续动画循环
      frameId = requestAnimationFrame(render);
    };
    
    // 处理页面可见性变化
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面不可见，暂停动画
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      } else {
        // 页面可见，恢复动画
        if (frameId === null && isCursorTrackerInitialized) {
          lastTime = performance.now();
          frameId = requestAnimationFrame(render);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 启动动画
    frameId = requestAnimationFrame(render);
    
    // 清理函数
    return () => {
      // 停止动画
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      
      // 移除事件监听
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mouseenter', mouseEnter);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // 停止观察
      observer.disconnect();
      
      // 移除光标元素（只有在全局初始化标志为 false 时才移除）
      // 这确保只有在组件最后一次卸载时才清理
      if (!isCursorTrackerInitialized) return;
      
      isCursorTrackerInitialized = false;
      initRef.current = false;
      
      if (cursorElements.cursor) document.body.removeChild(cursorElements.cursor);
      if (cursorElements.glow) document.body.removeChild(cursorElements.glow);
      if (cursorElements.trail) document.body.removeChild(cursorElements.trail);
      
      // 重置引用
      cursorElements = {
        cursor: null,
        glow: null,
        trail: null
      };
      
      // 清除样式
      const customStyle = document.querySelector('#cyberpunk-cursor-style');
      if (customStyle) document.head.removeChild(customStyle);
      
      // 恢复默认光标
      document.body.style.cursor = 'auto';
      
      // 清空轨迹点
      trailPoints = [];
    };
  }, []);
  
  return null; // 不渲染任何DOM元素
};

export default RedesignedCursor;