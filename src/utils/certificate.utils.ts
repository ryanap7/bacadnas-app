import type { Certificate, CertificateStatus } from '~/types/certificate';

/**
 * Certificate Utilities
 * Helper functions untuk format data certificate
 */

// ─── Date Formatting ─────────────────────────────────────────

/**
 * Format ISO date to Indonesian date (DD MMMM YYYY)
 */
export function formatCertificateDate(isoString: string): string {
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
 * Get year from ISO string
 */
export function getCertificateYear(isoString: string): string {
    const date = new Date(isoString);
    return date.getFullYear().toString();
}

/**
 * Get short year (YY format)
 */
export function getShortYear(isoString: string): string {
    const year = getCertificateYear(isoString);
    return year.slice(-2);
}

// ─── Status Formatting ───────────────────────────────────────

/**
 * Get certificate status display text
 */
export function getCertificateStatusText(status: CertificateStatus): string {
    const statusMap: Record<CertificateStatus, string> = {
        ACTIVE: 'AKTIF',
        EXPIRED: 'KADALUARSA',
        REVOKED: 'DICABUT',
        PENDING: 'MENUNGGU',
    };

    return statusMap[status] || status;
}

/**
 * Get certificate status color
 */
export function getCertificateStatusColor(status: CertificateStatus): {
    background: string;
    text: string;
    border: string;
} {
    const colorMap: Record<CertificateStatus, { background: string; text: string; border: string }> = {
        ACTIVE: {
            background: '#10B98115',
            text: '#059669',
            border: '#10B981',
        },
        EXPIRED: {
            background: '#EF444415',
            text: '#DC2626',
            border: '#EF4444',
        },
        REVOKED: {
            background: '#71717A15',
            text: '#52525B',
            border: '#71717A',
        },
        PENDING: {
            background: '#F59E0B15',
            text: '#D97706',
            border: '#F59E0B',
        },
    };

    return colorMap[status] || colorMap.PENDING;
}

/**
 * Check if certificate is active
 */
export function isCertificateActive(certificate: Certificate): boolean {
    return certificate.status === 'ACTIVE';
}

/**
 * Check if certificate is expired
 */
export function isCertificateExpired(certificate: Certificate): boolean {
    if (certificate.status === 'EXPIRED') return true;

    const expiryDate = new Date(certificate.validUntil);
    const now = new Date();

    return expiryDate < now;
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(certificate: Certificate): number {
    const expiryDate = new Date(certificate.validUntil);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);

    return diffDays;
}

/**
 * Check if certificate is expiring soon (within 30 days)
 */
export function isCertificateExpiringSoon(certificate: Certificate): boolean {
    const daysUntilExpiry = getDaysUntilExpiry(certificate);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
}

/**
 * Get expiry warning message
 */
export function getExpiryWarningMessage(certificate: Certificate): string | null {
    if (isCertificateExpired(certificate)) {
        return 'Sertifikat telah kadaluarsa';
    }

    if (isCertificateExpiringSoon(certificate)) {
        const days = getDaysUntilExpiry(certificate);
        return `Sertifikat akan kadaluarsa dalam ${days} hari`;
    }

    return null;
}

// ─── Certificate Number Formatting ───────────────────────────

/**
 * Format certificate number with dashes
 * Example: CERT-KOM-202601-000001
 */
export function formatCertificateNumber(number: string): string {
    // Already formatted
    if (number.includes('-')) return number;

    // Add dashes if needed
    // This is a simple implementation, adjust based on actual format
    return number;
}

/**
 * Get short certificate number (last 6 digits)
 */
export function getShortCertificateNumber(number: string): string {
    const parts = number.split('-');
    return parts[parts.length - 1] || number;
}

// ─── Program & Category Formatting ───────────────────────────

/**
 * Get program type display name
 */
export function getProgramTypeName(programType: 'KOMCAD' | 'BELA_NEGARA'): string {
    return programType === 'KOMCAD'
        ? 'KOMPONEN CADANGAN'
        : 'BELA NEGARA';
}

/**
 * Get program badge text
 */
export function getProgramBadgeText(certificate: Certificate): string {
    const year = getShortYear(certificate.issuedDate);
    return `${certificate.programType} ${year}`;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
    const categoryMap: Record<string, string> = {
        'KOMCAD': 'Komponen Cadangan',
        'BELA_NEGARA': 'Bela Negara',
        'TRAINING': 'Pelatihan',
        'OTHER': 'Lainnya',
    };

    return categoryMap[category] || category;
}

// ─── Validation ──────────────────────────────────────────────

/**
 * Validate certificate number format
 */
export function isValidCertificateNumber(number: string): boolean {
    // Example format: CERT-KOM-202601-000001
    const pattern = /^CERT-[A-Z]+-\d{6}-\d{6}$/;
    return pattern.test(number);
}

// ─── Sorting & Filtering ─────────────────────────────────────

/**
 * Sort certificates by issue date (newest first)
 */
export function sortCertificatesByDate(certificates: Certificate[]): Certificate[] {
    return [...certificates].sort((a, b) => {
        return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime();
    });
}

/**
 * Filter active certificates
 */
export function filterActiveCertificates(certificates: Certificate[]): Certificate[] {
    return certificates.filter(cert => cert.status === 'ACTIVE');
}

/**
 * Filter expired certificates
 */
export function filterExpiredCertificates(certificates: Certificate[]): Certificate[] {
    return certificates.filter(cert =>
        cert.status === 'EXPIRED' || isCertificateExpired(cert)
    );
}

/**
 * Group certificates by year
 */
export function groupCertificatesByYear(certificates: Certificate[]): Record<string, Certificate[]> {
    return certificates.reduce((acc, cert) => {
        const year = getCertificateYear(cert.issuedDate);
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(cert);
        return acc;
    }, {} as Record<string, Certificate[]>);
}

// ─── Share & Download ────────────────────────────────────────

/**
 * Generate share message for certificate
 */
export function generateShareMessage(certificate: Certificate, userName: string): string {
    return `Sertifikat ${certificate.title}

Nama: ${userName}
No. Sertifikat: ${certificate.certificateNumber}
Terbit: ${formatCertificateDate(certificate.issuedDate)}
Status: ${getCertificateStatusText(certificate.status)}

Diterbitkan oleh ${certificate.issuedBy}`;
}

/**
 * Get certificate file name for download
 */
export function getCertificateFileName(certificate: Certificate): string {
    const date = formatCertificateDate(certificate.issuedDate).replace(/\s/g, '-');
    return `Sertifikat-${certificate.programType}-${certificate.certificateNumber}-${date}.pdf`;
}

// ─── Display Helpers ─────────────────────────────────────────

/**
 * Get certificate validity period text
 */
export function getValidityPeriodText(certificate: Certificate): string {
    const issuedDate = formatCertificateDate(certificate.issuedDate);
    const validUntil = formatCertificateDate(certificate.validUntil);

    // Check if it's "forever valid"
    const expiryDate = new Date(certificate.validUntil);
    const farFuture = new Date('2099-12-31');

    if (expiryDate > farFuture) {
        return `Berlaku Selamanya (sejak ${issuedDate})`;
    }

    return `${issuedDate} - ${validUntil}`;
}

/**
 * Get authenticity count
 */
export function getAuthenticityCount(certificate: Certificate): number {
    return certificate.authenticity?.length || 0;
}

/**
 * Check if certificate has all authenticity checks
 */
export function hasCompleteAuthenticity(certificate: Certificate): boolean {
    return getAuthenticityCount(certificate) >= 3;
}