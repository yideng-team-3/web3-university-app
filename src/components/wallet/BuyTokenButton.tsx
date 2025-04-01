'use client';

import React, { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance, useWriteContract, useChainId, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import YiDengTokenABI from '@/contracts/abis/YiDengToken.json';
import { toast } from 'react-hot-toast';
import { getContractAddress } from '@/config/contracts';
import { sepolia } from 'wagmi/chains';
import { useAtom } from 'jotai';
import { walletConnectedAtom, chainIdAtom } from '@/stores/walletStore';

export const BuyTokenButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [storedChainId] = useAtom(chainIdAtom);
  
  // Use stored chainId if available, otherwise use the one from Wagmi
  const effectiveChainId = chainId || storedChainId;
  
  // 获取用户 ETH 余额
  const { data: balance } = useBalance({
    address,
  });

  // 检查是否在 Sepolia 测试网
  const isCorrectNetwork = effectiveChainId === sepolia.id;

  // 获取当前网络的合约地址
  const contractAddress = effectiveChainId ? getContractAddress(effectiveChainId).YIDENG_TOKEN : null;

  // 读取 YiDeng 代币余额
  const { data: ydBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: YiDengTokenABI.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    // 移除 enabled 属性，使用条件渲染
    // 只有当地址和合约地址存在时才调用
  });

  // 合约写入函数
  const { writeContract, isPending, data: hash } = useWriteContract();

  // 监听交易状态
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 处理交易成功
  React.useEffect(() => {
    if (isSuccess) {
      toast.success('购买成功！');
      setIsOpen(false);
      setAmount('');
    }
  }, [isSuccess]);

  // 切换到 Sepolia 测试网
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: sepolia.id });
      toast.success('已切换到 Sepolia 测试网');
    } catch (_error) {
      toast.error('网络切换失败');
    }
  };

  const handleBuy = async () => {
    if (!amount) {
      toast.error('请输入购买数量');
      return;
    }

    if (!isCorrectNetwork) {
      toast.error('请切换到 Sepolia 测试网');
      return;
    }

    if (!contractAddress) {
      toast.error('不支持当前网络');
      return;
    }

    try {
      const value = parseEther(amount);
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: YiDengTokenABI.abi,
        functionName: 'buyWithETH',
        value,
      });
    } catch (_error) {
      toast.error('输入金额无效');
    }
  };

  const isDisabled = isPending || isConfirming || !amount;
  const buttonText = isPending ? '等待确认...' : isConfirming ? '交易确认中...' : '确认购买';

  const formattedYdBalance = ydBalance ? ydBalance.toString() : '0';

  // Only render if wallet is connected - this uses our persisted state
  if (!walletConnected) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ml-2"
      >
        购买 YD
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg py-2 z-50">
          <div className="px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900">购买 YiDeng 代币</h3>
            
            {!isCorrectNetwork ? (
              <div className="mt-4">
                <div className="text-sm text-red-600 mb-4">
                  请切换到 Sepolia 测试网进行购买
                </div>
                <button
                  onClick={handleSwitchNetwork}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  切换到 Sepolia 测试网
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    ETH 余额: {balance?.formatted} {balance?.symbol}
                  </p>
                  <p className="text-sm text-gray-500">
                    YD 余额: {formattedYdBalance} YD
                  </p>
                </div>
                <div className="mt-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    ETH 数量
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="输入 ETH 数量"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    预计获得: {amount ? Number(amount) * 1000 : 0} YD
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleBuy}
                    disabled={isDisabled}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};