import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 1. 用户连接钱包 (walletConnected = true)
// 2。 用户签名消息以验证身份 (isAuthenticated = true)
// 3. 用户可以断开钱包连接 (walletConnected = false)，但可能仍然保持认证状态直到会话过期

// Store whether the wallet has been connected in this session
export const walletConnectedAtom = atomWithStorage('walletConnected', false);

// Store the wallet address
export const walletAddressAtom = atomWithStorage('walletAddress', '');

// Store authentication status 钱包签名
// 1. isAuthenticatedAtom 不应该独立决定用户是否已认证，而应该：
// 2. 在用户完成后端验证后设置为 true
// 3. 存储后端返回的认证令牌或会话信息
// 4. 在后续 API 请求中附带该令牌
// 5. 用于前端 UI 的条件渲染（显示/隐藏特定功能）
export const isAuthenticatedAtom = atomWithStorage('isAuthenticated', false);

// Store the chain ID
export const chainIdAtom = atomWithStorage('chainId', 0);

// 添加一个用于同步状态的原子
export const syncWalletStateAtom = atom(
  null, 
  (
    get, 
    set, 
    { connected, address, chainId }: { connected: boolean; address: string; chainId?: number }
  ) => {
    set(walletConnectedAtom, connected);
    set(walletAddressAtom, address);
    if (chainId) {
      set(chainIdAtom, chainId);
    }
    
    // 如果断开连接，也重置认证状态
    // 1. 这段代码的意义在于保持前后端状态一致性，但真正的安全边界应该在后端：
    // 2. 前端状态可以被篡改（用户可以修改 localStorage）
    // 3. 所有敏感操作必须通过后端 API 重新验证令牌有效性
    // 4. 后端应实现令牌过期、撤销机制
    if (!connected) {
      set(isAuthenticatedAtom, false);
    }
  }
);

// Derived atom to determine if we need to show the connect button
export const shouldShowConnectAtom = atom(
  (get) => !get(walletConnectedAtom)
);