import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import type { NetworkState } from '~/types/api';

/**
 * Network Service
 * Handles network connectivity detection
 */
class NetworkService {
    private listeners: Set<(state: NetworkState) => void> = new Set();
    private currentState: NetworkState = {
        isConnected: true,
        isInternetReachable: null,
        type: null,
    };

    constructor() {
        this.init();
    }

    private init() {
        // Subscribe to network state changes
        NetInfo.addEventListener((state: NetInfoState) => {
            this.currentState = {
                isConnected: state.isConnected ?? false,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
            };

            // Notify all listeners
            this.listeners.forEach((listener) => listener(this.currentState));
        });
    }

    /**
     * Get current network state
     */
    async getState(): Promise<NetworkState> {
        const state = await NetInfo.fetch();
        return {
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        };
    }

    /**
     * Check if device is online
     */
    async isOnline(): Promise<boolean> {
        const state = await this.getState();
        return state.isConnected && state.isInternetReachable !== false;
    }

    /**
     * Subscribe to network state changes
     */
    subscribe(callback: (state: NetworkState) => void): () => void {
        this.listeners.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Get current state synchronously
     */
    getCurrentState(): NetworkState {
        return this.currentState;
    }
}

export const networkService = new NetworkService();