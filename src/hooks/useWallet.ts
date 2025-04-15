import { useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage, usePublicClient } from 'wagmi';

export function useWallet() {
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();

  // 获取后端生成的nonce
  const fetchNonce = async (walletAddress: string): Promise<Record<string, unknown>> => {
    try {
      const response = await fetch(`http://localhost:3001/auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      if (!response.ok) {
        throw new Error('获取nonce失败');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取nonce出错:', error);
      throw error;
    }
  };

  // 验证签名登录
  const verifySignature = async (
    walletAddress: string,
    signature: string,
    nonce: string,
  ): Promise<{ accesstoken: string; user: Record<string, unknown> }> => {
    try {
      const response = await fetch('http://localhost:3001/auth/web3-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, signature, nonce }),
      });

      if (!response.ok) {
        throw new Error('验证签名失败');
      }

      return await response.json();
    } catch (error) {
      console.error('验证签名出错:', error);
      throw error;
    }
  };

  const checkLoginStatus = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }
    try {
      const response = await fetch(
        `http://localhost:3001/auth/check-login-status?walletAddress=${address}`,
      );

      if (!response.ok) {
        throw new Error('检查登录状态失败');
      }
      const data = await response.json();
      if (data.isLoggedIn) {
        console.log('用户已登录:', data.user);
        localStorage.setItem('auth_token', data.accesstoken);
        return true;
      }
      console.log('用户未登录');
      return false;
    } catch (error) {
      console.error('检查登录状态出错:', error);
      throw error;
    }
  };

  // 签名登录
  const signIn = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }

    try {
      const { nonce, signMessage } = await fetchNonce(address);

      // 请求用户签名
      const signature = await signMessageAsync({
        message: signMessage as string,
      });

      // 验证签名
      const { accesstoken, user } = await verifySignature(address, signature, nonce as string);

      console.log('登录成功:', user);

      localStorage.setItem('auth_token', accesstoken);

      return true;
    } catch (error) {
      console.error('签名登录失败:', error);
      return false;
    }
  };

  // 登出
  const signOut = () => {
    localStorage.removeItem('auth_token');
  };

  const formatAddress = useCallback(
    (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`,
    [],
  );

  const connect = async () => {
    try {
      // 查找 MetaMask 连接器
      const metaMaskConnector = connectors.find(c => c.id === 'metaMask');

      if (!metaMaskConnector) {
        throw new Error('找不到 MetaMask 连接器');
      }

      await connectAsync({ connector: metaMaskConnector });
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  return {
    isActive: isConnected,
    connect,
    disconnect,
    account: address,
    chainId,
    provider: publicClient, // 注意：这不完全等同于 ethers provider
    formatAddress,
    signIn,
    signOut,
    checkLoginStatus,
  };
}
