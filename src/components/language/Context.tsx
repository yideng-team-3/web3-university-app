'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getTranslation,
  Language,
  LanguageContextType,
  LanguageProviderProps,
} from '@/utils/languages';

// 创建语言环境上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // 获取初始语言
  const getInitialLanguage = (): Language => 'en';  // 默认语言

  const [language, setLanguage] = useState<Language>('en');

  // 初始化语言 - 在客户端挂载后执行
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguage(initialLang);
  }, []);

  // 切换语言
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // 翻译函数
  const t = (key: string): string => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook，用于获取语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
