import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'bacadnas-storage',
  encryptionKey: 'bacadnas-encryption-key-2024',
});

/**
 * Storage Keys
 * Centralized storage keys untuk consistency
 */
export const StorageKeys = {
  // Onboarding
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',

  // Authentication
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  IS_AUTHENTICATED: 'isAuthenticated',

  // User Preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',

  // Offline Support
  OFFLINE_QUEUE: 'offlineQueue',
  LAST_SYNC: 'lastSync',
} as const;

/**
 * Storage Helper Functions
 * Type-safe wrapper functions untuk MMKV operations
 */
export const storageHelper = {
  // String operations
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  // Number operations
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  // Object operations (dengan JSON serialization)
  getObject: <T>(key: string): T | undefined => {
    const jsonString = storage.getString(key);
    if (!jsonString) return undefined;

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      return undefined;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    try {
      const jsonString = JSON.stringify(value);
      storage.set(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying object for key "${key}":`, error);
    }
  },

  // Delete operations
  delete: (key: string): void => {
    storage.remove(key);
  },

  // Clear all storage
  clearAll: (): void => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};

/**
 * Specific storage functions untuk common use cases
 */
export const appStorage = {
  // Onboarding
  hasSeenOnboarding: (): boolean => {
    return storageHelper.getBoolean(StorageKeys.HAS_SEEN_ONBOARDING) ?? false;
  },

  setHasSeenOnboarding: (value: boolean): void => {
    storageHelper.setBoolean(StorageKeys.HAS_SEEN_ONBOARDING, value);
  },

  // Authentication
  getAuthToken: (): string | undefined => {
    return storageHelper.getString(StorageKeys.AUTH_TOKEN);
  },

  setAuthToken: (token: string): void => {
    storageHelper.setString(StorageKeys.AUTH_TOKEN, token);
  },

  removeAuthToken: (): void => {
    storageHelper.delete(StorageKeys.AUTH_TOKEN);
  },

  getRefreshToken: (): string | undefined => {
    return storageHelper.getString(StorageKeys.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    storageHelper.setString(StorageKeys.REFRESH_TOKEN, token);
  },

  removeRefreshToken: (): void => {
    storageHelper.delete(StorageKeys.REFRESH_TOKEN);
  },

  isAuthenticated: (): boolean => {
    return storageHelper.getBoolean(StorageKeys.IS_AUTHENTICATED) ?? false;
  },

  setIsAuthenticated: (value: boolean): void => {
    storageHelper.setBoolean(StorageKeys.IS_AUTHENTICATED, value);
  },

  // User Data
  getUserData: <T>(): T | undefined => {
    return storageHelper.getObject<T>(StorageKeys.USER_DATA);
  },

  setUserData: <T>(data: T): void => {
    storageHelper.setObject(StorageKeys.USER_DATA, data);
  },

  removeUserData: (): void => {
    storageHelper.delete(StorageKeys.USER_DATA);
  },

  // Clear auth data (logout)
  clearAuthData: (): void => {
    storageHelper.delete(StorageKeys.AUTH_TOKEN);
    storageHelper.delete(StorageKeys.REFRESH_TOKEN);
    storageHelper.delete(StorageKeys.USER_DATA);
    storageHelper.setBoolean(StorageKeys.IS_AUTHENTICATED, false);
  },

  // Offline Queue
  getOfflineQueue: <T>(): T[] => {
    return storageHelper.getObject<T[]>(StorageKeys.OFFLINE_QUEUE) ?? [];
  },

  setOfflineQueue: <T>(queue: T[]): void => {
    storageHelper.setObject(StorageKeys.OFFLINE_QUEUE, queue);
  },

  clearOfflineQueue: (): void => {
    storageHelper.delete(StorageKeys.OFFLINE_QUEUE);
  },

  // Last Sync
  getLastSync: (): number | undefined => {
    return storageHelper.getNumber(StorageKeys.LAST_SYNC);
  },

  setLastSync: (timestamp: number): void => {
    storageHelper.setNumber(StorageKeys.LAST_SYNC, timestamp);
  },
};