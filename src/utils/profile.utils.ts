import type { User } from '~/types/api';

/**
 * Profile Utilities
 * Helper functions untuk format data profile
 */

/**
 * Format NIK dengan spacing (1234 5678 9012 3456)
 */
export function formatNIK(nik: string): string {
    // Remove any existing spaces
    const cleaned = nik.replace(/\s/g, '');

    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || nik;

    return formatted;
}

/**
 * Format date dari ISO string ke format Indonesia (DD MMMM YYYY)
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

/**
 * Format phone number (+62 812 3456 7890)
 */
export function formatPhone(phone: string): string {
    // Remove any existing formatting
    const cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62
    const withCountryCode = cleaned.startsWith('0')
        ? '62' + cleaned.slice(1)
        : cleaned.startsWith('62')
            ? cleaned
            : '62' + cleaned;

    // Format as +62 XXX XXXX XXXX
    const match = withCountryCode.match(/^(\d{2})(\d{3})(\d{4})(\d+)$/);
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }

    return '+' + withCountryCode;
}

/**
 * Format gender dari MALE/FEMALE ke Laki-laki/Perempuan
 */
export function formatGender(gender: 'MALE' | 'FEMALE'): string {
    return gender === 'MALE' ? 'Laki-laki' : 'Perempuan';
}

/**
 * Format program name
 */
export function formatProgramName(program: 'KOMCAD' | 'BELA_NEGARA'): string {
    return program === 'KOMCAD' ? 'KOMCAD' : 'BELA NEGARA';
}

/**
 * Get year from ISO date string
 */
export function getYear(isoString: string): string {
    const date = new Date(isoString);
    return date.getFullYear().toString();
}

/**
 * Format verification status
 */
export function formatVerificationStatus(isVerified: boolean): string {
    return isVerified ? 'AKTIF' : 'MENUNGGU VERIFIKASI';
}

/**
 * Get verification badge color
 */
export function getVerificationBadgeColor(isVerified: boolean): {
    background: string;
    text: string;
} {
    return isVerified
        ? { background: '#10B98115', text: '#059669' } // success colors
        : { background: '#F5970215', text: '#F59702' }; // warning colors
}

/**
 * Format expertise array to string
 */
export function formatExpertise(expertise: string[]): string {
    if (!expertise || expertise.length === 0) {
        return '-';
    }
    return expertise.join(', ');
}

/**
 * Get full address string
 */
export function getFullAddress(user: User): string {
    return `${user.address}, ${user.subDistrict}, ${user.district}`;
}

/**
 * Check if profile data is complete
 */
export function isProfileComplete(user: User): boolean {
    const requiredFields = [
        user.fullName,
        user.nik,
        user.birthPlace,
        user.birthDate,
        user.gender,
        user.phone,
        user.province,
        user.city,
        user.district,
        user.subDistrict,
        user.postalCode,
        user.address,
        user.selectedProgram,
    ];

    return requiredFields.every(field => field && field.toString().trim() !== '');
}

/**
 * Get avatar initials from full name
 */
export function getAvatarInitials(fullName: string): string {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].slice(0, 2).toUpperCase();
}