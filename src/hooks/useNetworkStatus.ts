import { useEffect, useState } from 'react';
import { networkService } from '~/services/network.service';
import type { NetworkState } from '~/types/api';

/**
 * useNetworkStatus Hook
 * Provides real-time network status
 */
export function useNetworkStatus() {
    const [networkState, setNetworkState] = useState<NetworkState>(() =>
        networkService.getCurrentState()
    );

    useEffect(() => {
        // Subscribe to network changes
        const unsubscribe = networkService.subscribe((state) => {
            setNetworkState(state);
        });

        // Get initial state
        networkService.getState().then(setNetworkState);

        return unsubscribe;
    }, []);

    return {
        isConnected: networkState.isConnected,
        isOnline: networkState.isConnected && networkState.isInternetReachable !== false,
        type: networkState.type,
        isInternetReachable: networkState.isInternetReachable,
    };
}