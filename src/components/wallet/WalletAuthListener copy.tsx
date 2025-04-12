// 在任意组件中 (例如 _app.tsx 或专门的 AuthProvider 组件)
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useWeb3Auth from '@/hooks/useWeb3Login';
import { toast } from 'react-hot-toast'; // 假设使用toast来提示用户

const WalletAuthListener = () => {
  const { isConnected, address } = useAccount();
  const { login, isLoggedIn, isLoading, error } = useWeb3Auth();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // 监听钱包连接状态变化
  useEffect(() => {
    // 如果钱包已连接、还未登录且没有尝试过登录
    if (isConnected && address && !isLoggedIn && !hasAttemptedLogin && !isLoading) {
      // 设置标志，防止多次触发登录
      setHasAttemptedLogin(true);
      
      // 显示准备登录提示
      toast.loading('正在准备登录...');
      
      // 执行登录流程
      login()
        .then((user) => {
          if (user) {
            toast.success('登录成功！');
            console.log('用户已登录:', user);
          } else {
            toast.error('登录失败，请手动尝试登录');
            console.error('登录返回结果为空');
          }
        })
        .catch((err) => {
          toast.error(`登录失败: ${  err?.message || '未知错误'}`);
          console.error('登录出错:', err);
        })
        .finally(() => {
          // 清除登录中状态
          toast.dismiss();
        });
    }
    
    // 如果钱包断开连接，重置登录尝试标志
    if (!isConnected) {
      setHasAttemptedLogin(false);
    }
  }, [isConnected, address, isLoggedIn, hasAttemptedLogin, isLoading, login]);

  // 显示错误消息
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // 这个组件不需要渲染任何UI
  return null;
};

export default WalletAuthListener;