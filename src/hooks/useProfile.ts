import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { profileService } from '~/services/profile.service';
import type { User } from '~/types/api';

interface UseProfileReturn {
    profile: User | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    isRefetching: boolean;
}

/**
 * useProfile Hook
 * Fetches and manages user profile data with caching
 */
export function useProfile(): UseProfileReturn {
    const queryClient = useQueryClient();

    const {
        data: profile,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<User, Error>({
        queryKey: ['profile'],
        queryFn: async () => {
            return await profileService.getProfile();
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
    });

    const handleRefetch = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        profile,
        isLoading,
        isError,
        error,
        refetch: handleRefetch,
        isRefetching,
    };
}

/**
 * Invalidate profile cache
 * Useful after profile updates
 */
export function useInvalidateProfile() {
    const queryClient = useQueryClient();

    return useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
    }, [queryClient]);
}