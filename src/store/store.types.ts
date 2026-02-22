/**
 * User Type Definition
 */
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role?: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Auth State Type
 */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
}

/**
 * Auth Actions Type
 */
export interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: RegisterData) => Promise<void>;
    updateUser: (data: Partial<User>) => void;
    setToken: (token: string, refreshToken?: string) => void;
    checkAuth: () => void;
    refreshAuthToken: () => Promise<void>;
}

/**
 * Register Data Type
 */
export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

/**
 * Theme Type
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type ActualTheme = 'light' | 'dark';

/**
 * Language Type
 */
export type Language = 'id' | 'en';

/**
 * App State Type
 */
export interface AppState {
    hasSeenOnboarding: boolean;
    isFirstLaunch: boolean;
    theme: ThemeMode;
    actualTheme: ActualTheme;
    language: Language;
    notificationsEnabled: boolean;
}

/**
 * App Actions Type
 */
export interface AppActions {
    setHasSeenOnboarding: (value: boolean) => void;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    setLanguage: (language: Language) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    updateSystemTheme: () => void;
    resetApp: () => void;
}

/**
 * Combined Auth Store Type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Combined App Store Type
 */
export type AppStore = AppState & AppActions;