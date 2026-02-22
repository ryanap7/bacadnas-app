import { API_ENDPOINTS } from '~/constants/api';
import type {
    LoginRequest,
    LoginResponse,
    NewUserResponse,
    RegistrationRequest,
    RegistrationResponse,
    SuccessLoginResponse,
    User,
} from '~/types/api';
import { apiClient } from './api.client';
import { storageService } from './storage.service';

/**
 * Auth Service
 * Handles authentication dan registration
 */
class AuthService {
    /**
     * Login with NIK
     */
    async login(request: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, request);

            // Handle success login
            if (response.requiresAction === 'dashboard') {
                const successResponse = response as SuccessLoginResponse;
                const { user, accessToken } = successResponse.data;

                // Save auth data
                this.saveAuthData(user, accessToken);

                return successResponse;
            }

            // Handle new user
            if (response.requiresAction === 'register') {
                return response as NewUserResponse;
            }

            throw new Error(response.message || 'Login failed');
        } catch (error: any) {
            // Handle offline error
            if (error.message === 'OFFLINE') {
                throw new Error(
                    'Tidak ada koneksi internet. Data akan disimpan dan dikirim saat online.'
                );
            }

            throw error;
        }
    }

    /**
     * Register new user
     */
    async register(request: RegistrationRequest): Promise<RegistrationResponse> {
        try {
            const response = await apiClient.post<{ user: User; accessToken: string }>(
                API_ENDPOINTS.AUTH.REGISTER,
                request
            );

            if (response.status === 'success' && response.data) {
                const { user, accessToken } = response.data;

                // Save auth data
                this.saveAuthData(user, accessToken);

                return response as RegistrationResponse;
            }

            throw new Error(response.message || 'Registration failed');
        } catch (error: any) {
            // Handle offline error
            if (error.message === 'OFFLINE') {
                throw new Error(
                    'Tidak ada koneksi internet. Data akan disimpan dan dikirim saat online.'
                );
            }

            throw error;
        }
    }

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User | undefined> {
        try {
            const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.USER.PROFILE);

            if (response.status === 'success' && response.data) {
                storageService.setUserData(response.data.user);
                return response.data.user;
            }
            return undefined;
        } catch (error) {
            // Fallback to cached user data
            return storageService.getUserData();
        }
    }

    /**
     * Save authentication data
     */
    private saveAuthData(user: User, token: string): void {
        storageService.setAuthToken(token);
        storageService.setUserData(user);
        storageService.setIsAuthenticated(true);
    }

    /**
     * Check authentication status
     */
    checkAuth(): {
        isAuthenticated: boolean;
        user: User | undefined;
    } {
        const isAuthenticated = storageService.getIsAuthenticated();
        const user = storageService.getUserData();
        const token = storageService.getAuthToken();

        return {
            isAuthenticated: isAuthenticated && !!token,
            user,
        };
    }

    /**
    * Logout
    * Clears auth token from server and local storage
    */
    async logout(): Promise<void> {
        storageService.clearAuthData();
    }
}

export const authService = new AuthService();