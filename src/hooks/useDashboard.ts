import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { dashboardService } from '~/services/dashboard.service';
import type { DashboardData, Notification } from '~/types/dashboard';

interface UseDashboardReturn {
    dashboard: DashboardData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    isRefetching: boolean;
}

/**
 * useDashboard Hook
 * Fetches and manages dashboard data with caching
 */
export function useDashboard(): UseDashboardReturn {
    const queryClient = useQueryClient();

    const {
        data: dashboard,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<DashboardData, Error>({
        queryKey: ['dashboard'],
        queryFn: async () => {
            return await dashboardService.getDashboard();
        },
        // Cache for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry once on error
        retry: 1,
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Don't refetch on mount if we have fresh data
        refetchOnMount: false,
        // Refetch interval (optional - every 5 minutes when app is active)
        refetchInterval: 5 * 60 * 1000,
    });

    const handleRefetch = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        dashboard,
        isLoading,
        isError,
        error,
        refetch: handleRefetch,
        isRefetching,
    };
}

/**
 * useMarkNotificationRead Hook
 * Mark single notification as read
 */
export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation<Notification, Error, string>({
        mutationFn: async (notificationId: string) => {
            return await dashboardService.markNotificationAsRead(notificationId);
        },
        onSuccess: () => {
            // Invalidate dashboard query to refetch
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

/**
 * useMarkAllNotificationsRead Hook
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: async () => {
            return await dashboardService.markAllNotificationsAsRead();
        },
        onSuccess: () => {
            // Invalidate dashboard query to refetch
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}

/**
 * Invalidate dashboard cache
 * Useful after profile updates or other changes
 */
export function useInvalidateDashboard() {
    const queryClient = useQueryClient();

    return useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }, [queryClient]);
}