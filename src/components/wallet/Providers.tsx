"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { RainbowKitProvider, lightTheme, Locale } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { createConfig } from "wagmi";
import { useLanguage } from "@/components/common/LanguageContext";

// 创建查询客户端
const queryClient = new QueryClient();

// 配置你想支持的链
const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
  ssr: true,
});

// Create the providers component separately from the hook consuming component
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LocalizedRainbowKitProvider>
          {children}
        </LocalizedRainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// This component will handle the locale logic
function LocalizedRainbowKitProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh-CN" as Locale);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update locale based on language
  useEffect(() => {
    switch (language) {
      case "ja":
        setLocale("ja-JP" as Locale);
        break;
      case "ko":
        setLocale("ko-KR" as Locale);
        break;
      case "en":
        setLocale("en-US" as Locale);
        break;
      case "zh":
      default:
        setLocale("zh-CN" as Locale);
        break;
    }
  }, [language]);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <RainbowKitProvider
      theme={lightTheme({
        accentColor: "#4F46E5", // 配合你的 UI 主题颜色 (indigo-600)
        accentColorForeground: "white",
        borderRadius: "medium",
        fontStack: "system",
      })}
      locale={locale}
    >
      {children}
    </RainbowKitProvider>
  );
}

// This is your original exported component, now using the Providers
interface Web3ProvidersProps {
  children: ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  return <Providers>{children}</Providers>;
}