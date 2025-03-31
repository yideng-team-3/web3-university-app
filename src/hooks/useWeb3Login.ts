import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

// 定义API基础URL（可考虑移至环境配置文件中）
const API_BASE_URL = 'http://localhost:3001/dev';

// 用户接口
interface User {
  id: number;
  walletAddress: string;
  username: string;
  avatarUrl?: string;
  ensName?: string;
}

// 认证状态接口
interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Web3身份验证Hook - 使用useWallet做钱包连接
 */
const useWeb3Auth = () => {
  // 使用现有的useWallet hook
  const { 
    isActive, 
    isActivating, 
    connect: connectWallet, 
    disconnect: disconnectWallet,
    account, 
    chainId,
    provider,
    formatAddress
  } = useWallet();

  const [state, setState] = useState<AuthState>({
    isLoading: false,
    isLoggedIn: false,
    user: null,
    error: null,
  });

  // API服务 - 仅保留认证相关功能
  const apiService = {
    // 获取nonce
    fetchNonce: async (address: string): Promise<{nonce: string, signMessage: string}> => {
      const response = await fetch(`${API_BASE_URL}/auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress: address })
      });
      
      if (!response.ok) {
        throw new Error('获取nonce失败');
      }
      
      return await response.json();
    },
    
    // 验证签名
    verifySignature: async (address: string, signature: string, nonce: string, ensName?: string | null): Promise<{accessToken: string, user: User}> => {
      const response = await fetch(`${API_BASE_URL}/auth/web3-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          nonce,
          ensName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '登录失败');
      }
      
      return await response.json();
    },
    
    // 检查登录状态
    checkLoginStatus: async (token: string): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      
      return (await response.json()).user;
    }
  };

  // 初始化 - 检查本地存储中的令牌
  useEffect(() => {
    // 检查登录令牌
    const token = localStorage.getItem('auth_token');
    if (token) {
      setState(prev => ({ ...prev, isLoading: true }));
      
      apiService.checkLoginStatus(token)
        .then(user => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isLoggedIn: true,
            user,
          }));
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setState(prev => ({
            ...prev,
            isLoading: false,
            isLoggedIn: false,
          }));
        });
    }
  }, []);

  // 连接钱包 - 使用useWallet提供的方法
  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await connectWallet();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error)?.message || '连接钱包失败，请重试！'
      }));
      
      return false;
    }
  }, [connectWallet]);

  // 登录
  const login = useCallback(async () => {
    if (!isActive || !account || !provider) {
      const connected = await connect();
      if (!connected) return null;
    }

    if (!account) {
      setState(prev => ({
        ...prev,
        error: '未找到钱包地址'
      }));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 1. 获取nonce
      const { nonce, signMessage } = await apiService.fetchNonce(account);
      
      // 2. 签名消息
      if (!provider) {
        throw new Error('获取签名器失败');
      }
      
      const signature = await provider.getSigner().signMessage(signMessage);
      
      // 3. 获取ENS名称(如果有)
      let ensName = null;
      try {
        if (provider && account) {
          ensName = await provider.lookupAddress(account);
        }
      } catch (e) {
        console.log('获取ENS名称失败');
      }
      
      // 4. 验证签名
      const { accessToken, user } = await apiService.verifySignature(
        account,
        signature,
        nonce,
        ensName
      );
      
      // 5. 保存token
      localStorage.setItem('auth_token', accessToken);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isLoggedIn: true,
        user,
      }));
      
      return user;
    } catch (error) {
      console.error('登录失败:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error)?.message || '登录失败，请重试！'
      }));
      
      return null;
    }
  }, [account, isActive, provider, connect]);

  // 检查登录状态
  const checkLoginStatus = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const user = await apiService.checkLoginStatus(token);
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        user,
      }));
      return true;
    } catch (error) {
      localStorage.removeItem('auth_token');
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: null,
      }));
      return false;
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
      user: null,
    }));

    // 可选择是否也断开钱包连接
    // disconnectWallet();
  }, []);

  // 返回状态和方法
  return {
    ...state,
    walletAddress: account || null,
    isActive,
    isActivating,
    chainId,
    provider,
    connect,
    disconnect: disconnectWallet,
    login,
    logout,
    checkLoginStatus,
    formatAddress,
  };
};

export default useWeb3Auth;
