import { useEffect, useRef } from 'react';

const RedesignedCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorGlowRef = useRef<HTMLDivElement | null>(null);
  const cursorTrailRef = useRef<HTMLDivElement | null>(null);
  const posXRef = useRef<number>(0);
  const posYRef = useRef<number>(0);
  const mouseXRef = useRef<number>(0);
  const mouseYRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);
  const trailPointsRef = useRef<{x: number, y: number}[]>([]);
  
  useEffect(() => {
    // 检查是否为触摸设备，如果是，则不启用自定义光标
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      // 在触摸设备上不启用自定义光标
      return undefined;
    }
    
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
    
    // 创建鼠标轨迹效果
    const trail = document.createElement('div');
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
    
    // 添加到DOM
    document.body.appendChild(cursor);
    document.body.appendChild(glow);
    document.body.appendChild(trail);
    
    // 初始隐藏光标
    cursor.style.opacity = '0';
    glow.style.opacity = '0';
    
    // 保存引用
    cursorRef.current = cursor;
    cursorGlowRef.current = glow;
    cursorTrailRef.current = trail;
    
    // 所有可交互元素列表
    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
    
    // 处理鼠标移动
    const mouseMove = (e: MouseEvent) => {
      // 更新鼠标位置
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      
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
      
      if (isInteractive) {
        // 获取三角形路径并改变颜色
        const pathElement = cursor.querySelector('path');
        if (pathElement) {
          pathElement.setAttribute('fill', 'rgba(255, 42, 109, 0.7)');
          pathElement.setAttribute('stroke', 'rgba(255, 42, 109, 1)');
        }
        
        cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-pink))';
        cursor.style.transform = 'translate(-2px, -2px) scale(1.1)';
        
        // 改变辉光颜色
        glow.style.background = 'radial-gradient(circle, rgba(255, 42, 109, 0.4) 0%, rgba(255, 42, 109, 0) 70%)';
        glow.style.width = '40px';
        glow.style.height = '40px';
        glow.style.transform = 'translate(-20px, -20px)';
      } else {
        // 重置为默认颜色
        const pathElement = cursor.querySelector('path');
        if (pathElement) {
          pathElement.setAttribute('fill', 'rgba(5, 217, 232, 0.7)');
          pathElement.setAttribute('stroke', 'rgba(5, 217, 232, 1)');
        }
        
        cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-blue))';
        cursor.style.transform = 'translate(-2px, -2px) scale(1)';
        
        // 重置辉光效果
        glow.style.background = 'radial-gradient(circle, rgba(5, 217, 232, 0.4) 0%, rgba(5, 217, 232, 0) 70%)';
        glow.style.width = '30px';
        glow.style.height = '30px';
        glow.style.transform = 'translate(-15px, -15px)';
      }
      
      // 显示光标
      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '0.9';
        glow.style.opacity = '0.6';
      }
      
      // 添加点到轨迹数组
      trailPointsRef.current.push({ x: e.clientX, y: e.clientY });
      
      // 限制轨迹点数量
      if (trailPointsRef.current.length > 10) {
        trailPointsRef.current.shift();
      }
      
      // 绘制轨迹
      if (trailPointsRef.current.length > 1) {
        const pathElement = trail.querySelector('.trail-path') as SVGPathElement;
        if (pathElement) {
          let pathData = `M ${trailPointsRef.current[0].x} ${trailPointsRef.current[0].y}`;
          
          for (let i = 1; i < trailPointsRef.current.length; i += 1) {
            pathData += ` L ${trailPointsRef.current[i].x} ${trailPointsRef.current[i].y}`;
          }
          
          pathElement.setAttribute('d', pathData);
          
          // 计算鼠标移动距离决定轨迹显示程度
          const dx = e.clientX - posXRef.current;
          const dy = e.clientY - posYRef.current;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // 移动距离越大，轨迹越明显
          const opacity = Math.min(0.4, distance / 100);
          pathElement.style.opacity = opacity.toString();
        }
      }
    };
    
    // 处理鼠标点击
    const mouseDown = () => {
      cursor.style.transform = 'translate(-2px, -2px) scale(0.8)';
      
      const pathElement = cursor.querySelector('path');
      if (pathElement) {
        pathElement.setAttribute('fill', 'rgba(211, 0, 197, 0.7)');
        pathElement.setAttribute('stroke', 'rgba(211, 0, 197, 1)');
      }
      
      cursor.style.filter = 'drop-shadow(0 0 8px var(--neon-purple))';
      
      // 点击时辉光扩大
      glow.style.width = '50px';
      glow.style.height = '50px';
      glow.style.background = 'radial-gradient(circle, rgba(211, 0, 197, 0.5) 0%, rgba(211, 0, 197, 0) 70%)';
      glow.style.transform = 'translate(-25px, -25px)';
    };
    
    // 处理鼠标释放
    const mouseUp = () => {
      cursor.style.transform = 'translate(-2px, -2px) scale(1)';
      
      const pathElement = cursor.querySelector('path');
      if (pathElement) {
        pathElement.setAttribute('fill', 'rgba(5, 217, 232, 0.7)');
        pathElement.setAttribute('stroke', 'rgba(5, 217, 232, 1)');
      }
      
      cursor.style.filter = 'drop-shadow(0 0 5px var(--neon-blue))';
      
      // 释放时恢复辉光效果
      glow.style.width = '30px';
      glow.style.height = '30px';
      glow.style.background = 'radial-gradient(circle, rgba(5, 217, 232, 0.4) 0%, rgba(5, 217, 232, 0) 70%)';
      glow.style.transform = 'translate(-15px, -15px)';
    };
    
    // 鼠标离开窗口
    const mouseLeave = () => {
      cursor.style.opacity = '0';
      glow.style.opacity = '0';
      
      // 清空轨迹
      const pathElement = trail.querySelector('.trail-path') as SVGPathElement;
      if (pathElement) {
        pathElement.setAttribute('d', '');
      }
    };
    
    // 鼠标进入窗口
    const mouseEnter = () => {
      cursor.style.opacity = '0.9';
      glow.style.opacity = '0.6';
    };
    
    // 强制保持光标样式
    const enforceCursorStyle = () => {
      if (document.body.style.cursor !== 'none') {
        document.body.style.cursor = 'none';
      }
    };
    
    // 添加事件监听
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mouseenter', mouseEnter);
    
    // 定期检查并强制光标样式
    const intervalId = setInterval(enforceCursorStyle, 500);
    
    // 隐藏原生光标
    document.body.style.cursor = 'none';
    
    // 添加全局样式来强制隐藏光标
    const style = document.createElement('style');
    style.textContent = `
      body * {
        cursor: none !important;
      }
      
      button, a, input, select, textarea, [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // 动画函数
    const render = () => {
      // 实现平滑跟随效果
      posXRef.current += (mouseXRef.current - posXRef.current) * 0.15;
      posYRef.current += (mouseYRef.current - posYRef.current) * 0.15;
      
      // 更新光标位置
      if (cursorRef.current) {
        cursorRef.current.style.left = `${posXRef.current}px`;
        cursorRef.current.style.top = `${posYRef.current}px`;
      }
      
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${mouseXRef.current}px`;
        cursorGlowRef.current.style.top = `${mouseYRef.current}px`;
      }
      
      // 轨迹逐渐消退
      const pathElement = cursorTrailRef.current?.querySelector('.trail-path') as SVGPathElement;
      if (pathElement && pathElement.style.opacity) {
        const currentOpacity = parseFloat(pathElement.style.opacity);
        if (currentOpacity > 0) {
          pathElement.style.opacity = (currentOpacity * 0.95).toString();
        }
      }
      
      // 继续动画循环
      frameRef.current = requestAnimationFrame(render);
    };
    
    // 启动动画
    frameRef.current = requestAnimationFrame(render);
    
    // 清理函数
    return () => {
      // 移除事件监听
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mouseenter', mouseEnter);
      
      // 移除光标元素
      if (cursorRef.current) document.body.removeChild(cursorRef.current);
      if (cursorGlowRef.current) document.body.removeChild(cursorGlowRef.current);
      if (cursorTrailRef.current) document.body.removeChild(cursorTrailRef.current);
      
      // 清除样式
      const customStyle = document.querySelector('style');
      if (customStyle) document.head.removeChild(customStyle);
      
      // 清除间隔检查
      clearInterval(intervalId);
      
      // 取消动画
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
  
  return null; // 不渲染任何DOM元素
};

export default RedesignedCursor;