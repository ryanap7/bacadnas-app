import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT, OFFLINE_CONFIG } from '~/constants/api';
import type { ApiResponse, QueuedRequest } from '~/types/api';
import { networkService } from './network.service';
import { storageService } from './storage.service';

/**
 * API Client with Offline Support
 */
class ApiClient {
    private client: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
    }> = [];

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            async (config) => {
                // Add auth token if available
                const token = await storageService.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Handle 401 - Token expired
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // Queue the request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                return this.client(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.isRefreshing = false;

                        // Retry all queued requests
                        this.failedQueue.forEach((callback) => callback.resolve(newToken));
                        this.failedQueue = [];

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.isRefreshing = false;
                        this.failedQueue.forEach((callback) => callback.reject(refreshError));
                        this.failedQueue = [];

                        // Clear auth data and redirect to login
                        await storageService.clearAuthData();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async refreshToken(): Promise<string> {
        const refreshToken = await storageService.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.client.post('/api/v1/auth/refresh', {
            refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data.data;
        await storageService.setAuthToken(token);
        if (newRefreshToken) {
            await storageService.setRefreshToken(newRefreshToken);
        }

        return token;
    }

    /**
     * Make API request with offline support
     */
    async request<T = any>(
        config: AxiosRequestConfig,
        offlineSupport = true
    ): Promise<ApiResponse<T>> {
        // Check network status
        const isOnline = await networkService.isOnline();

        if (!isOnline && offlineSupport) {
            // Queue request for later
            // await this.queueRequest(config);
            throw new Error('OFFLINE');
        }

        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Network error - queue if offline support enabled
                if (!error.response && offlineSupport) {
                    // await this.queueRequest(config);
                    throw new Error('OFFLINE');
                }

                // Server error
                throw {
                    success: false,
                    message: error.response?.data?.message || error.message,
                    errors: error.response?.data?.errors,
                };
            }

            throw error;
        }
    }

    /**
     * Queue request for offline processing
     */
    private async queueRequest(config: AxiosRequestConfig): Promise<void> {
        const queuedRequest: QueuedRequest = {
            id: Math.floor(Date.now() / 1000).toString(),
            endpoint: config.url || '',
            method: (config.method?.toUpperCase() as any) || 'GET',
            data: config.data,
            headers: config.headers as Record<string, string>,
            timestamp: Date.now(),
            retryCount: 0,
        };

        await storageService.addToOfflineQueue(queuedRequest);
    }

    /**
     * Process offline queue
     */
    async processOfflineQueue(): Promise<void> {
        const isOnline = await networkService.isOnline();
        if (!isOnline) return;

        const queue = await storageService.getOfflineQueue();
        if (queue.length === 0) return;

        for (const request of queue) {
            try {
                // Check retry limit
                if (request.retryCount >= OFFLINE_CONFIG.MAX_RETRY) {
                    await storageService.removeFromOfflineQueue(request.id);
                    continue;
                }

                // Execute request
                await this.client.request({
                    url: request.endpoint,
                    method: request.method,
                    data: request.data,
                    headers: request.headers,
                });

                // Success - remove from queue
                await storageService.removeFromOfflineQueue(request.id);
            } catch (error) {
                // Failed - increment retry count
                await storageService.updateQueuedRequest(request.id, {
                    retryCount: request.retryCount + 1,
                });
            }

            // Delay between requests
            await new Promise((resolve) => setTimeout(resolve, OFFLINE_CONFIG.RETRY_DELAY));
        }

        // Update last sync time
        await storageService.setLastSync(Date.now());
    }

    /**
     * HTTP Methods
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data });
    }

    async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data });
    }

    async patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PATCH', url, data });
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }
}

export const apiClient = new ApiClient();