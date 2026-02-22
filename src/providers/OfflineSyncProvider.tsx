import { useOfflineSync } from '~/hooks/useOfflineSync';

/**
 * OfflineSyncProvider
 * Setup automatic offline queue processing
 * Place this at the root of your app
 */
export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    useOfflineSync();

    return <>{children}</>;
}