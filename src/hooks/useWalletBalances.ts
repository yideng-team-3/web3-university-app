import { useMemo } from 'react';
import { CHAINS } from '@utils/chains';
import EthereumIcon from '../../public/icons/Mainnet.svg';

// 链图标映射
const CHAIN_ICONS: Record<number, string> = {
  1: EthereumIcon,
  // 添加其他需要的链ID和图标路径...
};

export interface NetworkInfo {
  name: string;
  chainId: number;
  icon: string;
}

export function useWalletBalances() {
  return useMemo(() => {
    return Object.entries(CHAINS).map(([id, chain]) => ({
      name: chain.name,
      chainId: Number(id),
      icon: CHAIN_ICONS[Number(id)] || null,
    }));
  }, []);
}
