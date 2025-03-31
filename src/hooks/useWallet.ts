import { useCallback, useEffect } from 'react';
import { hooks, metaMask } from '@connectors/metaMask';

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks;

export function useWallet() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  // 获取后端生成的nonce
  const fetchNonce = async (address: string): Promise<Record<string, unknown>> => {
    try {
      const response = await fetch(`http://localhost:3001/auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
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
   const verifySignature = async (address: string, signature: string, nonce: string): Promise<{ accesstoken: string; user: Record<string, unknown> }> => {
    try {
      const response = await fetch('http://localhost:3001/auth/web3-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address, signature, nonce }),
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
    if (!isActive || !accounts?.[0] || !provider) {
      throw new Error('钱包未连接');
    }
    try {
      const address = accounts[0];
      const response = await fetch(`http://localhost:3001/auth/check-login-status?walletAddress=${  address}`);

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
    if (!isActive || !accounts?.[0] || !provider) {
      throw new Error('钱包未连接');
    }

    try {
      const address = accounts[0];
      const { nonce, signMessage } = await fetchNonce(address);
      
      // 创建要签名的消息
      // const message = `请签名以登录 Web3 University\n\nNonce: ${nonce}`;
      
      // 请求用户签名
      const signature = await provider.getSigner().signMessage(signMessage as string);
      
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

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
    });
  }, []);

  // useEffect(() => {
  //   if (isActive) {
  //     // 连接成功后，验证签名
  //     checkLoginStatus().then((isLoggedIn) => {
  //       if (!isLoggedIn) {
  //         console.log('用户未登录');
  //         // 这里可以调用 signIn() 方法进行登录
  //         signIn();
  //       }
  //     });
  //   }
  // }, [isActive]);

  const formatAddress = useCallback((address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`, []);

  const connect = async () => {
    const resetWalletState = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {ethereum} = (window as any);

        // 先尝试直接处理掉待处理的请求
        if (ethereum?.request) {
          try {
            // 直接请求账户，这会清除之前的待处理请求
            await ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });
          } catch (permError) {
            console.debug('Permission request failed:', permError);
          }
        }

        // 清理所有监听器
        if (provider?.removeAllListeners) {
          provider.removeAllListeners();
        }

        if (ethereum?.removeAllListeners) {
          ethereum.removeAllListeners('connect');
          ethereum.removeAllListeners('accountsChanged');
          ethereum.removeAllListeners('chainChanged');
          ethereum.removeAllListeners('disconnect');
        }
        // 给 MetaMask 一点时间处理完所有请求
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.debug('Reset state failed:', error);
      }
    };

    const tryConnect = async () => {
      try {
        await metaMask.activate();
      } catch (err: unknown) {
        console.debug('MetaMask connection attempt failed:', (err as Error)?.message);

        if ((err as Error)?.message.includes('Already processing eth_requestAccounts')) {
          await resetWalletState();
        }
        throw err;
      }
    };

    return tryConnect();
  };

  const disconnect = () => {
    if (metaMask?.deactivate) {
      void metaMask.deactivate();
    } else {
      void metaMask.resetState();
    }
  };

  return {
    isActive,
    isActivating,
    connect,
    disconnect,
    account: accounts?.[0],
    chainId,
    provider,
    formatAddress,
    signIn,
    signOut,
    checkLoginStatus
  };
}
