'use client';

import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/components/common/LanguageContext';
import { useAccount } from 'wagmi';

export const CustomConnectButton = () => {
  const { t } = useLanguage();
  const { isConnected } = useAccount();
  
  // 添加一个副作用，用于调试连接状态
  useEffect(() => {
    console.log('Wallet connection status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    data-testid="connect-wallet-button"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {t('button.connectWallet') || '连接钱包'}
                  </button>
                );
              }

              if (chain?.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    {t('wallet.wrongNetwork') || '网络错误'}
                  </button>
                );
              }

              return (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    title={t('wallet.switchNetwork') || '切换网络'}
                  >
                    {chain?.hasIcon && (
                      <div
                        className="w-4 h-4 mr-1.5"
                        style={{
                          background: chain.iconBackground,
                          borderRadius: '50%',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? (t('wallet.chainIcon') || '链图标')}
                            src={chain.iconUrl}
                            style={{ width: '100%', height: '100%' }}
                          />
                        )}
                      </div>
                    )}
                    {chain?.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
                    title={t('wallet.accountDetails') || '账户详情'}
                  >
                    {account?.displayName}
                    {account?.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;