import { API_ENDPOINTS } from '~/constants/api';
import type { Certificate } from '~/types/certificate';
import { apiClient } from './api.client';
import { storageService } from './storage.service';

/**
 * Certificate Service
 * Handles certificate-related API calls
 */
class CertificateService {
    private readonly CACHE_KEY = 'certificates_data';
    private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    /**
     * Get user's certificates
     * GET /api/v1/certificates/my
     */
    async getMyCertificates(): Promise<Certificate[]> {
        try {
            const response = await apiClient.get<Certificate[]>(
                API_ENDPOINTS.CERTIFICATES.MY
            );

            if (response.status === 'success' && response.data) {
                // Cache certificates data
                this.cacheCertificates(response.data);
                return response.data;
            }

            throw new Error(response.message || 'Failed to fetch certificates');
        } catch (error: any) {
            // Handle offline error - return cached data
            if (error.message === 'OFFLINE') {
                const cachedData = this.getCachedCertificates();
                if (cachedData) {
                    return cachedData;
                }
                throw new Error('Tidak ada koneksi internet dan tidak ada data cache.');
            }

            throw error;
        }
    }

    /**
     * Get certificate detail
     * GET /api/v1/certificates/:id
     */
    async getCertificateDetail(certificateId: string): Promise<Certificate> {
        try {
            const response = await apiClient.get<Certificate>(
                API_ENDPOINTS.CERTIFICATES.DETAIL(certificateId)
            );

            if (response.status === 'success' && response.data) {
                return response.data;
            }

            throw new Error(response.message || 'Failed to fetch certificate detail');
        } catch (error: any) {
            // Handle offline error - try to get from cache
            if (error.message === 'OFFLINE') {
                const cached = this.getCachedCertificates();
                const certificate = cached?.find(c => c.id === certificateId);
                if (certificate) {
                    return certificate;
                }
                throw new Error('Tidak ada koneksi internet.');
            }

            throw error;
        }
    }

    // ─── Cache Management ────────────────────────────────────────
    /**
     * Cache certificates data
     */
    private cacheCertificates(data: Certificate[]): void {
        const cacheData = {
            data,
            timestamp: Date.now(),
        };
        storageService.setItem(this.CACHE_KEY, cacheData);
    }

    /**
     * Get cached certificates
     */
    getCachedCertificates(): Certificate[] | null {
        const cached = storageService.getItem<{
            data: Certificate[];
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
     * Clear cache
     */
    clearCache(): void {
        storageService.removeItem(this.CACHE_KEY);
    }
}

export const certificateService = new CertificateService();