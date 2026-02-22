import { Appearance } from 'react-native';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { storageHelper, StorageKeys } from '~/utils/storage';
import type { AppStore } from './store.types';

/**
 * Get initial theme from storage or system
 */
const getInitialTheme = (): 'light' | 'dark' | 'system' => {
    const storedTheme = storageHelper.getString(StorageKeys.THEME);

    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        return storedTheme;
    }

    // Default to system
    return 'system';
};

/**
 * Get actual theme (resolve 'system' to actual theme)
 */
const getActualTheme = (theme: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
    if (theme === 'system') {
        const systemTheme = Appearance.getColorScheme();
        return systemTheme === 'dark' ? 'dark' : 'light';
    }
    return theme;
};

/**
 * Initial App State
 * Loaded dari MMKV storage untuk persistence
 */
const getInitialState = () => {
    const hasSeenOnboarding = storageHelper.getBoolean(StorageKeys.HAS_SEEN_ONBOARDING) ?? false;
    const theme = getInitialTheme();
    const language = (storageHelper.getString(StorageKeys.LANGUAGE) as 'id' | 'en') ?? 'id';
    const notificationsEnabled = storageHelper.getBoolean(StorageKeys.NOTIFICATIONS_ENABLED) ?? true;

    return {
        hasSeenOnboarding,
        isFirstLaunch: !hasSeenOnboarding,
        theme,
        actualTheme: getActualTheme(theme),
        language,
        notificationsEnabled,
    };
};

/**
 * App Store
 * Manages app-level state seperti onboarding, theme, language, dll
 * Menggunakan Zustand + Immer untuk immutable state updates
 */
export const useAppStore = create<AppStore>()(
    immer((set, get) => ({
        // Initial state
        ...getInitialState(),

        // Actions
        setHasSeenOnboarding: (value: boolean) => {
            set((state) => {
                state.hasSeenOnboarding = value;
                state.isFirstLaunch = !value;
            });
            storageHelper.setBoolean(StorageKeys.HAS_SEEN_ONBOARDING, value);
        },

        setTheme: (theme) => {
            set((state) => {
                state.theme = theme;
                state.actualTheme = getActualTheme(theme);
            });
            storageHelper.setString(StorageKeys.THEME, theme);
        },

        toggleTheme: () => {
            const currentActualTheme = get().actualTheme;
            const newTheme = currentActualTheme === 'light' ? 'dark' : 'light';

            set((state) => {
                state.theme = newTheme;
                state.actualTheme = newTheme;
            });
            storageHelper.setString(StorageKeys.THEME, newTheme);
        },

        setLanguage: (language) => {
            set((state) => {
                state.language = language;
            });
            storageHelper.setString(StorageKeys.LANGUAGE, language);
        },

        setNotificationsEnabled: (enabled) => {
            set((state) => {
                state.notificationsEnabled = enabled;
            });
            storageHelper.setBoolean(StorageKeys.NOTIFICATIONS_ENABLED, enabled);
        },

        updateSystemTheme: () => {
            const currentTheme = get().theme;
            if (currentTheme === 'system') {
                const actualTheme = getActualTheme('system');
                set((state) => {
                    state.actualTheme = actualTheme;
                });
            }
        },

        resetApp: () => {
            set(() => ({
                hasSeenOnboarding: false,
                isFirstLaunch: true,
                theme: 'system',
                actualTheme: getActualTheme('system'),
                language: 'id',
                notificationsEnabled: true,
            }));

            storageHelper.setBoolean(StorageKeys.HAS_SEEN_ONBOARDING, false);
            storageHelper.setString(StorageKeys.THEME, 'system');
            storageHelper.setString(StorageKeys.LANGUAGE, 'id');
            storageHelper.setBoolean(StorageKeys.NOTIFICATIONS_ENABLED, true);
        },
    }))
);

/**
 * Selectors untuk optimized re-renders
 * Gunakan selectors ini untuk subscribe ke specific state
 */
export const appSelectors = {
    hasSeenOnboarding: (state: AppStore) => state.hasSeenOnboarding,
    isFirstLaunch: (state: AppStore) => state.isFirstLaunch,
    theme: (state: AppStore) => state.theme,
    actualTheme: (state: AppStore) => state.actualTheme,
    isDark: (state: AppStore) => state.actualTheme === 'dark',
    language: (state: AppStore) => state.language,
    notificationsEnabled: (state: AppStore) => state.notificationsEnabled,
};

/**
 * Subscribe to system theme changes
 * Call this in your root component
 */
export const subscribeToSystemTheme = () => {
    const subscription = Appearance.addChangeListener(() => {
        useAppStore.getState().updateSystemTheme();
    });

    return () => subscription.remove();
};