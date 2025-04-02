'use client';

import React, { useEffect, useState } from 'react';
import { MoveLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ParticlesBackground from '@components/effects/ParticlesBackground';
import CursorTracker from '@components/effects/CursorTracker';

const CyberpunkPageNotFoundView = () => {
  const router = useRouter();
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // 模拟终端打字效果
  const [terminalText, setTerminalText] = useState('');
  const fullText = '正在尝试连接至请求资源...\n查询中...\n错误代码: 0x80070404\n连接失败: 资源不存在或已被移除';
  
  useEffect(() => {
    document.body.classList.add('cyberpunk-theme');
    
    // 随机故障效果
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 3000);
    
    // 模拟终端打字效果
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setTerminalText(prevText => prevText + fullText.charAt(i));
        i += 1;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
    
    return () => {
      document.body.classList.remove('cyberpunk-theme');
      clearInterval(glitchInterval);
      clearInterval(typeInterval);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      <ParticlesBackground />
      <CursorTracker />
      
      {/* 背景网格 */}
      <div className="fixed inset-0 z-0">
        <div className="cyber-grid"></div>
      </div>
      
      <div className="max-w-lg w-full text-center relative z-10">
        <h1 
          className={`text-9xl font-bold cyberpunk-title ${glitchEffect ? 'cyberpunk-glitch' : ''}`}
          data-text="404"
        >
          404
        </h1>

        <div className="mt-8 cyberpunk-card p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-neon-blue mb-4">系统错误</h2>
          
          <div className="bg-darker-bg border border-neon-blue p-4 rounded text-left mb-6 font-mono text-sm text-neon-green">
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {terminalText}
              <span className="inline-block w-2 h-4 bg-neon-green animate-pulse"></span>
            </pre>
          </div>
          
          <p className="text-gray-400 mb-8">该页面可能已被黑客入侵或被系统移除。请返回安全区域。</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="cyberpunk-button inline-flex items-center px-4 py-2 rounded-md"
            >
              <MoveLeft className="w-5 h-5 mr-2" />
              返回上页
            </button>

            <Link
              href="/"
              className="cyberpunk-button inline-flex items-center px-4 py-2 rounded-md"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
        
        {/* 装饰性警告条 */}
        <div className="mt-8 flex overflow-hidden">
          <div className="flex-1 h-6 bg-neon-blue bg-opacity-20 border-t border-b border-neon-blue flex items-center">
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-4 text-xs text-neon-blue">警告: 系统入侵检测</span>
              <span className="mx-4 text-xs text-neon-blue">错误代码: 404</span>
              <span className="mx-4 text-xs text-neon-blue">区域受限</span>
              <span className="mx-4 text-xs text-neon-blue">请返回安全区域</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 装饰性噪点效果 */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
      
      {/* 装饰性电路图样式 */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,10 L30,10 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70" stroke="var(--neon-blue)" fill="none" strokeWidth="0.5" />
          <path d="M90,30 L70,30 L70,50 L50,50 L50,70 L30,70 L30,90 L10,90" stroke="var(--neon-pink)" fill="none" strokeWidth="0.5" />
          <circle cx="10" cy="10" r="2" fill="var(--neon-blue)" />
          <circle cx="30" cy="30" r="2" fill="var(--neon-blue)" />
          <circle cx="50" cy="50" r="2" fill="var(--neon-blue)" />
          <circle cx="70" cy="70" r="2" fill="var(--neon-blue)" />
          <circle cx="90" cy="30" r="2" fill="var(--neon-pink)" />
          <circle cx="70" cy="50" r="2" fill="var(--neon-pink)" />
          <circle cx="50" cy="70" r="2" fill="var(--neon-pink)" />
          <circle cx="30" cy="90" r="2" fill="var(--neon-pink)" />
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M90,90 L70,90 L70,70 L50,70 L50,50 L30,50 L30,30 L10,30" stroke="var(--neon-green)" fill="none" strokeWidth="0.5" />
          <path d="M10,70 L30,70 L30,50 L50,50 L50,30 L70,30 L70,10 L90,10" stroke="var(--neon-purple)" fill="none" strokeWidth="0.5" />
          <circle cx="90" cy="90" r="2" fill="var(--neon-green)" />
          <circle cx="70" cy="70" r="2" fill="var(--neon-green)" />
          <circle cx="50" cy="50" r="2" fill="var(--neon-green)" />
          <circle cx="30" cy="30" r="2" fill="var(--neon-green)" />
          <circle cx="10" cy="70" r="2" fill="var(--neon-purple)" />
          <circle cx="30" cy="50" r="2" fill="var(--neon-purple)" />
          <circle cx="50" cy="30" r="2" fill="var(--neon-purple)" />
          <circle cx="70" cy="10" r="2" fill="var(--neon-purple)" />
        </svg>
      </div>
    </div>
  );
};

export default CyberpunkPageNotFoundView;