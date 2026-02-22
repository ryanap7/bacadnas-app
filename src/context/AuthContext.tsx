import React, { createContext, useContext, useEffect } from 'react';
import type { AuthActions, AuthState } from '~/store/store.types';
import { authSelectors, useAuthStore } from '~/store/useAuthStore';

/**
 * Auth Context Type
 * Combines state dan actions untuk easy consumption
 */
type AuthContextType = AuthState & AuthActions;

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Provides authentication state dan actions ke seluruh app
 * Menggunakan Zustand store di belakang layar
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Subscribe to entire auth store
  const authStore = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    authStore.checkAuth();
  }, []);

  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Custom hook untuk access auth context
 * 
 * @example
 * ```tsx
 * // Get all auth state dan actions
 * const auth = useAuth();
 * 
 * // Use specific state
 * const { isAuthenticated, user, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Optimized Auth Selectors
 * Use these hooks untuk subscribe ke specific auth state
 * Prevents unnecessary re-renders
 * 
 * @example
 * ```tsx
 * // Only re-renders when isAuthenticated changes
 * const isAuthenticated = useIsAuthenticated();
 * 
 * // Only re-renders when user changes
 * const user = useAuthUser();
 * ```
 */
export const useIsAuthenticated = () => useAuthStore(authSelectors.isAuthenticated);
export const useAuthUser = () => useAuthStore(authSelectors.user);
export const useAuthToken = () => useAuthStore(authSelectors.token);
export const useAuthLoading = () => useAuthStore(authSelectors.isLoading);

/**
 * Auth Action Hooks
 * Use these hooks untuk access auth actions without subscribing to state
 * 
 * @example
 * ```tsx
 * const login = useAuthLogin();
 * const logout = useAuthLogout();
 * ```
 */
export const useAuthLogin = () => useAuthStore((state) => state.login);
export const useAuthLogout = () => useAuthStore((state) => state.logout);
export const useAuthRegister = () => useAuthStore((state) => state.register);
export const useAuthUpdateUser = () => useAuthStore((state) => state.updateUser);