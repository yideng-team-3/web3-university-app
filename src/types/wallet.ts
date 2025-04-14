// 用户接口
export interface User {
  id: number;
  walletAddress: string;
  username: string;
  avatarUrl?: string;
  ensName?: string;
}

// 认证状态接口
export interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
}
