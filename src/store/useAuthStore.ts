import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { appStorage } from '~/utils/storage';
import type { AuthStore, RegisterData, User } from './store.types';

/**
 * Initial Auth State
 * Loaded dari MMKV storage untuk persistence
 */
const getInitialState = () => ({
    isAuthenticated: appStorage.isAuthenticated(),
    user: appStorage.getUserData<User>() ?? null,
    token: appStorage.getAuthToken() ?? null,
    refreshToken: appStorage.getRefreshToken() ?? null,
    isLoading: false,
});

/**
 * Auth Store
 * Manages authentication state dan user data
 * Menggunakan Zustand + Immer untuk immutable state updates
 */
export const useAuthStore = create<AuthStore>()(
    immer((set, get) => ({
        // Initial state
        ...getInitialState(),

        // Actions
        login: async (email: string, password: string) => {
            try {
                set((state) => {
                    state.isLoading = true;
                });

                // TODO: Replace with actual API call
                // Simulasi API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock response
                const mockUser: User = {
                    id: '1',
                    email,
                    name: 'John Doe',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                };

                const mockToken = 'mock-jwt-token-' + Date.now();
                const mockRefreshToken = 'mock-refresh-token-' + Date.now();

                // Update state
                set((state) => {
                    state.isAuthenticated = true;
                    state.user = mockUser;
                    state.token = mockToken;
                    state.refreshToken = mockRefreshToken;
                    state.isLoading = false;
                });

                // Persist to storage
                appStorage.setIsAuthenticated(true);
                appStorage.setUserData(mockUser);
                appStorage.setAuthToken(mockToken);
                appStorage.setRefreshToken(mockRefreshToken);
            } catch (error) {
                set((state) => {
                    state.isLoading = false;
                });
                throw error;
            }
        },

        logout: () => {
            // Clear state
            set((state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isLoading = false;
            });

            // Clear storage
            appStorage.clearAuthData();
        },

        register: async (data: RegisterData) => {
            try {
                set((state) => {
                    state.isLoading = true;
                });

                // TODO: Replace with actual API call
                // Simulasi API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock response
                const mockUser: User = {
                    id: '1',
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    role: 'user',
                    createdAt: new Date().toISOString(),
                };

                const mockToken = 'mock-jwt-token-' + Date.now();
                const mockRefreshToken = 'mock-refresh-token-' + Date.now();

                // Update state
                set((state) => {
                    state.isAuthenticated = true;
                    state.user = mockUser;
                    state.token = mockToken;
                    state.refreshToken = mockRefreshToken;
                    state.isLoading = false;
                });

                // Persist to storage
                appStorage.setIsAuthenticated(true);
                appStorage.setUserData(mockUser);
                appStorage.setAuthToken(mockToken);
                appStorage.setRefreshToken(mockRefreshToken);
            } catch (error) {
                set((state) => {
                    state.isLoading = false;
                });
                throw error;
            }
        },

        updateUser: (data: Partial<User>) => {
            const currentUser = get().user;
            if (!currentUser) return;

            const updatedUser = { ...currentUser, ...data };

            set((state) => {
                state.user = updatedUser;
            });

            // Persist to storage
            appStorage.setUserData(updatedUser);
        },

        setToken: (token: string, refreshToken?: string) => {
            set((state) => {
                state.token = token;
                if (refreshToken) {
                    state.refreshToken = refreshToken;
                }
            });

            // Persist to storage
            appStorage.setAuthToken(token);
            if (refreshToken) {
                appStorage.setRefreshToken(refreshToken);
            }
        },

        checkAuth: () => {
            const isAuthenticated = appStorage.isAuthenticated();
            const user = appStorage.getUserData<User>();
            const token = appStorage.getAuthToken();
            const refreshToken = appStorage.getRefreshToken();

            set((state) => {
                state.isAuthenticated = isAuthenticated && !!token;
                state.user = user ?? null;
                state.token = token ?? null;
                state.refreshToken = refreshToken ?? null;
            });
        },

        refreshAuthToken: async () => {
            try {
                const currentRefreshToken = get().refreshToken;
                if (!currentRefreshToken) {
                    throw new Error('No refresh token available');
                }

                // TODO: Replace with actual API call
                // Simulasi API call untuk refresh token
                await new Promise((resolve) => setTimeout(resolve, 500));

                const newToken = 'new-mock-jwt-token-' + Date.now();
                const newRefreshToken = 'new-mock-refresh-token-' + Date.now();

                set((state) => {
                    state.token = newToken;
                    state.refreshToken = newRefreshToken;
                });

                // Persist to storage
                appStorage.setAuthToken(newToken);
                appStorage.setRefreshToken(newRefreshToken);
            } catch (error) {
                // If refresh fails, logout user
                get().logout();
                throw error;
            }
        },
    }))
);

/**
 * Selectors untuk optimized re-renders
 * Gunakan selectors ini untuk subscribe ke specific state
 */
export const authSelectors = {
    isAuthenticated: (state: AuthStore) => state.isAuthenticated,
    user: (state: AuthStore) => state.user,
    token: (state: AuthStore) => state.token,
    isLoading: (state: AuthStore) => state.isLoading,
};