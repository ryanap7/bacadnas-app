import { API_ENDPOINTS } from '~/constants/api';
import type { User } from '~/types/api';
import { apiClient } from './api.client';
import { storageService } from './storage.service';

/**
 * Profile Service
 * Handles user profile API calls
 */
class ProfileService {
    /**
     * Get current user profile
     * GET /api/v1/users/profile
     */
    async getProfile(): Promise<User> {
        try {
            const response = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);

            if (response.status === 'success' && response.data) {
                // Cache profile data
                storageService.setUserData(response.data);
                return response.data;
            }

            throw new Error(response.message || 'Failed to fetch profile');
        } catch (error: any) {
            // Handle offline error - return cached data
            if (error.message === 'OFFLINE') {
                const cachedUser = storageService.getUserData();
                if (cachedUser) {
                    return cachedUser;
                }
                throw new Error('Tidak ada koneksi internet dan tidak ada data cache.');
            }

            throw error;
        }
    }

    /**
     * Get cached profile data
     */
    getCachedProfile(): User | undefined {
        return storageService.getUserData();
    }

    /**
     * Clear cached profile data
     */
    clearCachedProfile(): void {
        storageService.clearAuthData();
    }
}

export const profileService = new ProfileService();