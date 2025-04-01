'use client';

import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLanguage } from '@/components/common/LanguageContext';
import { useAccount } from 'wagmi';
import { useAtom } from 'jotai';
import { walletConnectedAtom, walletAddressAtom, chainIdAtom } from '@/stores/walletStore';

export const CustomConnectButton = () => {
  const { t } = useLanguage();
  const { isConnected, address } = useAccount();
  const [walletConnected, setWalletConnected] = useAtom(walletConnectedAtom);
  const [, setStoredAddress] = useAtom(walletAddressAtom);
  const [, setChainId] = useAtom(chainIdAtom);
  
  // State to track the chain ID at component level
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(undefined);
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Mark component as mounted after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Sync Wagmi state with our Jotai atoms
  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(true);
      setStoredAddress(address);
    } else if (!isConnected) {
      // Only reset if we're actually disconnected
      // This prevents the button from flashing during page transitions
      setWalletConnected(false);
      setStoredAddress('');
    }
  }, [isConnected, address, setWalletConnected, setStoredAddress]);

  // Debug logging
  useEffect(() => {
    console.log('Wallet connection status:', isConnected ? 'Connected' : 'Disconnected');
    console.log('Stored wallet connection:', walletConnected ? 'Connected' : 'Disconnected');
  }, [isConnected, walletConnected]);
  
  // Update chain ID in global store when our local state changes
  useEffect(() => {
    if (currentChainId) {
      setChainId(currentChainId);
    }
  }, [currentChainId, setChainId]);

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
        // Update local state when chain changes
        // This is safe because we're not calling a Hook here,
        // just updating state from a prop
        if (chain?.id !== currentChainId) {
          setCurrentChainId(chain?.id);
        }

        // 修改这里：使用组件本地的挂载状态和 RainbowKit 的挂载状态
        const ready = mounted && isMounted;
        const connected = ready && account && chain;

        // 始终返回一个包含元素，无论可见性如何
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
            {!connected && (
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
            )}

            {connected && chain?.unsupported && (
              <button
                onClick={openChainModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                {t('wallet.wrongNetwork') || '网络错误'}
              </button>
            )}

            {connected && !chain?.unsupported && (
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
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;