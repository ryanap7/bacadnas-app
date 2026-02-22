import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { OFFLINE_CONFIG } from '~/constants/api';
import { apiClient } from '~/services/api.client';
import { networkService } from '~/services/network.service';

/**
 * useOfflineSync Hook
 * Automatically processes offline queue when network becomes available
 */
export function useOfflineSync() {
    const appState = useRef(AppState.currentState);
    const syncInterval = useRef<NodeJS.Timeout | any>(undefined);

    useEffect(() => {
        // Process queue on mount
        processQueue();

        // Subscribe to network changes
        const unsubscribe = networkService.subscribe(async (state) => {
            if (state.isConnected && state.isInternetReachable !== false) {
                await processQueue();
            }
        });

        // Subscribe to app state changes
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Setup periodic sync
        setupPeriodicSync();

        return () => {
            unsubscribe();
            subscription.remove();
            if (syncInterval.current) {
                clearInterval(syncInterval.current);
            }
        };
    }, []);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        // App became active - process queue
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            await processQueue();
        }
        appState.current = nextAppState;
    };

    const processQueue = async () => {
        try {
            await apiClient.processOfflineQueue();
        } catch (error) {
            console.error('Error processing offline queue:', error);
        }
    };

    const setupPeriodicSync = () => {
        syncInterval.current = setInterval(async () => {
            const isOnline = await networkService.isOnline();
            if (isOnline) {
                await processQueue();
            }
        }, OFFLINE_CONFIG.SYNC_INTERVAL);
    };

    return {
        processQueue,
    };
}