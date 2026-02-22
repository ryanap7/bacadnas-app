import { User } from '~/types/api';
import { appStorage, storageHelper } from '~/utils/storage';


/**
 * Queued Request Type untuk offline support
 */
export interface QueuedRequest {
    id: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
    timestamp: number;
    retryCount: number;
}

/**
 * Storage Service
 * Wrapper around MMKV storage untuk auth dan offline queue
 */
class StorageService {
    // ─── Auth Storage ────────────────────────────────────────────

    setAuthToken(token: string): void {
        appStorage.setAuthToken(token);
    }

    getAuthToken(): string | undefined {
        return appStorage.getAuthToken();
    }

    setRefreshToken(token: string): void {
        appStorage.setRefreshToken(token);
    }

    getRefreshToken(): string | undefined {
        return appStorage.getRefreshToken();
    }

    setUserData(user: User): void {
        appStorage.setUserData(user);
    }

    getUserData(): User | undefined {
        return appStorage.getUserData<User>();
    }

    setIsAuthenticated(value: boolean): void {
        appStorage.setIsAuthenticated(value);
    }

    getIsAuthenticated(): boolean {
        return appStorage.isAuthenticated();
    }

    clearAuthData(): void {
        appStorage.clearAuthData();
    }

    // ─── Offline Queue Storage ───────────────────────────────────

    getOfflineQueue(): QueuedRequest[] {
        const queue = storageHelper.getObject<QueuedRequest[]>('offline_queue');
        return queue ?? [];
    }

    addToOfflineQueue(request: QueuedRequest): void {
        const queue = this.getOfflineQueue();
        queue.push(request);
        storageHelper.setObject('offline_queue', queue);
    }

    removeFromOfflineQueue(requestId: string): void {
        const queue = this.getOfflineQueue();
        const filtered = queue.filter((req) => req.id !== requestId);
        storageHelper.setObject('offline_queue', filtered);
    }

    clearOfflineQueue(): void {
        storageHelper.delete('offline_queue');
    }

    updateQueuedRequest(requestId: string, updates: Partial<QueuedRequest>): void {
        const queue = this.getOfflineQueue();
        const updated = queue.map((req) =>
            req.id === requestId ? { ...req, ...updates } : req
        );
        storageHelper.setObject('offline_queue', updated);
    }

    // ─── Sync State ──────────────────────────────────────────────

    setLastSync(timestamp: number): void {
        storageHelper.setNumber('last_sync', timestamp);
    }

    getLastSync(): number | undefined {
        return storageHelper.getNumber('last_sync');
    }

    // ─── Generic Storage ─────────────────────────────────────────

    setItem<T>(key: string, value: T): void {
        storageHelper.setObject(key, value);
    }

    getItem<T>(key: string): T | undefined {
        return storageHelper.getObject<T>(key);
    }

    removeItem(key: string): void {
        storageHelper.delete(key);
    }

    clear(): void {
        storageHelper.clearAll();
    }
}

export const storageService = new StorageService();