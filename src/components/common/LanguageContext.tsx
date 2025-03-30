"use client";

import React, { createContext, useState, useContext } from "react";
import {
  getTranslation,
  Language,
  LanguageContextType,
  LanguageProviderProps,
} from "@/utils/languages";

// 创建语言环境上下文
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // 从localStorage或浏览器语言获取初始语言
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("language") as Language;
      if (storedLanguage && ["zh", "en", "ja", "ko"].includes(storedLanguage)) {
        return storedLanguage;
      }

      // 如果没有存储的语言，尝试从浏览器获取
      const browserLang = navigator.language.split("-")[0];
      if (["zh", "en", "ja", "ko"].includes(browserLang)) {
        return browserLang as Language;
      }
    }

    // 默认语言
    return "zh";
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // 切换语言
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  // 翻译函数
  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook，用于获取语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
