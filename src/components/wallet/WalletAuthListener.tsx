import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { walletConnectedAtom, isAuthenticatedAtom, walletAddressAtom } from '@/stores/walletStore';
import useWeb3Auth from '@/hooks/useWeb3Login';

const WalletAuthListener = () => {
  const { isConnected, address } = useAccount();
  const { login, isLoggedIn, isLoading, error } = useWeb3Auth();
  const [, setWalletConnected] = useAtom(walletConnectedAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [storedAddress, setStoredAddress] = useAtom(walletAddressAtom);

  // Sync wallet connection state
  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(true);
      setStoredAddress(address);
    } else if (!isConnected) {
      setWalletConnected(false);
      setStoredAddress('');
      setIsAuthenticated(false);
    }
  }, [isConnected, address, setWalletConnected, setStoredAddress, setIsAuthenticated]);

  // Monitor auth state
  useEffect(() => {
    setIsAuthenticated(!!isLoggedIn);
  }, [isLoggedIn, setIsAuthenticated]);

  // Handle automatic login when wallet is connected but not authenticated
  useEffect(() => {
    // Only attempt login if:
    // 1. Wallet is connected
    // 2. We have an address
    // 3. User is not already logged in
    // 4. Not currently loading
    // 5. We haven't tried to authenticate with this address yet
    const shouldAttemptLogin = 
      isConnected && 
      address && 
      !isLoggedIn && 
      !isLoading && 
      address === storedAddress && 
      !isAuthenticated;
    
    if (shouldAttemptLogin) {
      // Display loading toast
      const loadingToast = toast.loading('正在准备登录...');
      
      // Attempt login
      login()
        .then((user) => {
          if (user) {
            toast.success('登录成功！');
            setIsAuthenticated(true);
            console.log('用户已登录:', user);
          } else {
            toast.error('登录失败，请手动尝试登录');
            console.error('登录返回结果为空');
            setIsAuthenticated(false);
          }
        })
        .catch((err) => {
          toast.error(`登录失败: ${err?.message || '未知错误'}`);
          console.error('登录出错:', err);
          setIsAuthenticated(false);
        })
        .finally(() => {
          // Dismiss loading toast
          toast.dismiss(loadingToast);
        });
    }
  }, [isConnected, address, isLoggedIn, isLoading, storedAddress, isAuthenticated, login, setIsAuthenticated]);

  // Display error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // This component doesn't render anything
  return null;
};

export default WalletAuthListener;