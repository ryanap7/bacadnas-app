import type { Event, Notification, NotificationType } from '~/types/dashboard';

/**
 * Dashboard Utilities
 * Helper functions untuk format data dashboard
 */

// ─── Notification Utilities ──────────────────────────────────

/**
 * Format notification time (relative time)
 */
export function formatNotificationTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'BARU SAJA';
    } else if (diffMins < 60) {
        return `${diffMins} MENIT YANG LALU`;
    } else if (diffHours < 24) {
        return `${diffHours} JAM YANG LALU`;
    } else if (diffDays < 7) {
        return `${diffDays} HARI YANG LALU`;
    } else {
        return formatDate(isoString);
    }
}

/**
 * Get notification type color
 */
export function getNotificationTypeColor(type: NotificationType): {
    border: string;
    background: string;
    icon: string;
} {
    const colors = {
        SUCCESS: {
            border: '#10B981',
            background: '#10B98115',
            icon: '#059669',
        },
        INFO: {
            border: '#3B82F6',
            background: '#3B82F615',
            icon: '#2563EB',
        },
        WARNING: {
            border: '#F59E0B',
            background: '#F59E0B15',
            icon: '#D97706',
        },
        ERROR: {
            border: '#EF4444',
            background: '#EF444415',
            icon: '#DC2626',
        },
    };

    return colors[type] || colors.INFO;
}

/**
 * Get notification icon name
 */
export function getNotificationIcon(type: NotificationType): string {
    const icons = {
        SUCCESS: 'checkmark-circle',
        INFO: 'information-circle',
        WARNING: 'warning',
        ERROR: 'close-circle',
    };

    return icons[type] || 'information-circle';
}

/**
 * Sort notifications (unread first, then by date)
 */
export function sortNotifications(notifications: Notification[]): Notification[] {
    return [...notifications].sort((a, b) => {
        // Unread first
        if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
        }
        // Then by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

// ─── Event Utilities ─────────────────────────────────────────

/**
 * Format event date
 */
export function formatEventDate(isoString: string): {
    date: string;
    month: string;
    year: string;
    fullDate: string;
} {
    const date = new Date(isoString);
    const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
        'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
    ];
    const fullMonths = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return {
        date: date.getDate().toString(),
        month: months[date.getMonth()],
        year: date.getFullYear().toString(),
        fullDate: `${date.getDate()} ${fullMonths[date.getMonth()]} ${date.getFullYear()}`,
    };
}

/**
 * Format event time
 */
export function formatEventTime(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} WIB`;
}

/**
 * Get event time range
 */
export function getEventTimeRange(startDate: string, endDate: string): string {
    return `${formatEventTime(startDate)} - ${formatEventTime(endDate)}`;
}

/**
 * Check if event is today
 */
export function isEventToday(isoString: string): boolean {
    const eventDate = new Date(isoString);
    const today = new Date();

    return (
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if event is upcoming (within next 7 days)
 */
export function isEventUpcoming(isoString: string): boolean {
    const eventDate = new Date(isoString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    return diffDays >= 0 && diffDays <= 7;
}

/**
 * Get days until event
 */
export function getDaysUntilEvent(isoString: string): number {
    const eventDate = new Date(isoString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    return Math.ceil(diffMs / 86400000);
}

/**
 * Sort events by date (nearest first)
 */
export function sortEvents(events: Event[]): Event[] {
    return [...events].sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
}

// ─── General Utilities ───────────────────────────────────────

/**
 * Format date (DD MMM YYYY)
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format NIK with spacing
 */
export function formatNIK(nik: string, maskDigits: number = 5): string {
    if (!nik) return '';

    // Mask last N digits
    const visiblePart = nik.slice(0, -maskDigits);
    const maskedPart = 'X'.repeat(Math.min(maskDigits, nik.length - visiblePart.length));
    const masked = visiblePart + maskedPart;

    // Add space every 4 digits
    return masked.match(/.{1,4}/g)?.join(' ') || masked;
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(user: any): number {
    const requiredFields = [
        'fullName',
        'nik',
        'birthPlace',
        'birthDate',
        'gender',
        'phone',
        'province',
        'city',
        'district',
        'subDistrict',
        'postalCode',
        'address',
        'selectedProgram',
    ];

    const filledFields = requiredFields.filter(field => {
        const value = user[field];
        return value && value.toString().trim() !== '';
    });

    return Math.round((filledFields.length / requiredFields.length) * 100);
}

/**
 * Get program display name
 */
export function getProgramDisplayName(program: 'KOMCAD' | 'BELA_NEGARA'): string {
    return program === 'KOMCAD'
        ? 'KOMCAD'
        : 'BELA NEGARA';
}

/**
 * Get program subtitle
 */
export function getProgramSubtitle(program: 'KOMCAD' | 'BELA_NEGARA'): string {
    return program === 'KOMCAD'
        ? 'Komponen Cadangan Matra Darat'
        : 'Program Bela Negara';
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Get event capacity info
 */
export function getEventCapacityInfo(event: Event): {
    registered: number;
    capacity: number;
    percentage: number;
    isFull: boolean;
} {
    const registered = event.registeredCount || 0;
    const capacity = event.capacity || 0;
    const percentage = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
    const isFull = registered >= capacity && capacity > 0;

    return {
        registered,
        capacity,
        percentage,
        isFull,
    };
}