/**
 * API Constants & Configuration
 */

// Base URL dari environment variable
export const API_BASE_URL = process.env.API_BASE_URL || "https://bacadnas-service.digitalindotekno.com/api/v1"
export const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10);

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    USER: {
        PROFILE: '/users/profile',
    },
    DASHBOARD: {
        GET: '/users/dashboard',
    },
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        DELETE: (id: string) => `/notifications/${id}`,
    },
    CERTIFICATES: {
        MY: '/certificates/my',
        DETAIL: (id: string) => `/certificates/${id}`,
    },
} as const;

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: '@bacadnas:auth_token',
    REFRESH_TOKEN: '@bacadnas:refresh_token',
    USER_DATA: '@bacadnas:user_data',
    IS_AUTHENTICATED: '@bacadnas:is_authenticated',
    OFFLINE_QUEUE: '@bacadnas:offline_queue',
    LAST_SYNC: '@bacadnas:last_sync',
} as const;

/**
 * Offline Queue Config
 */
export const OFFLINE_CONFIG = {
    MAX_RETRY: 3,
    RETRY_DELAY: 1000,
    SYNC_INTERVAL: 30000, // 30 seconds
} as const;