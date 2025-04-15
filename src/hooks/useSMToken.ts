import { useCallback, useState, useEffect } from 'react';
import { parseEther, formatEther, getContract } from 'viem';
import { useWriteContract } from 'wagmi';
import contractConfig from '@/config/abi.json';
import type { ContractConfig } from '@/types/contract';
import { useWallet } from './useWallet';

// ETH的特殊标识地址（零地址）
const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
// SM代币合约地址
const SM_TOKEN_ADDRESS = contractConfig.smToken.address as `0x${string}`;
// 存款合约地址
const DEPOSIT_CONTRACT_ADDRESS = contractConfig.depositContract.address as `0x${string}`;

export function useDepositContract() {
  const { provider, account } = useWallet();
  const config = contractConfig as ContractConfig;
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [smBalance, setSmBalance] = useState('0');
  const [nativeBalance, setNativeBalance] = useState('0'); // ETH钱包余额

  // 使用 wagmi 的 writeContract 钩子
  const { writeContractAsync } = useWriteContract();

  // 创建存款合约实例
  const getDepositContract = useCallback(() => {
    if (!provider || !account) return null;
    return getContract({
      address: DEPOSIT_CONTRACT_ADDRESS,
      abi: config.depositContract.abi,
      client: provider,
    });
  }, [provider, account, config.depositContract.abi]);

  const getBalance = useCallback(async () => {
    if (!provider || !account) return '0';
    try {
      const contract = getDepositContract();
      if (!contract) return '0';

      const balanceInstance = (await contract.read.getBalance([
        NATIVE_ETH_ADDRESS as `0x${string}`,
        account as `0x${string}`,
      ])) as bigint;

      const formattedBalance = formatEther(balanceInstance);
      setBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      return '0';
    }
  }, [provider, account, getDepositContract]);

  const getSmBalance = useCallback(async () => {
    if (!provider || !account) return '0';
    try {
      const contract = getDepositContract();
      if (!contract) return '0';

      const balanceInstance = (await contract.read.getBalance([
        SM_TOKEN_ADDRESS,
        account as `0x${string}`,
      ])) as bigint;

      const formattedBalance = formatEther(balanceInstance);
      setSmBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch SM balance:', err);
      return '0';
    }
  }, [provider, account, getDepositContract]);

  const getNativeBalance = useCallback(async () => {
    if (!provider || !account) return '0';
    try {
      // 使用viem的publicClient获取账户余额
      const balanceInstance = (await provider.getBalance({
        address: account as `0x${string}`,
      })) as bigint;

      const formattedBalance = formatEther(balanceInstance);
      setNativeBalance(formattedBalance);
      return formattedBalance;
    } catch (err) {
      console.error('Failed to fetch ETH balance:', err);
      return '0';
    }
  }, [provider, account]);

  const updateBalances = useCallback(async () => {
    await Promise.all([getBalance(), getSmBalance(), getNativeBalance()]);
  }, [getBalance, getSmBalance, getNativeBalance]);

  useEffect(() => {
    updateBalances();
    // 可选：设置定期更新余额
    const interval = setInterval(updateBalances, 10000); // 每10秒更新一次
    return () => clearInterval(interval);
  }, [updateBalances]);

  const deposit = useCallback(
    async (amount: string) => {
      if (!account || !provider) throw new Error('No provider');
      setIsLoading(true);
      try {
        await writeContractAsync({
          address: DEPOSIT_CONTRACT_ADDRESS,
          abi: config.depositContract.abi,
          functionName: 'deposit',
          value: parseEther(amount),
        });

        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [account, provider, writeContractAsync, config.depositContract.abi, updateBalances],
  );

  const withdraw = useCallback(
    async (amount: string) => {
      if (!account || !provider) throw new Error('No provider');
      setIsLoading(true);
      try {
        await writeContractAsync({
          address: DEPOSIT_CONTRACT_ADDRESS,
          abi: config.depositContract.abi,
          functionName: 'withdraw',
          args: [parseEther(amount)],
        });

        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [account, provider, writeContractAsync, config.depositContract.abi, updateBalances],
  );

  const depositSM = useCallback(
    async (amount: string) => {
      if (!account || !provider) throw new Error('Contract not initialized');
      setIsLoading(true);
      try {
        await writeContractAsync({
          address: DEPOSIT_CONTRACT_ADDRESS,
          abi: config.depositContract.abi,
          functionName: 'depositToken',
          args: [SM_TOKEN_ADDRESS, parseEther(amount)],
        });

        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [account, provider, writeContractAsync, config.depositContract.abi, updateBalances],
  );

  const withdrawSM = useCallback(
    async (amount: string) => {
      if (!account || !provider) throw new Error('Contract not initialized');
      setIsLoading(true);
      try {
        await writeContractAsync({
          address: DEPOSIT_CONTRACT_ADDRESS,
          abi: config.depositContract.abi,
          functionName: 'withdrawToken',
          args: [SM_TOKEN_ADDRESS, parseEther(amount)],
        });

        await updateBalances();
      } finally {
        setIsLoading(false);
      }
    },
    [account, provider, writeContractAsync, config.depositContract.abi, updateBalances],
  );

  return {
    ethBalance: balance,
    smBalance,
    nativeBalance,
    deposit,
    withdraw,
    depositSM,
    withdrawSM,
    isLoading,
    updateBalances,
  };
}
