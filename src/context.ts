/**
 * Transactional Auth React - Context
 */

import { createContext } from 'react';
import type { TransactionalAuthContextValue } from './types';

const defaultContext: TransactionalAuthContextValue = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  loginWithRedirect: async () => {
    throw new Error('TransactionalAuthProvider not found');
  },
  loginWithPopup: async () => {
    throw new Error('TransactionalAuthProvider not found');
  },
  logout: async () => {
    throw new Error('TransactionalAuthProvider not found');
  },
  getAccessToken: async () => {
    throw new Error('TransactionalAuthProvider not found');
  },
  getIdTokenClaims: async () => {
    throw new Error('TransactionalAuthProvider not found');
  },
  hasPermission: () => false,
  hasRole: () => false,
};

export const TransactionalAuthContext = createContext<TransactionalAuthContextValue>(defaultContext);
