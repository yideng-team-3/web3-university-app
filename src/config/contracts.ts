// 合约地址配置
export const CONTRACT_ADDRESSES = {
  // Sepolia 测试网
  SEPOLIA: {
    YIDENG_TOKEN: '0x41cb388B29EfC443d5aC1dD511B186249bD0fe45', // 需要替换为实际部署的合约地址
  },
  // 主网
  MAINNET: {
    YIDENG_TOKEN: '0x41cb388B29EfC443d5aC1dD511B186249bD0fe45', // 需要替换为实际部署的合约地址
  },
} as const;

// 获取当前网络的合约地址
export const getContractAddress = (chainId: number) => {
  switch (chainId) {
    case 11155111: // Sepolia
      return CONTRACT_ADDRESSES.SEPOLIA;
    case 1: // Mainnet
      return CONTRACT_ADDRESSES.MAINNET;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}; 