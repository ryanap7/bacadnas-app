/**
 * Dashboard API Types
 */

// ─── Dashboard User Type ─────────────────────────────────────
export interface DashboardUser {
    id: string;
    nik: string;
    fullName: string;
    selectedProgram: 'KOMCAD' | 'BELA_NEGARA';
}

// ─── Notification Types ──────────────────────────────────────
export type NotificationType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';

export interface Notification {
    id: string;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    readAt: string | null; // ISO String or null
    userId: string;
}

// ─── Event Types ─────────────────────────────────────────────
export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string; // ISO String
    endDate: string; // ISO String
    location: string;
    type: string;
    capacity?: number;
    registeredCount?: number;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

// ─── Dashboard Data Type ─────────────────────────────────────
export interface DashboardData {
    user: DashboardUser;
    notifications: Notification[];
    unreadNotifications: number;
    upcomingEvents: Event[];
    certificateCount: number;
}

// ─── Dashboard API Response ──────────────────────────────────
export interface DashboardResponse {
    status: 'success';
    message: string;
    data: DashboardData;
}

// ─── Mark Notification as Read Request ───────────────────────
export interface MarkNotificationReadRequest {
    notificationId: string;
}

export interface MarkNotificationReadResponse {
    status: 'success';
    message: string;
    data: {
        notification: Notification;
    };
}