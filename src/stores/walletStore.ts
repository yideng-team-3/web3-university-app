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

// Derived atom to determine if we need to show the connect button
export const shouldShowConnectAtom = atom(
  (get) => !get(walletConnectedAtom)
);