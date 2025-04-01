import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Store whether the wallet has been connected in this session
export const walletConnectedAtom = atomWithStorage('walletConnected', false);

// Store the wallet address
export const walletAddressAtom = atomWithStorage('walletAddress', '');

// Store authentication status
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
    if (!connected) {
      set(isAuthenticatedAtom, false);
    }
  }
);

// Derived atom to determine if we need to show the connect button
export const shouldShowConnectAtom = atom(
  (get) => !get(walletConnectedAtom)
);