'use client';

import React, { useState, useEffect } from 'react';
import { parseEther, formatEther } from 'viem';
import { useAccount, useBalance, useWriteContract, useChainId, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import YiDengTokenABI from '@/contracts/abis/YiDengToken.json';
import { toast } from 'react-hot-toast';
import { getContractAddress } from '@/config/contracts';
import { sepolia } from 'wagmi/chains';
import { useAtom } from 'jotai';
import { walletConnectedAtom, chainIdAtom } from '@/stores/walletStore';
import { CustomConnectButton } from '../wallet/CustomConnectButton';
import { useTokenExchange } from '@/hooks/useTokenExchange';
import { useLanguage } from '@/components/language/Context';

// 添加数字滚动动画组件
const AnimatedNumber: React.FC<{ value: number | string; duration?: number; format?: 'integer' | 'decimal' }> = ({ 
  value, 
  duration = 1000,
  format = 'decimal'
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const startValue = typeof displayValue === 'number' ? displayValue : parseFloat(displayValue);
      const endValue = typeof value === 'number' ? value : parseFloat(value);
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        setDisplayValue(format === 'integer' ? Math.floor(currentValue).toString() : currentValue.toFixed(3));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(format === 'integer' ? Math.floor(endValue).toString() : value);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, duration, format]);

  return (
    <span className={`transition-all duration-300 ${isAnimating ? 'text-[#00ffff]' : ''}`}>
      {displayValue}
    </span>
  );
};

export const TokenExchange: React.FC = () => {
  const [walletConnected] = useAtom(walletConnectedAtom);
  const { t } = useLanguage();
  const {
    address,
    amount,
    setAmount,
    isBuying,
    setIsBuying,
    ethBalance,
    ydBalance,
    isCorrectNetwork,
    isPending,
    isConfirming,
    contractAddress,
    handleSwitchNetwork,
    handleTransaction
  } = useTokenExchange();

  if (!walletConnected) {
    return (
      <div className="relative p-8 rounded-3xl bg-transparent border border-[#00ffff] shadow-lg transition-all duration-300 hover:border-[#ff00ff] group max-w-[480px]">
        {/* 添加发光效果 */}
        <div className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] shadow-[0_0_20px_rgba(0,255,255,0.3)]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6">{t('tokenExchange.title')}</h2>
          <p className="text-gray-300 mb-6">{t('tokenExchange.connectWallet')}</p>
          <div className="flex justify-center">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="relative p-8 rounded-3xl bg-transparent border border-[#00ffff] shadow-lg transition-all duration-300 hover:border-[#ff00ff] group max-w-[480px]">
        {/* 添加发光效果 */}
        <div className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] shadow-[0_0_20px_rgba(0,255,255,0.3)]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6">{t('tokenExchange.title')}</h2>
          <p className="text-gray-300 mb-6">{t('tokenExchange.switchNetwork')}</p>
          <div className="flex justify-center">
            <button
              onClick={handleSwitchNetwork}
              className="px-6 py-2 rounded text-white bg-transparent border border-[#00ffff] hover:border-[#ff00ff] shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_10px_rgba(255,0,255,0.3)] transition-all duration-300"
            >
              {t('tokenExchange.switchToSepolia')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-8 rounded-3xl bg-transparent border border-[#00ffff] shadow-lg transition-all duration-300 hover:border-[#ff00ff] group max-w-[480px]">
      {/* 添加发光效果 */}
      <div className="absolute inset-0 rounded-3xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] shadow-[0_0_20px_rgba(0,255,255,0.3)]"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isBuying ? t('tokenExchange.buyYD') : t('tokenExchange.exchangeETH')}
        </h2>

        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-300">
            <p>{t('tokenExchange.ethBalance')} <AnimatedNumber value={ethBalance} format="decimal" /></p>
          </div>
          <button
            onClick={() => {
              setIsBuying(!isBuying);
              setAmount('');
            }}
            className="text-[#00ffff] mx-4 hover:text-[#ff00ff] transition-all duration-300 text-2xl group-hover:text-[#ff00ff]"
          >
            ⇄
          </button>
          <div className="text-gray-300">
            <p>{t('tokenExchange.ydBalance')} <AnimatedNumber value={parseInt(ydBalance as string, 10)} format="integer" /></p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 flex items-center">
            <label className="block text-gray-300 whitespace-nowrap">{isBuying ? t('tokenExchange.ethAmount') : t('tokenExchange.ydAmount')}</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step={isBuying ? 0.01 : 10}
                min="0"
                className="w-32 p-2 ml-4 rounded bg-transparent text-white border border-[#00ffff] focus:outline-none focus:border-[#ff00ff] transition-all duration-300 group-hover:border-[#ff00ff] shadow-[0_0_10px_rgba(0,255,255,0.1)] group-hover:shadow-[0_0_10px_rgba(255,0,255,0.1)]"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
            </div>
            <style jsx global>{`
              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }
              input[type=number] {
                -moz-appearance: textfield;
              }
            `}</style>
          </div>
          <div className="flex-1 text-right">
            <p className="text-[#00ffff] group-hover:text-[#ff00ff] transition-colors duration-300">
              {t('tokenExchange.estimated')}: {amount ? (isBuying ? (Number(amount) * 1000).toFixed(0) : (Number(amount) / 1000).toFixed(3)) : '0'} {isBuying ? 'YD' : 'ETH'}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              console.log('按钮被点击', {
                isPending,
                isConfirming,
                amount,
                address,
                contractAddress
              });
              handleTransaction();
            }}
            disabled={isPending || isConfirming || !amount || !address || !contractAddress}
            className={`relative px-6 py-2 rounded-xl text-white transition-all duration-300
              ${(isPending || isConfirming || !amount || !address || !contractAddress)
                ? 'bg-transparent border border-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-transparent border border-[#00ffff] hover:border-[#ff00ff] group-hover:border-[#ff00ff]'
              }`}
          >
            <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(255,0,255,0.3)] shadow-[0_0_10px_rgba(0,255,255,0.3)]"></div>
            <span className="relative z-10">
              {isPending ? t('tokenExchange.confirming') : isConfirming ? t('tokenExchange.processing') : t('tokenExchange.confirm')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}; 