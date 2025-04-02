"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, Locale, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora, sepolia } from "wagmi/chains";
import { useLanguage } from "@/components/common/LanguageContext";
import { Provider as JotaiProvider } from 'jotai';

// 导入 RainbowKit 相关配置
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets';

// 创建查询客户端
const queryClient = new QueryClient();

// 设置 WalletConnect projectId (必须配置)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'; 

// 配置支持的链
const chains = [sepolia, mainnet, polygon, optimism, arbitrum, base, zora] as const;

// 配置钱包连接器
const walletList = [
  {
    groupName: '推荐钱包',
    wallets: [
      metaMaskWallet,
      coinbaseWallet,
      walletConnectWallet,
      rainbowWallet
    ]
  }
];

const connectors = connectorsForWallets(walletList, {
  appName: 'Web3 University',
  projectId
});

// 创建 Wagmi 配置
const wagmiConfig = createConfig({
  chains,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
  connectors,
  ssr: true,
});

// 导出最终的提供者组件
export function Web3Providers({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh-CN" as Locale);

  // 处理客户端水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根据语言更新区域设置
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

  return (
    <JotaiProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#4F46E5", // 配合你的 UI 主题颜色 (indigo-600)
              accentColorForeground: "white",
              borderRadius: "medium",
              fontStack: "system",
            })}
            locale={locale}
            showRecentTransactions={true}
            appInfo={{
              appName: 'Web3 University',
              learnMoreUrl: '/about',
            }}
          >
            {/* 重要：始终使用一个包装元素，即使隐藏也保持DOM结构一致 */}
            {!mounted ? (
              <div style={{ visibility: "hidden" }}>{children}</div>
            ) : (
              children
            )}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
}