import { API_ENDPOINTS } from '~/constants/api';
import type {
    DashboardData,
    Notification
} from '~/types/dashboard';
import { apiClient } from './api.client';
import { storageService } from './storage.service';

/**
 * Dashboard Service
 * Handles dashboard and notification API calls
 */
class DashboardService {
    private readonly CACHE_KEY = 'dashboard_data';
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Get dashboard data
     * GET /api/v1/users/dashboard
     */
    async getDashboard(): Promise<DashboardData> {
        try {
            const response = await apiClient.get<DashboardData>(
                API_ENDPOINTS.DASHBOARD.GET
            );

            if (response.status === 'success' && response.data) {
                // Cache dashboard data
                this.cacheDashboardData(response.data);
                return response.data;
            }

            throw new Error(response.message || 'Failed to fetch dashboard');
        } catch (error: any) {
            // Handle offline error - return cached data
            if (error.message === 'OFFLINE') {
                const cachedData = this.getCachedDashboard();
                if (cachedData) {
                    return cachedData;
                }
                throw new Error('Tidak ada koneksi internet dan tidak ada data cache.');
            }

            throw error;
        }
    }

    /**
     * Mark notification as read
     * PATCH /api/v1/notifications/:id/read
     */
    async markNotificationAsRead(notificationId: string): Promise<Notification> {
        try {
            const response = await apiClient.patch<{ notification: Notification }>(
                API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
            );

            if (response.status === 'success' && response.data) {
                // Update cached data
                this.updateNotificationInCache(response.data.notification);
                return response.data.notification;
            }

            throw new Error(response.message || 'Failed to mark notification as read');
        } catch (error: any) {
            // Handle offline error - update local cache
            if (error.message === 'OFFLINE') {
                const updatedNotification = this.markNotificationAsReadLocally(notificationId);
                if (updatedNotification) {
                    return updatedNotification;
                }
                throw new Error('Tidak ada koneksi internet.');
            }

            throw error;
        }
    }

    /**
     * Mark all notifications as read
     * PATCH /api/v1/notifications/read-all
     */
    async markAllNotificationsAsRead(): Promise<void> {
        try {
            const response = await apiClient.patch(
                API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
            );

            if (response.status === 'success') {
                // Update all notifications in cache
                this.markAllNotificationsAsReadInCache();
                return;
            }

            throw new Error(response.message || 'Failed to mark all notifications as read');
        } catch (error: any) {
            // Handle offline error
            if (error.message === 'OFFLINE') {
                this.markAllNotificationsAsReadInCache();
                return;
            }

            throw error;
        }
    }

    // ─── Cache Management ────────────────────────────────────────

    /**
     * Cache dashboard data
     */
    private cacheDashboardData(data: DashboardData): void {
        const cacheData = {
            data,
            timestamp: Date.now(),
        };
        storageService.setItem(this.CACHE_KEY, cacheData);
    }

    /**
     * Get cached dashboard data
     */
    getCachedDashboard(): DashboardData | null {
        const cached = storageService.getItem<{
            data: DashboardData;
            timestamp: number;
        }>(this.CACHE_KEY);

        if (!cached) return null;

        // Check if cache is still valid
        const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
        if (isExpired) {
            this.clearCache();
            return null;
        }

        return cached.data;
    }

    /**
     * Update notification in cache
     */
    private updateNotificationInCache(updatedNotification: Notification): void {
        const cached = this.getCachedDashboard();
        if (!cached) return;

        const updatedNotifications = cached.notifications.map(notif =>
            notif.id === updatedNotification.id ? updatedNotification : notif
        );

        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

        this.cacheDashboardData({
            ...cached,
            notifications: updatedNotifications,
            unreadNotifications: unreadCount,
        });
    }

    /**
     * Mark notification as read locally (offline)
     */
    private markNotificationAsReadLocally(notificationId: string): Notification | null {
        const cached = this.getCachedDashboard();
        if (!cached) return null;

        const notification = cached.notifications.find(n => n.id === notificationId);
        if (!notification) return null;

        const updatedNotification: Notification = {
            ...notification,
            isRead: true,
            readAt: new Date().toISOString(),
        };

        this.updateNotificationInCache(updatedNotification);
        return updatedNotification;
    }

    /**
     * Mark all notifications as read in cache
     */
    private markAllNotificationsAsReadInCache(): void {
        const cached = this.getCachedDashboard();
        if (!cached) return;

        const now = new Date().toISOString();
        const updatedNotifications = cached.notifications.map(notif => ({
            ...notif,
            isRead: true,
            readAt: notif.readAt || now,
        }));

        this.cacheDashboardData({
            ...cached,
            notifications: updatedNotifications,
            unreadNotifications: 0,
        });
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        storageService.removeItem(this.CACHE_KEY);
    }
}

export const dashboardService = new DashboardService();